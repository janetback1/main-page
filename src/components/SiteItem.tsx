import React, { useRef, useState } from 'react';

export interface Site {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

interface SiteItemProps {
  site: Site;
  isOrganizeMode: boolean;
  isDragging: boolean;
  onStartDrag: (siteId: string) => void;
  onDragMoveTo: (targetSiteId: string) => void;
  onEndDrag: () => void;
  onLongPressOrContext: (site: Site) => void;
  onPlaceholderClick: (site: Site) => void;
}

// 自动加载 src/assets/icons/ 下的本地 SVG 图标
const iconAssets = import.meta.glob<string>('../assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

function resolveLocalIconUrl(iconValue?: string): string | null {
  if (!iconValue) return null;
  const trimmed = iconValue.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  const key = `../assets/icons/${trimmed}`;
  return iconAssets[key] || null;
}

function getNativeFaviconUrl(url?: string): string | null {
  if (!url || url === 'URL_PLACEHOLDER') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return `${parsed.origin}/favicon.ico`;
    }
    return null;
  } catch {
    return null;
  }
}

function getFallbackMonogram(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}

const LONG_PRESS_DURATION = 450;
const MOVE_CANCEL_THRESHOLD = 10;

export const SiteItem: React.FC<SiteItemProps> = ({
  site,
  isOrganizeMode,
  isDragging,
  onStartDrag,
  onDragMoveTo,
  onEndDrag,
  onLongPressOrContext,
  onPlaceholderClick,
}) => {
  const [localError, setLocalError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const timerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
  const isPointerDraggingRef = useRef(false);
  const startCoordRef = useRef<{ x: number; y: number } | null>(null);

  const localIconUrl = resolveLocalIconUrl(site.icon);
  const nativeFaviconUrl = getNativeFaviconUrl(site.url);
  const isPlaceholder = !site.url || site.url === 'URL_PLACEHOLDER';

  const activeIconUrl =
    localIconUrl && !localError
      ? localIconUrl
      : nativeFaviconUrl && !faviconError
        ? nativeFaviconUrl
        : null;

  const handleImgError = () => {
    if (localIconUrl && !localError) {
      setLocalError(true);
    } else {
      setFaviconError(true);
    }
  };

  const clearLongPressTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const detectTargetAndReorder = (clientX: number, clientY: number) => {
    const elem = document.elementFromPoint(clientX, clientY);
    const targetNode = elem?.closest('[data-site-id]') as HTMLElement | null;
    const targetId = targetNode?.getAttribute('data-site-id');
    if (targetId && targetId !== site.id) {
      onDragMoveTo(targetId);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    longPressTriggeredRef.current = false;
    startCoordRef.current = { x: e.clientX, y: e.clientY };

    // 整理模式下：按下即可直接拖动排序
    if (isOrganizeMode) {
      e.preventDefault();
      isPointerDraggingRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // 忽略部分浏览器不支持 pointer capture 的情况
      }
      onStartDrag(site.id);
      return;
    }

    // 正常模式下：长按触发
    clearLongPressTimer();
    const currentTarget = e.currentTarget;
    const pointerId = e.pointerId;
    timerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      isPointerDraggingRef.current = true;
      try {
        currentTarget.setPointerCapture(pointerId);
      } catch {
        // 忽略异常
      }
      onStartDrag(site.id);
    }, LONG_PRESS_DURATION);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (isPointerDraggingRef.current) {
      e.preventDefault();
      // 如果是在正常模式下长按后开始移动，标记为已发生拖动，松手时不弹编辑菜单
      if (startCoordRef.current) {
        const dx = Math.abs(e.clientX - startCoordRef.current.x);
        const dy = Math.abs(e.clientY - startCoordRef.current.y);
        if (dx > 6 || dy > 6) {
          longPressTriggeredRef.current = false;
        }
      }
      detectTargetAndReorder(e.clientX, e.clientY);
      return;
    }

    if (!startCoordRef.current || timerRef.current === null) return;
    const dx = Math.abs(e.clientX - startCoordRef.current.x);
    const dy = Math.abs(e.clientY - startCoordRef.current.y);
    if (dx > MOVE_CANCEL_THRESHOLD || dy > MOVE_CANCEL_THRESHOLD) {
      clearLongPressTimer();
    }
  };

  const finishPointerInteraction = (e: React.PointerEvent<HTMLAnchorElement>) => {
    clearLongPressTimer();

    if (isPointerDraggingRef.current) {
      isPointerDraggingRef.current = false;
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // 忽略异常
      }
      onEndDrag();

      // 如果是在正常模式下原地长按（未拖动位移），打开编辑/删除菜单
      if (!isOrganizeMode && longPressTriggeredRef.current) {
        onLongPressOrContext(site);
      }
      // 阻止紧随其后的 click 跳转
      longPressTriggeredRef.current = true;
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    clearLongPressTimer();
    if (isOrganizeMode) return;
    longPressTriggeredRef.current = true;
    onLongPressOrContext(site);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 整理模式下禁止触发网站跳转
    if (isOrganizeMode) {
      e.preventDefault();
      return;
    }

    // 刚刚触发过长按或拖动时，阻止松手后的链接跳转
    if (longPressTriggeredRef.current) {
      e.preventDefault();
      longPressTriggeredRef.current = false;
      return;
    }

    if (isPlaceholder) {
      e.preventDefault();
      onPlaceholderClick(site);
    }
  };

  return (
    <a
      data-site-id={site.id}
      href={isPlaceholder ? '#placeholder' : site.url}
      target={isPlaceholder ? undefined : '_blank'}
      rel={isPlaceholder ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerInteraction}
      onPointerCancel={finishPointerInteraction}
      draggable={false}
      title={isOrganizeMode ? `拖动以移动 ${site.name}` : site.name}
      className={`group flex w-full max-w-[76px] sm:max-w-[92px] flex-col items-center select-none text-center focus:outline-none rounded-xl p-1 transition-transform duration-150 ${
        isOrganizeMode ? 'touch-none cursor-grab active:cursor-grabbing' : ''
      } ${
        isDragging
          ? 'scale-105 opacity-75 bg-slate-200/70 ring-1 ring-slate-300 z-20'
          : isOrganizeMode
            ? 'ring-1 ring-dashed ring-slate-300/80 bg-white/60'
            : ''
      }`}
    >
      {/* 图标区域：无外框卡片，直接展示图标 */}
      <div
        className={`site-icon-box flex items-center justify-center transition-transform duration-150 ${
          !isOrganizeMode ? 'group-active:scale-95' : ''
        }`}
      >
        {activeIconUrl ? (
          <img
            src={activeIconUrl}
            alt={site.name}
            loading="lazy"
            draggable={false}
            referrerPolicy="no-referrer"
            onError={handleImgError}
            className="site-icon-img pointer-events-none select-none"
          />
        ) : (
          <span className="site-icon-box flex items-center justify-center rounded-xl bg-slate-200/80 text-base sm:text-lg font-semibold text-slate-700">
            {getFallbackMonogram(site.name)}
          </span>
        )}
      </div>

      {/* 网站名称：紧凑排在图标下方 */}
      <span className="mt-1.5 w-full truncate px-0.5 text-xs leading-tight text-slate-700 group-hover:text-slate-950">
        {site.name}
      </span>
    </a>
  );
};

export default SiteItem;

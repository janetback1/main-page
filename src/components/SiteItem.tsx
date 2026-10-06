import React, { useRef, useState } from 'react';

export interface Site {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

interface SiteItemProps {
  site: Site;
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

const LONG_PRESS_DURATION = 500;
const MOVE_CANCEL_THRESHOLD = 10;

export const SiteItem: React.FC<SiteItemProps> = ({
  site,
  onLongPressOrContext,
  onPlaceholderClick,
}) => {
  const [localError, setLocalError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const timerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
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

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    // 忽略鼠标右键按下（右键由 onContextMenu 处理）
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    longPressTriggeredRef.current = false;
    startCoordRef.current = { x: e.clientX, y: e.clientY };

    clearLongPressTimer();
    timerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      onLongPressOrContext(site);
    }, LONG_PRESS_DURATION);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!startCoordRef.current || timerRef.current === null) return;
    const dx = Math.abs(e.clientX - startCoordRef.current.x);
    const dy = Math.abs(e.clientY - startCoordRef.current.y);
    if (dx > MOVE_CANCEL_THRESHOLD || dy > MOVE_CANCEL_THRESHOLD) {
      clearLongPressTimer();
    }
  };

  const handlePointerUpOrCancel = () => {
    clearLongPressTimer();
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    clearLongPressTimer();
    longPressTriggeredRef.current = true;
    onLongPressOrContext(site);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 如果刚刚触发了长按菜单，阻止松手后的链接跳转
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
      href={isPlaceholder ? '#placeholder' : site.url}
      target={isPlaceholder ? undefined : '_blank'}
      rel={isPlaceholder ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onPointerLeave={handlePointerUpOrCancel}
      draggable={false}
      title={site.name}
      className="group flex w-full max-w-[76px] sm:max-w-[92px] flex-col items-center select-none text-center focus:outline-none"
    >
      {/* 图标区域：无外框卡片，直接展示图标 */}
      <div className="site-icon-box flex items-center justify-center transition-transform duration-150 group-active:scale-95">
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

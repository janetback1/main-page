import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface Site {
  name: string;
  url: string;
  category: string;
  description?: string;
  icon?: string;
}

interface SiteCardProps {
  site: Site;
  isPinned: boolean;
  onTogglePin: (siteName: string) => void;
  onPlaceholderClick?: (site: Site) => void;
}

// 自动导入 src/assets/icons/ 目录下的所有 SVG 图标
const iconAssets = import.meta.glob<string>('../assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

function resolveIconUrl(iconName?: string): string | null {
  if (!iconName) return null;
  if (
    iconName.startsWith('http://') ||
    iconName.startsWith('https://') ||
    iconName.startsWith('/') ||
    iconName.startsWith('data:')
  ) {
    return iconName;
  }
  const key = `../assets/icons/${iconName}`;
  return iconAssets[key] || null;
}

function getFallbackMonogram(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  // 如果是中文开头，取前1个字；如果是英文，取前2个字母缩写
  const firstChar = trimmed.charAt(0);
  if (/[\u4e00-\u9fa5]/.test(firstChar)) {
    return firstChar;
  }
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isPinned,
  onTogglePin,
  onPlaceholderClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const iconUrl = resolveIconUrl(site.icon);
  const isPlaceholder = !site.url || site.url === 'URL_PLACEHOLDER';

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPlaceholder) {
      e.preventDefault();
      onPlaceholderClick?.(site);
    }
  };

  const handlePinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onTogglePin(site.name);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white transition-colors duration-150 hover:border-slate-300 active:bg-slate-50">
      {/* 整卡可点击区域 */}
      <a
        href={isPlaceholder ? '#URL_PLACEHOLDER' : site.url}
        target={isPlaceholder ? undefined : '_blank'}
        rel={isPlaceholder ? undefined : 'noopener noreferrer'}
        onClick={handleCardClick}
        title={
          isPlaceholder
            ? `${site.name}（尚未配置网址：URL_PLACEHOLDER）`
            : `${site.name}${site.description ? ` - ${site.description}` : ''}`
        }
        className="flex flex-1 flex-col items-start p-3.5 sm:p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded-2xl"
      >
        {/* 网站图标：视觉重点 */}
        <div className="mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl overflow-hidden shrink-0">
          {iconUrl && !imgError ? (
            <img
              src={iconUrl}
              alt={`${site.name} 图标`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-800 text-sm font-semibold text-white select-none">
              {getFallbackMonogram(site.name)}
            </div>
          )}
        </div>

        {/* 网站名称 */}
        <div className="w-full">
          <h3 className="text-[15px] font-semibold text-slate-900 leading-snug line-clamp-1 group-hover:text-slate-950">
            {site.name}
          </h3>

          {/* 简短说明 */}
          {site.description && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-1">
              {site.description}
            </p>
          )}

          {/* 未配置网址提示（纯文本，无胶囊边框） */}
          {isPlaceholder && (
            <p className="mt-1 text-[11px] text-amber-700/80 leading-none">
              待配置网址
            </p>
          )}
        </div>
      </a>

      {/* 右上角星标置顶按钮：保证 >= 44x44px 触控热区 */}
      <button
        type="button"
        onClick={handlePinClick}
        aria-label={isPinned ? `取消置顶 ${site.name}` : `置顶 ${site.name}`}
        title={isPinned ? '取消置顶' : '点击置顶'}
        className={`absolute top-0.5 right-0.5 flex h-11 w-11 items-center justify-center rounded-tr-2xl rounded-bl-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ${
          isPinned
            ? 'text-amber-500 hover:text-amber-600'
            : 'text-slate-300 hover:text-slate-500 sm:opacity-70 sm:group-hover:opacity-100'
        }`}
      >
        <Star
          className="h-4 w-4"
          fill={isPinned ? 'currentColor' : 'none'}
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default SiteCard;

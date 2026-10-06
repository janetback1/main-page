import React from 'react';
import { Site, SiteCard } from './SiteCard';

interface PinnedSectionProps {
  sites: Site[];
  isSearching: boolean;
  onTogglePin: (siteName: string) => void;
  onPlaceholderClick?: (site: Site) => void;
}

export const PinnedSection: React.FC<PinnedSectionProps> = ({
  sites,
  isSearching,
  onTogglePin,
  onPlaceholderClick,
}) => {
  // 搜索状态下如果没有匹配的置顶网站，则隐藏置顶区块
  if (isSearching && sites.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="section-pinned" className="mb-8 sm:mb-10">
      <div className="mb-3.5 flex items-baseline justify-between border-b border-slate-200/80 pb-2">
        <div className="flex items-baseline gap-2">
          <h3
            id="section-pinned"
            className="text-base sm:text-lg font-semibold tracking-tight text-slate-900"
          >
            置顶
          </h3>
          <span className="text-xs text-slate-400 tabular-nums">
            · {sites.length}
          </span>
        </div>
        <span className="text-xs text-slate-400">
          保存在本地浏览器
        </span>
      </div>

      {sites.length > 0 ? (
        <div className="site-grid">
          {sites.map((site) => (
            <SiteCard
              key={`pinned-${site.category}-${site.name}`}
              site={site}
              isPinned={true}
              onTogglePin={onTogglePin}
              onPlaceholderClick={onPlaceholderClick}
            />
          ))}
        </div>
      ) : (
        <p className="py-2 text-xs text-slate-400">
          暂无置顶网站，点击任意卡片右上角的星标即可将其置顶。
        </p>
      )}
    </section>
  );
};

export default PinnedSection;

import React from 'react';
import { Site, SiteCard } from './SiteCard';

interface CategorySectionProps {
  category: string;
  sites: Site[];
  pinnedNames: Set<string>;
  onTogglePin: (siteName: string) => void;
  onPlaceholderClick?: (site: Site) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  sites,
  pinnedNames,
  onTogglePin,
  onPlaceholderClick,
}) => {
  if (sites.length === 0) {
    return null;
  }

  const sectionId = `category-${category}`;

  return (
    <section
      id={sectionId}
      aria-labelledby={`heading-${category}`}
      className="mb-8 sm:mb-10 scroll-mt-20"
    >
      <div className="mb-3.5 flex items-baseline justify-between border-b border-slate-200/80 pb-2">
        <div className="flex items-baseline gap-2">
          <h3
            id={`heading-${category}`}
            className="text-base sm:text-lg font-semibold tracking-tight text-slate-900"
          >
            {category}
          </h3>
          <span className="text-xs text-slate-400 tabular-nums">
            · {sites.length}
          </span>
        </div>
      </div>

      <div className="site-grid">
        {sites.map((site) => (
          <SiteCard
            key={`${category}-${site.name}`}
            site={site}
            isPinned={pinnedNames.has(site.name)}
            onTogglePin={onTogglePin}
            onPlaceholderClick={onPlaceholderClick}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

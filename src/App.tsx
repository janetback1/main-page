/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { categories as configuredCategories } from './data/categories.js';
import { sites as configuredSites } from './data/sites.js';
import { SearchBox } from './components/SearchBox';
import { PinnedSection } from './components/PinnedSection';
import { CategorySection } from './components/CategorySection';
import { Site } from './components/SiteCard';

const PINNED_STORAGE_KEY = 'personal_nav_pinned_sites_v1';

function loadPinnedSites(): string[] {
  try {
    const raw = window.localStorage.getItem(PINNED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function savePinnedSites(names: string[]): void {
  try {
    window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(names));
  } catch {
    // 忽略隐私模式或配额限制导致的写入异常
  }
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedList, setPinnedList] = useState<string[]>(() => loadPinnedSites());
  const [placeholderNotice, setPlaceholderNotice] = useState<Site | null>(null);

  useEffect(() => {
    savePinnedSites(pinnedList);
  }, [pinnedList]);

  const pinnedNamesSet = useMemo(() => new Set(pinnedList), [pinnedList]);

  const handleTogglePin = (siteName: string) => {
    setPinnedList((prev) =>
      prev.includes(siteName)
        ? prev.filter((name) => name !== siteName)
        : [...prev, siteName]
    );
  };

  const handlePlaceholderClick = (site: Site) => {
    setPlaceholderNotice(site);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  // 根据搜索词筛选网站（支持匹配网站名称、描述、分类名称）
  const filteredSites = useMemo(() => {
    if (!isSearching) return configuredSites as Site[];
    return (configuredSites as Site[]).filter((site) => {
      const nameMatch = site.name.toLowerCase().includes(normalizedQuery);
      const descMatch = (site.description || '').toLowerCase().includes(normalizedQuery);
      const categoryMatch = site.category.toLowerCase().includes(normalizedQuery);
      return nameMatch || descMatch || categoryMatch;
    });
  }, [isSearching, normalizedQuery]);

  // 合并配置的分类与数据中可能新增的分类，确保不遗漏任何网站
  const allCategories = useMemo(() => {
    const list = [...configuredCategories];
    for (const site of configuredSites as Site[]) {
      if (site.category && !list.includes(site.category)) {
        list.push(site.category);
      }
    }
    return list;
  }, []);

  // 置顶区的网站列表（按用户置顶顺序排列，同时受搜索词过滤）
  const pinnedSites = useMemo(() => {
    const siteMap = new Map<string, Site>();
    for (const site of filteredSites) {
      siteMap.set(site.name, site);
    }
    return pinnedList
      .map((name) => siteMap.get(name))
      .filter((site): site is Site => Boolean(site));
  }, [filteredSites, pinnedList]);

  // 按分类分组网站
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Site[]>();
    for (const cat of allCategories) {
      map.set(cat, []);
    }
    for (const site of filteredSites) {
      const list = map.get(site.category) || [];
      list.push(site);
      map.set(site.category, list);
    }
    return map;
  }, [allCategories, filteredSites]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 顶部栏：遵循简洁单行结构 */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* 区域 1：网站标题 */}
          <a
            href="#"
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap"
          >
            我的导航
          </a>

          {/* 区域 2：桌面端分类快速跳转锚点 */}
          <nav
            aria-label="分类快速导航"
            className="hidden md:flex items-center gap-6 text-sm text-slate-600"
          >
            {allCategories.slice(0, 6).map((category) => (
              <a
                key={category}
                href={`#category-${category}`}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                {category}
              </a>
            ))}
          </nav>

          {/* 区域 3：站点计数统计 */}
          <div className="flex items-center gap-3 text-xs text-slate-500 tabular-nums whitespace-nowrap">
            <span>共 {configuredSites.length} 个站点</span>
          </div>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-5 pb-12 sm:px-6 sm:pt-7 lg:px-8">
        {/* 搜索框区域 */}
        <div className="mb-7 sm:mb-9">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            totalCount={configuredSites.length}
            filteredCount={filteredSites.length}
          />
        </div>

        {/* 未配置网址 (URL_PLACEHOLDER) 点击提示条 */}
        {placeholderNotice && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs sm:text-sm text-amber-900"
          >
            <span>
              <strong>{placeholderNotice.name}</strong> 当前链接为占位符（
              <code className="font-mono">URL_PLACEHOLDER</code>
              ），请在 <code className="font-mono">src/data/sites.js</code> 中替换为实际网址。
            </span>
            <button
              type="button"
              onClick={() => setPlaceholderNotice(null)}
              className="ml-4 shrink-0 min-h-[36px] px-2.5 text-xs font-medium text-amber-800 underline underline-offset-2 hover:text-amber-950 cursor-pointer"
            >
              知道了
            </button>
          </div>
        )}

        {/* 置顶网站区域 */}
        <PinnedSection
          sites={pinnedSites}
          isSearching={isSearching}
          onTogglePin={handleTogglePin}
          onPlaceholderClick={handlePlaceholderClick}
        />

        {/* 搜索无结果提示 */}
        {isSearching && filteredSites.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-500">
              未找到包含「{searchQuery.trim()}」的网站或分类
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              显示全部网站
            </button>
          </div>
        ) : (
          /* 各分类网站列表 */
          <div>
            {allCategories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                sites={groupedByCategory.get(category) || []}
                pinnedNames={pinnedNamesSet}
                onTogglePin={handleTogglePin}
                onPlaceholderClick={handlePlaceholderClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* 简洁页脚 */}
      <footer className="border-t border-slate-200/70 bg-white/60 py-5">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 px-4 text-xs text-slate-400 sm:px-6 lg:px-8">
          <span>我的导航 · 个人日常互联网首页</span>
          <span>修改 src/data/sites.js 与 src/data/categories.js 即可维护导航数据</span>
        </div>
      </footer>
    </div>
  );
}

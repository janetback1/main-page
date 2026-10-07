/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { initialSites } from './data/sites.js';
import { Site, SiteItem } from './components/SiteItem';
import { SiteModal } from './components/SiteModal';
import { SearchBox } from './components/SearchBox';

const SITES_STORAGE_KEY = 'personal_homepage_sites_v2';

function loadSitesFromStorage(): Site[] {
  try {
    const raw = window.localStorage.getItem(SITES_STORAGE_KEY);
    if (!raw) return initialSites as Site[];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && typeof item.name === 'string')
        .map((item, idx) => ({
          id: item.id || `site-${idx}-${Date.now()}`,
          name: item.name,
          url: item.url || 'URL_PLACEHOLDER',
          icon: item.icon || '',
        }));
    }
    return initialSites as Site[];
  } catch {
    return initialSites as Site[];
  }
}

function saveSitesToStorage(sites: Site[]): void {
  try {
    window.localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  } catch {
    // 忽略存储写入异常
  }
}

export default function App() {
  const [sites, setSites] = useState<Site[]>(() => loadSitesFromStorage());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  // 整理模式与当前正在拖动的网站 ID
  const [isOrganizeMode, setIsOrganizeMode] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // 长按 / 右键触发的简洁管理菜单状态
  const [managingSite, setManagingSite] = useState<Site | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    saveSitesToStorage(sites);
  }, [sites]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const displayedSites = useMemo(() => {
    if (!normalizedQuery) return sites;
    return sites.filter((site) =>
      site.name.toLowerCase().includes(normalizedQuery)
    );
  }, [sites, normalizedQuery]);

  const handleStartDrag = useCallback((siteId: string) => {
    setDraggingId(siteId);
  }, []);

  const handleDragMoveTo = useCallback(
    (targetSiteId: string) => {
      setSites((prev) => {
        if (!draggingId || draggingId === targetSiteId) return prev;
        const fromIndex = prev.findIndex((item) => item.id === draggingId);
        const toIndex = prev.findIndex((item) => item.id === targetSiteId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return prev;
        }
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [draggingId]
  );

  const handleEndDrag = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleOpenAddModal = () => {
    setEditingSite(null);
    setIsModalOpen(true);
  };

  const handleOpenManageMenu = (site: Site) => {
    setManagingSite(site);
    setConfirmingDelete(false);
  };

  const handleCloseManageMenu = () => {
    setManagingSite(null);
    setConfirmingDelete(false);
  };

  const handleEditFromMenu = () => {
    if (!managingSite) return;
    const target = managingSite;
    handleCloseManageMenu();
    setEditingSite(target);
    setIsModalOpen(true);
  };

  const handleConfirmDeleteFromMenu = () => {
    if (!managingSite) return;
    const targetId = managingSite.id;
    setSites((prev) => prev.filter((item) => item.id !== targetId));
    handleCloseManageMenu();
  };

  const handlePlaceholderClick = (site: Site) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleSaveSite = (data: { name: string; url: string; icon: string }) => {
    if (editingSite) {
      setSites((prev) =>
        prev.map((item) =>
          item.id === editingSite.id
            ? {
                ...item,
                name: data.name,
                url: data.url,
                icon: data.icon,
              }
            : item
        )
      );
    } else {
      const newSite: Site = {
        id: `site-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: data.name,
        url: data.url,
        icon: data.icon,
      };
      setSites((prev) => [...prev, newSite]);
    }
    setIsModalOpen(false);
    setEditingSite(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-7">
        {/* 紧凑顶部栏：标题 + 搜索框 + 简洁「整理」按钮 */}
        <header className="mb-4 sm:mb-6 flex items-center justify-between gap-2.5">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 whitespace-nowrap">
            我的主页
          </h1>

          <div className="flex flex-1 sm:flex-initial items-center justify-end gap-2">
            <SearchBox value={searchQuery} onChange={setSearchQuery} />
            <button
              type="button"
              onClick={() => {
                setIsOrganizeMode((prev) => !prev);
                setDraggingId(null);
              }}
              className={`h-9 shrink-0 rounded-xl border px-3 text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                isOrganizeMode
                  ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isOrganizeMode ? '完成' : '整理'}
            </button>
          </div>
        </header>

        {isOrganizeMode && (
          <p className="mb-3 text-center text-xs text-slate-500">
            按住并拖动网站图标即可调整排列顺序，完成后点击右上角「完成」
          </p>
        )}

        {/* 紧凑图标墙：仅展示 图标 + 网站名称，以及唯一的「＋ 添加网站」 */}
        <main>
          <div className="icon-wall-grid">
            {displayedSites.map((site) => (
              <SiteItem
                key={site.id}
                site={site}
                isOrganizeMode={isOrganizeMode}
                isDragging={draggingId === site.id}
                onStartDrag={handleStartDrag}
                onDragMoveTo={handleDragMoveTo}
                onEndDrag={handleEndDrag}
                onLongPressOrContext={handleOpenManageMenu}
                onPlaceholderClick={handlePlaceholderClick}
              />
            ))}

            {/* 唯一的「＋ 添加网站」入口：与普通网站采用相同的紧凑图标样式 */}
            {!isOrganizeMode && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                aria-label="添加网站"
                className="group flex w-full max-w-[76px] sm:max-w-[92px] flex-col items-center select-none text-center cursor-pointer p-1 focus:outline-none"
              >
                <div className="site-icon-box flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 transition-colors duration-150 group-hover:border-slate-400 group-hover:text-slate-700 group-active:scale-95">
                  <Plus className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
                </div>
                <span className="mt-1.5 w-full truncate px-0.5 text-xs leading-tight text-slate-500 group-hover:text-slate-800">
                  添加网站
                </span>
              </button>
            )}
          </div>
        </main>
      </div>

      {/* 长按（手机）/ 右键（桌面）触发的简洁小管理菜单 */}
      {managingSite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
          onClick={handleCloseManageMenu}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`管理 ${managingSite.name}`}
            className="w-full max-w-[240px] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 px-3 py-2 text-center">
              <p className="truncate text-xs font-semibold text-slate-800">
                {managingSite.name}
              </p>
            </div>

            {!confirmingDelete ? (
              <div className="mt-1 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={handleEditFromMenu}
                  className="w-full rounded-xl py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200/70 transition-colors cursor-pointer"
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="w-full rounded-xl py-2.5 text-center text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100/70 transition-colors cursor-pointer"
                >
                  删除
                </button>
                <button
                  type="button"
                  onClick={handleCloseManageMenu}
                  className="w-full rounded-xl py-2.5 text-center text-sm text-slate-500 hover:bg-slate-100 active:bg-slate-200/70 transition-colors cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="mt-1 flex flex-col gap-1 p-1">
                <p className="px-2 py-1.5 text-center text-xs text-slate-600">
                  确定要删除「{managingSite.name}」吗？
                </p>
                <button
                  type="button"
                  onClick={handleConfirmDeleteFromMenu}
                  className="w-full rounded-xl bg-red-600 py-2 text-center text-xs font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  确认删除
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="w-full rounded-xl py-2 text-center text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 添加 / 编辑网站弹窗 */}
      <SiteModal
        isOpen={isModalOpen}
        editingSite={editingSite}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSite(null);
        }}
        onSave={handleSaveSite}
      />
    </div>
  );
}

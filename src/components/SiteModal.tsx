import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Site } from './SiteItem';

interface SiteModalProps {
  isOpen: boolean;
  editingSite: Site | null;
  onClose: () => void;
  onSave: (data: { name: string; url: string; icon: string }) => void;
}

export const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  editingSite,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingSite) {
        setName(editingSite.name);
        setUrl(editingSite.url === 'URL_PLACEHOLDER' ? '' : editingSite.url);
        setIcon(editingSite.icon || '');
      } else {
        setName('');
        setUrl('');
        setIcon('');
      }
      setError('');
    }
  }, [isOpen, editingSite]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    let trimmedUrl = url.trim();
    const trimmedIcon = icon.trim();

    if (!trimmedName) {
      setError('请填写网站名称');
      return;
    }

    if (!trimmedUrl) {
      trimmedUrl = 'URL_PLACEHOLDER';
    } else if (
      trimmedUrl !== 'URL_PLACEHOLDER' &&
      !trimmedUrl.startsWith('http://') &&
      !trimmedUrl.startsWith('https://')
    ) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    onSave({
      name: trimmedName,
      url: trimmedUrl,
      icon: trimmedIcon,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-semibold text-slate-900">
            {editingSite ? '编辑网站' : '添加网站'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭窗口"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="site-name"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              网站名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="site-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="例如：GitHub"
              autoFocus
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="site-url"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              网站 URL
            </label>
            <input
              id="site-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="site-icon"
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              图标（可选）
            </label>
            <input
              id="site-icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="图片 URL 或内置文件名（留空自动获取）"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-1.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteModal;

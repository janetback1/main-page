import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  totalCount,
  filteredCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 支持按 "/" 键快速聚焦搜索框，按 "Escape" 清空搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !['INPUT', 'TEXTAREA'].includes(
          (document.activeElement as HTMLElement)?.tagName || ''
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (value) {
          onChange('');
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onChange]);

  const hasQuery = value.trim().length > 0;

  return (
    <div className="w-full max-w-xl">
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索网站名称、分类或说明..."
          aria-label="搜索已配置的网站"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-[15px] text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="清空搜索"
            className="absolute right-0 flex h-11 w-11 items-center justify-center text-slate-400 hover:text-slate-700 transition-colors duration-150 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {hasQuery && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 tabular-nums px-1">
          <span>
            匹配到 {filteredCount} / {totalCount} 个网站
          </span>
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-slate-600 underline underline-offset-2 hover:text-slate-900 cursor-pointer"
          >
            重置筛选
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBox;

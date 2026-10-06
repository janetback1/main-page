import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
      } else if (
        e.key === 'Escape' &&
        document.activeElement === inputRef.current
      ) {
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
    <div className="w-full sm:w-64 md:w-72">
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索网站..."
          aria-label="搜索网站"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-slate-400 focus:outline-none"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="清空搜索"
            className="absolute right-0 flex h-9 w-8 items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;

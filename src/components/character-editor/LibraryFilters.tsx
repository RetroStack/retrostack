"use client";

import { useState, useCallback } from "react";

export interface LibraryFiltersProps {
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Available sizes for filtering */
  availableSizes: { width: number; height: number }[];
  /** Current width filter */
  widthFilter: number | null;
  /** Current height filter */
  heightFilter: number | null;
  /** Callback when size filter changes */
  onSizeFilterChange: (width: number | null, height: number | null) => void;
  /** Total count of items */
  totalCount: number;
  /** Filtered count of items */
  filteredCount: number;
}

/**
 * Filter controls for the character set library
 */
export function LibraryFilters({
  searchQuery,
  onSearchChange,
  availableSizes,
  widthFilter,
  heightFilter,
  onSizeFilterChange,
  totalCount,
  filteredCount,
}: LibraryFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearchChange(localSearch);
    },
    [localSearch, onSearchChange]
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        onSearchChange(localSearch);
      }
    },
    [localSearch, onSearchChange]
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearch("");
    onSearchChange("");
    onSizeFilterChange(null, null);
  }, [onSearchChange, onSizeFilterChange]);

  const hasActiveFilters =
    searchQuery.length > 0 || widthFilter !== null || heightFilter !== null;

  return (
    <div className="flex flex-col gap-3">
      {/* Search and filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onBlur={() => onSearchChange(localSearch)}
              placeholder="Search character sets..."
              className="w-full px-4 py-2 pl-10 bg-retro-navy/50 border border-retro-grid/50 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-retro-cyan/50 transition-colors"
              aria-label="Search character sets"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Size filter */}
        <div className="flex gap-2">
          <select
            value={widthFilter ?? ""}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value, 10) : null;
              onSizeFilterChange(value, heightFilter);
            }}
            className="px-3 py-2 bg-retro-navy/50 border border-retro-grid/50 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50 cursor-pointer"
            aria-label="Filter by width"
          >
            <option value="">Width</option>
            {Array.from(new Set(availableSizes.map((s) => s.width)))
              .sort((a, b) => a - b)
              .map((w) => (
                <option key={w} value={w}>
                  {w}px
                </option>
              ))}
          </select>

          <select
            value={heightFilter ?? ""}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value, 10) : null;
              onSizeFilterChange(widthFilter, value);
            }}
            className="px-3 py-2 bg-retro-navy/50 border border-retro-grid/50 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50 cursor-pointer"
            aria-label="Filter by height"
          >
            <option value="">Height</option>
            {Array.from(new Set(availableSizes.map((s) => s.height)))
              .sort((a, b) => a - b)
              .map((h) => (
                <option key={h} value={h}>
                  {h}px
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Results count and clear button */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {hasActiveFilters
            ? `Showing ${filteredCount} of ${totalCount} character sets`
            : `${totalCount} character set${totalCount !== 1 ? "s" : ""}`}
        </span>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-retro-cyan hover:text-retro-pink transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Compact filter bar for smaller spaces
 */
export function LibraryFiltersCompact({
  searchQuery,
  onSearchChange,
  totalCount,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-1.5 pl-8 bg-retro-navy/50 border border-retro-grid/50 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-retro-cyan/50"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <span className="text-xs text-gray-500 whitespace-nowrap">
        {totalCount} items
      </span>
    </div>
  );
}

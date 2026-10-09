import React from "react";
import { FiChevronDown } from "react-icons/fi";

const sortOptions = [
  { value: "newest", label: "Most Recent" },
  { value: "helpful", label: "Most Helpful" },
  { value: "rating_high", label: "Highest Rating" },
  { value: "rating_low", label: "Lowest Rating" },
];

const ReviewFilters = ({
  sort,
  ratingFilter,
  onSortChange,
  onRatingFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sort by:</span>
        <div className="relative inline-block text-left">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-40 md:w-48 pl-3 pr-8 py-2 text-xs font-semibold border border-zinc-700/80 rounded-xl bg-zinc-900 text-zinc-200 focus:outline-none focus:border-yellow-400"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Filter:</span>
        {[5, 4, 3, 2, 1].map((star) => {
          const active = ratingFilter === star;
          return (
            <button
              key={star}
              type="button"
              onClick={() =>
                onRatingFilterChange(active ? null : star)
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                active
                  ? "bg-yellow-400 border-yellow-400 text-slate-950 shadow-md"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {star}★
            </button>
          );
        })}
        {ratingFilter && (
          <button
            type="button"
            onClick={() => onRatingFilterChange(null)}
            className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold underline ml-1"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewFilters;



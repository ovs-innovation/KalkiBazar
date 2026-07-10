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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold text-gray-700">Sort by:</span>
        <div className="relative inline-block text-left">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-40 md:w-48 pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">Filter:</span>
        {[5, 4, 3, 2, 1].map((star) => {
          const active = ratingFilter === star;
          return (
            <button
              key={star}
              type="button"
              onClick={() =>
                onRatingFilterChange(active ? null : star)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "bg-yellow-500 border-yellow-500 text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
            className="text-xs text-gray-500 underline ml-1"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewFilters;



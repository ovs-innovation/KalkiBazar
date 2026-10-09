import React from "react";
import { AiFillStar } from "react-icons/ai";
import useGetSetting from "@hooks/useGetSetting";

const RatingSummary = ({ summary }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  if (!summary) return null;

  const {
    averageRating = 0,
    totalRatings = 0,
    totalReviews = 0,
    starCounts = {},
  } = summary;

  const totalForBar =
    starCounts?.[1] +
      starCounts?.[2] +
      starCounts?.[3] +
      starCounts?.[4] +
      starCounts?.[5] || totalRatings || 0;

  const getBarWidth = (count) => {
    if (!totalForBar || !count) return "0%";
    return `${Math.round((count / totalForBar) * 100)}%`;
  };

  const renderStars = (value) => {
    const full = Math.round(value || 0);
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <AiFillStar
            key={idx}
            className={
              idx < full
                ? `text-yellow-400 w-4 h-4 fill-yellow-400`
                : "text-zinc-700 w-4 h-4"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-yellow-400 rounded-full" />
        Ratings &amp; Reviews
      </h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex flex-col items-start sm:border-r border-zinc-800/80 sm:pr-8">
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {averageRating?.toFixed ? averageRating.toFixed(1) : "0.0"}
            </span>
            <span className="text-sm font-semibold text-zinc-500">/ 5</span>
          </div>
          <div className="mt-2">{renderStars(averageRating)}</div>
          <p className="mt-2 text-xs text-zinc-400">
            {totalRatings} Ratings &amp; {totalReviews} Reviews
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-3 text-xs">
              <span className="w-6 text-xs text-zinc-400 font-semibold flex items-center gap-0.5">
                {star}★
              </span>
              <div className="flex-1 h-2.5 bg-zinc-800/90 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{
                    width: getBarWidth(starCounts?.[star] || 0),
                  }}
                />
              </div>
              <span className="w-8 text-right text-[11px] text-zinc-400 font-medium">
                {starCounts?.[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;




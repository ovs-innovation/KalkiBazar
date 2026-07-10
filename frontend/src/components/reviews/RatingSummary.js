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
                ? `text-store-500 w-4 h-4`
                : "text-gray-300 w-4 h-4"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
        Ratings &amp; Reviews
      </h3>
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-start">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl md:text-4xl font-bold text-gray-900">
              {averageRating?.toFixed ? averageRating.toFixed(1) : "0.0"}
            </span>
            <span className="text-sm text-gray-500">/ 5</span>
          </div>
          <div className="mt-1">{renderStars(averageRating)}</div>
          <p className="mt-2 text-xs md:text-sm text-gray-500">
            {totalRatings} Ratings &amp; {totalReviews} Reviews
          </p>
        </div>

        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2 text-xs">
              <span className="w-6 text-xs text-gray-600 font-medium">
                {star}★
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-store-500 rounded-full`}
                  style={{
                    width: getBarWidth(starCounts?.[star] || 0),
                  }}
                />
              </div>
              <span className="w-8 text-right text-[11px] text-gray-500">
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




import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillStar } from "react-icons/ai";
import { BiBadgeCheck } from "react-icons/bi";
import { FiThumbsUp, FiTrash2 } from "react-icons/fi";

dayjs.extend(relativeTime);

const maskName = (name = "") => {
  if (!name) return "Anonymous";
  const parts = name.split(" ");
  const first = parts[0] || "";
  if (first.length <= 2) return `${first[0] || ""}***`;
  return `${first[0]}${"*".repeat(Math.max(first.length - 1, 2))}`;
};

const ReviewList = ({
  reviews,
  loading,
  onLoadMore,
  canLoadMore,
  onMarkHelpful,
  onDeleteReview,
  currentUser,
}) => {
  if (!reviews?.length && !loading) {
    return (
      <div className="border border-zinc-800/80 rounded-3xl p-6 text-sm text-zinc-400 bg-zinc-950/80 backdrop-blur-md text-center">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      <div className="space-y-5">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border-b border-zinc-800/80 pb-5 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
                <span>{review.rating}</span>
                <AiFillStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              {review.verified && (
                <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <BiBadgeCheck className="w-3.5 h-3.5 mr-1" />
                  Verified Buyer
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
              {review.reviewText}
            </p>
            {Array.isArray(review.images) && review.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {review.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`review-${idx}`}
                    className="w-14 h-14 object-cover rounded-xl border border-zinc-800"
                  />
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-zinc-500">
                <span className="font-semibold text-zinc-400">
                  {maskName(review?.user?.name)}
                </span>
                <span>•</span>
                <span>{dayjs(review.createdAt).fromNow()}</span>
              </div>
              <div className="flex items-center space-x-3">
                {currentUser?._id === review?.user?._id && (
                  <button
                    type="button"
                    onClick={() => onDeleteReview(review._id)}
                    className="inline-flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onMarkHelpful(review)}
                  className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-yellow-400 transition-colors"
                >
                  <FiThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful</span>
                  <span className="text-[11px] font-semibold">
                    ({review.helpfulCount || 0})
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-bold text-zinc-200 border border-zinc-800 bg-zinc-900 rounded-xl hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-60 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {loading ? "Loading..." : "Load more reviews"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;



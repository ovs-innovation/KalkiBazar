import requests from "./httpServices";

const ReviewServices = {
  getProductReviews: async ({
    productId,
    sort = "newest",
    rating,
    page = 1,
    limit = 10,
  }) => {
    const params = new URLSearchParams();
    if (sort) params.append("sort", sort);
    if (rating) params.append("rating", rating);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    return requests.get(`/reviews/${productId}?${params.toString()}`);
  },

  addOrUpdateReview: async ({ productId, rating, reviewText, images }) => {
    return requests.post("/reviews", {
      productId,
      rating,
      reviewText,
      images,
    });
  },

  markHelpful: async (reviewId) => {
    return requests.put(`/reviews/${reviewId}/helpful`);
  },

  deleteReview: async (reviewId) => {
    return requests.delete(`/reviews/${reviewId}`);
  },
};

export default ReviewServices;



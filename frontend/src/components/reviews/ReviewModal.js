import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import MainModal from "@components/modal/MainModal";
import ReviewServices from "@services/ReviewServices";
import ProductServices from "@services/ProductServices";
import { notifyError, notifySuccess } from "@utils/toast";

const StarSelector = ({ value, onChange, disabled }) => {
  const [hover, setHover] = useState(0);
  const current = hover || value || 0;

  return (
    <div className="flex items-center space-x-1 mb-2">
      {Array.from({ length: 5 }).map((_, idx) => {
        const starValue = idx + 1;
        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => !disabled && setHover(starValue)}
            onMouseLeave={() => !disabled && setHover(0)}
            className="focus:outline-none"
          >
            <AiFillStar
              className={
                starValue <= current
                  ? "w-6 h-6 text-yellow-400"
                  : "w-6 h-6 text-gray-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
};

const ReviewModal = ({ open, onClose, productSnapshot }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [productId, setProductId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    if (!open || !productSnapshot) {
      // Reset when modal closes
      setProductId(null);
      setLoadingProduct(false);
      return;
    }

    // Reset form when modal opens
    setRating(0);
    setText("");
    setImages([]);
    setProductId(null);
    
    // Get productId from cart item
    // Cart items have _id field which is the product's MongoDB ObjectId
    // Check if _id exists and is valid MongoDB ObjectId format (24 hex chars)
    const isValidObjectId = (id) => {
      if (!id) return false;
      const idStr = String(id);
      return /^[0-9a-fA-F]{24}$/.test(idStr);
    };

    // Try to use _id directly first (most common case)
    if (isValidObjectId(productSnapshot._id)) {
      setProductId(String(productSnapshot._id));
      return;
    }

    // Fallback: fetch product by slug if _id is not available
    if (productSnapshot.slug) {
      setLoadingProduct(true);
      ProductServices.getProductBySlug(productSnapshot.slug)
        .then((product) => {
          if (product?._id) {
            setProductId(String(product._id));
          } else {
            console.error("Product not found by slug:", productSnapshot.slug, product);
            notifyError("Could not find product. Please try again.");
          }
        })
        .catch((err) => {
          console.error("Error fetching product by slug:", err);
          // Don't show error toast on every render, only log it
          if (err?.response?.status !== 404) {
            notifyError("Could not load product details. Please try again.");
          }
        })
        .finally(() => {
          setLoadingProduct(false);
        });
    } else {
      console.error("Invalid product snapshot - no _id or slug:", productSnapshot);
      notifyError("Invalid product information. Please try again.");
    }
  }, [productSnapshot, open]);

  if (!productSnapshot) return null;

  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const reader2 = new FileReader();
              reader2.onload = () => resolve(reader2.result);
              reader2.onerror = reject;
              reader2.readAsDataURL(blob);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Limit number of images
    if (files.length > 5) {
      notifyError("Maximum 5 images allowed.");
      return;
    }

    // Check file sizes (max 2MB per file before compression)
    const oversizedFiles = files.filter((f) => f.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      notifyError("Some images are too large. Please select images under 2MB each.");
      return;
    }

    try {
      setLoadingProduct(true); // Reuse loading state
      const compressed = await Promise.all(
        files.map((file) => compressImage(file))
      );
      setImages(compressed);
      notifySuccess(`${files.length} image(s) added successfully.`);
    } catch (err) {
      console.error("Error processing images:", err);
      notifyError("Could not process images. Please try again.");
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) {
      return notifyError("Product information is loading. Please wait...");
    }
    if (!rating) {
      return notifyError("Please select a star rating.");
    }
    if (!text || text.trim().length < 5) {
      return notifyError("Review text must be at least 5 characters.");
    }

    try {
      setSubmitting(true);
      console.log("Submitting review:", {
        productId,
        rating,
        reviewText: text.trim(),
        imagesCount: images.length,
      });
      
      const response = await ReviewServices.addOrUpdateReview({
        productId,
        rating,
        reviewText: text.trim(),
        images,
      });
      
      console.log("Review submitted successfully:", response);
      notifySuccess("Review submitted successfully.");
      onClose();
      // Reset form
      setRating(0);
      setText("");
      setImages([]);
      setProductId(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      console.error("Error response:", err?.response?.data);
      
      const errorMsg = 
        err?.response?.data?.message || 
        err?.message || 
        "Failed to submit review. Please try again.";
      
      notifyError(errorMsg);
      
      // If unauthorized, suggest login
      if (err?.response?.status === 401) {
        notifyError("Please login to submit a review.");
      }
      
      // If 400, show detailed error
      if (err?.response?.status === 400) {
        console.error("Validation error:", err.response.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainModal modalOpen={open} setModalOpen={onClose}>
      <div className="inline-block overflow-y-auto max-h-screen align-middle transition-all transform bg-white shadow-xl rounded-2xl text-left">
        <div className="w-full max-w-3xl p-5 md:p-8">
          <h2 className="text-xl font-semibold font-serif mb-4">
            Rate &amp; Review Product
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                <img
                  src={
                    Array.isArray(productSnapshot.image)
                      ? productSnapshot.image[0]
                      : productSnapshot.image
                  }
                  alt={productSnapshot.title}
                  className="w-full h-40 object-contain bg-white"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 line-clamp-3">
                {productSnapshot.title}
              </p>
            </div>
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Rate this product
                  </label>
                  <StarSelector
                    value={rating}
                    onChange={setRating}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Review this product
                  </label>
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="Share your experience with this product..."
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Add photos (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={submitting}
                    className="text-xs text-gray-600"
                  />
                  {images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {images.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`review-${idx}`}
                          className="w-14 h-14 object-cover rounded-md border border-gray-200"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || loadingProduct || !productId}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-60"
                  >
                    {loadingProduct
                      ? "Loading..."
                      : submitting
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default ReviewModal;



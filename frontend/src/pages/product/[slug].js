import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiShare2,
  FiHeart,
  FiShuffle,
  FiTruck,
  FiShoppingCart,
  FiZap,
  FiShield,
  FiCheckCircle,
  FiPhoneCall,
  FiAward,
} from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { FaInstagram } from "react-icons/fa";
//internal import

import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import Tags from "@components/common/Tags";
import Layout from "@layout/Layout";
import Card from "@components/slug-card/Card";
import useAddToCart from "@hooks/useAddToCart";
import { useCart } from "react-use-cart";
import Loading from "@components/preloader/Loading";
import ProductCard from "@components/product/ProductCard";
import VariantList from "@components/variants/VariantList";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import AttributeServices from "@services/AttributeServices";
import ProductServices from "@services/ProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Discount from "@components/common/Discount";
import useGetSetting from "@hooks/useGetSetting";
import ProductImageGallery from "@components/product/ProductImageGallery";
import ProductDetailsSection from "@components/product/ProductDetailsSection";
import LocationPickerDropdown from "@components/location/LocationPickerDropdown";
import RatingSummary from "@components/reviews/RatingSummary";
import ReviewFilters from "@components/reviews/ReviewFilters";
import ReviewList from "@components/reviews/ReviewList";
import WriteReviewForm from "@components/reviews/WriteReviewForm";
import ReviewServices from "@services/ReviewServices";
import { notifyError, notifySuccess } from "@utils/toast";
import { useSession } from "next-auth/react";
import { addToWishlist } from "@lib/wishlist";
import { getExpectedDeliveryTime } from "@utils/deliveryTime";
import CustomerServices from "@services/CustomerServices";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import SuggestedProducts from "@components/product/SuggestedProducts";

const ProductScreen = ({ product, attributes, relatedProducts }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { state: userState } = useContext(UserContext) || {};

  // Get user info from session, context, or cookies
  const cookieUserInfo = (typeof window !== "undefined") ? (() => {
    try { const c = Cookies.get("userInfo"); return c ? JSON.parse(c) : null; } catch (e) { return null; }
  })() : null;

  const sessionRole = session?.user?.role;
  const contextRole = userState?.userInfo?.role;
  const cookieRole = cookieUserInfo?.role;
  const userRole = sessionRole || contextRole || cookieRole || null;

  // also expose a userInfo object for other usages (cookies/context/session)
  const userInfo = session?.user || userState?.userInfo || cookieUserInfo || null;

  // normalized wholesaler check (case-insensitive)
  const isWholesaler = userRole && userRole.toString().toLowerCase() === 'wholesaler';

  const { lang, showingTranslateValue, getNumber, currency, getNumberTwo } =
    useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { handleAddItem, item, setItem } = useAddToCart();
  const { setItems, addItem } = useCart();
  const { storeCustomizationSetting, globalSetting } = useGetSetting();

  // Handle Product View Tracking
  useEffect(() => {
    if (product?._id) {
      // 1. Backend Tracking (fire and forget)
      ProductServices.addProductView({ productId: product._id }).catch(err =>
        console.error("Tracking view failed", err)
      );

      // 2. Guest LocalStorage Tracking
      if (typeof window !== "undefined") {
        try {
          let history = [];
          const stored = localStorage.getItem("recentlyViewed");
          if (stored) history = JSON.parse(stored);

          // Remove if exists (to move to top)
          history = history.filter(p => p._id !== product._id);

          // Add current
          history.unshift({
            _id: product._id,
            viewedAt: Date.now()
          });

          // Limit to 10
          if (history.length > 10) history = history.slice(0, 10);

          localStorage.setItem("recentlyViewed", JSON.stringify(history));
        } catch (e) {
          console.error("LS Error", e);
        }
      }
    }
  }, [product, session]);

  // react hook

  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [activeImage, setActiveImage] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [isReadMore, setIsReadMore] = useState(true);
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);
  const [dynamicTitle, setDynamicTitle] = useState("");
  const [dynamicDescription, setDynamicDescription] = useState("");
  const [variantDynamicSections, setVariantDynamicSections] = useState(null);
  const [variantMediaSections, setVariantMediaSections] = useState(null);
  const isUpdatingUrlRef = useRef(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsHasMore, setReviewsHasMore] = useState(false);
  const [reviewsSort, setReviewsSort] = useState("newest");
  const [reviewsRatingFilter, setReviewsRatingFilter] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [activeTab, setActiveTab] = useState("product-description");
  const [showStickyBottomBar, setShowStickyBottomBar] = useState(false);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState(null);

  // Fetch shipping address if user is logged in
  const { data: shippingAddressData } = useQuery({
    queryKey: ["shippingAddress", { id: userInfo?.id }],
    queryFn: async () =>
      await CustomerServices.getShippingAddress({
        userId: userInfo?.id,
      }),
    select: (data) => data?.shippingAddress,
    enabled: !!userInfo?.id,
  });

  // Simple stock derivation to avoid infinite variant loops
  useEffect(() => {
    if (!product) return;

    if (Array.isArray(product.variants) && product.variants.length > 0) {
      // sum of variant quantities as overall stock
      const total = product.variants.reduce(
        (sum, v) => sum + (Number(v.quantity) || 0),
        0
      );
      setStock(total);
    } else {
      setStock(Number(product.stock) || 0);
    }
  }, [product]);

  // Get product media (images + optional video) - supports up to 5 items
  const productImages = useMemo(() => {
    const media = [];

    // Add images first
    if (Array.isArray(product?.image)) {
      media.push(
        ...product.image.filter(
          (img) => img && typeof img === "string" && img.trim() !== ""
        )
      );
    } else if (product?.image) {
      media.push(product.image);
    }

    // If legacy 'video' field exists, also push it into media array
    if (
      product?.video &&
      typeof product.video === "string" &&
      product.video.trim() !== ""
    ) {
      media.push(product.video);
    }

    return media.slice(0, 5);
  }, [product?.image, product?.video]);

  // Keep a sharable URL in sync with current selection (includes query params)
  useEffect(() => {
    if (!router.isReady) return;
    if (typeof window === "undefined") return;

    // Always take the real browser URL so that we include query params
    setShareUrl(window.location.href);
  }, [router.isReady, router.asPath]);

  // Auto-select first available variant on initial load
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) return;
    if (!variantTitle || variantTitle.length === 0) return;

    // If we already have any attribute selected, don't override
    if (selectVa && Object.keys(selectVa).some((key) => selectVa[key])) return;

    // Pick first variant with stock > 0, otherwise just first variant
    const firstAvailableVariant =
      product.variants.find((v) => Number(v.quantity) > 0) ||
      product.variants[0];

    if (!firstAvailableVariant) return;

    const initialSelection = {};
    variantTitle.forEach((att) => {
      if (firstAvailableVariant[att._id]) {
        initialSelection[att._id] = firstAvailableVariant[att._id];
      }
    });

    if (Object.keys(initialSelection).length === 0) return;

    // Initialize attribute selection; price/images/stock will be synced
    // by the variant-matching effect below.
    setSelectVa(initialSelection);
    setSelectVariant((prev) =>
      Object.keys(prev || {}).length === 0 ? initialSelection : prev
    );
  }, [product?.variants, variantTitle]);

  useEffect(() => {
    // Trigger when we have variants and some selection
    if (!product?.variants || product.variants.length === 0) return;

    // Check if we have any attribute selection
    const attributeKeys = variantTitle?.map(att => att._id) || [];
    const hasSelection = value || (selectVa && Object.keys(selectVa).length > 0 && attributeKeys.some(key => selectVa[key]));

    if (!hasSelection) {
      return;
    }

    if (hasSelection) {
      // Merge current selectVa with selectVariant to get complete selection
      const mergedSelection = { ...selectVariant, ...selectVa };

      // Filter out non-attribute keys for comparison
      const attributeKeys = variantTitle?.map(att => att._id) || [];

      // If we have attribute keys, filter by them; otherwise use all variants
      let result = product?.variants || [];

      if (attributeKeys.length > 0) {
        result = product?.variants?.filter((variant) => {
          // Check if variant matches all selected attributes
          return attributeKeys.every((attrKey) => {
            const selectedValue = mergedSelection[attrKey];
            // If no selection for this attribute, skip it (allow any value)
            if (!selectedValue) return true;
            return variant[attrKey] === selectedValue;
          });
        }) || [];
      }

      const res = result?.map(
        ({
          originalPrice,
          price,
          discount,
          quantity,
          barcode,
          sku,
          productId,
          image,
          images,
          title,
          description,
          ...rest
        }) => ({ ...rest })
      );

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey?.reduce(
        (obj, key) => ({ ...obj, [key]: mergedSelection[key] || selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      // Find the variant that matches all selected attributes
      let result2 = null;

      if (Object.keys(newObj).length > 0) {
        result2 = result?.find((v) =>
          Object.keys(newObj).every((k) => newObj[k] === v[k])
        );
      } else if (result.length > 0) {
        // If no specific selection, use first matching variant
        result2 = result[0];
      }

      // console.log("result2", result2);
      if (result.length <= 0 || result2 === undefined || result2 === null) {
        // If no exact match, try to find partial match
        if (result.length > 0) {
          result2 = result[0];
        } else {
          setStock(0);
          return;
        }
      }

      setVariants(result);
      const sameVariant =
        result2 && selectVariant && result2._id === selectVariant._id;
      if (!sameVariant) {
        setSelectVariant(result2);
        setSelectVa(result2);
      }

      // Get variant images - prioritize variant images
      let variantImages = [];
      if (Array.isArray(result2?.images) && result2.images.length > 0) {
        variantImages = result2.images;
      } else if (result2?.image) {
        variantImages = [result2.image];
      }

      // If variant has video, add it to images array
      if (result2?.video && typeof result2.video === "string" && result2.video.trim() !== "") {
        if (!variantImages.includes(result2.video)) {
          variantImages.push(result2.video);
        }
      }

      // Set active image to first variant image, or fallback to product image
      const variantImage = variantImages.length > 0
        ? variantImages[0]
        : (productImages[0] || "");
      setActiveImage(variantImage);
      setCurrentImages(
        variantImages.length > 0 ? variantImages : productImages
      );

      setStock(result2?.quantity);
      const price = getNumber(result2?.price);
      const originalPrice = getNumber(result2?.originalPrice);

      // Use actual discount percentage from database (variant discount)
      // Check variant discount first, then fallback to product discount
      const variantDiscount = getNumber(result2?.discount ?? result2?.prices?.discount ?? null);
      const productDiscount = getNumber(product?.prices?.discount ?? 0);
      // Use variant discount if available, otherwise use product discount
      const discount = variantDiscount !== null && variantDiscount !== undefined ? variantDiscount : productDiscount;

      console.log("Discount Debug (result2):", {
        result2: result2,
        result2Discount: result2?.discount,
        result2PricesDiscount: result2?.prices?.discount,
        variantDiscount,
        productDiscount,
        productPricesDiscount: product?.prices?.discount,
        finalDiscount: discount
      });

      setDiscount(discount);
      console.log("Discount state set to:", discount);
      setPrice(price);
      setOriginalPrice(originalPrice);

      // Set dynamic title and description - variant first, then product
      const variantTitleText = showingTranslateValue(result2?.title);
      const variantDescText = showingTranslateValue(result2?.description);
      setDynamicTitle(variantTitleText || showingTranslateValue(product?.title));
      setDynamicDescription(variantDescText || showingTranslateValue(product?.description));

      // Set variant-specific dynamic and media sections
      // Always set if array exists, even if sections have isVisible: false
      setVariantDynamicSections(
        Array.isArray(result2?.dynamicSections) && result2.dynamicSections.length > 0
          ? result2.dynamicSections
          : null
      );
      setVariantMediaSections(
        Array.isArray(result2?.mediaSections) && result2.mediaSections.length > 0
          ? result2.mediaSections
          : null
      );
    } else if (product?.variants?.length > 0) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      setVariants(result);

      // Pick first variant with non-zero price, fall back to index 0
      const pricedVariant =
        product.variants.find(
          (v) => getNumber(v?.price ?? 0) > 0
        ) || product.variants[0];

      setStock(pricedVariant?.quantity);
      setSelectVariant(pricedVariant);
      setSelectVa(pricedVariant);

      // Get variant image - handle both variant.image (string) and variant.images (array)
      const firstVariantImageArr =
        Array.isArray(pricedVariant?.images) && pricedVariant.images.length > 0
          ? pricedVariant.images
          : pricedVariant?.image
            ? [pricedVariant.image]
            : [];

      const firstVariantImage =
        firstVariantImageArr[0] || productImages[0] || "";
      setActiveImage(firstVariantImage);
      setCurrentImages(
        firstVariantImageArr.length > 0 ? firstVariantImageArr : productImages
      );

      const rawVariantPrice =
        pricedVariant?.price ?? product?.prices?.price ?? 0;
      const rawVariantOriginal =
        pricedVariant?.originalPrice ??
        product?.prices?.originalPrice ??
        rawVariantPrice;

      const price = getNumber(rawVariantPrice);
      const originalPrice = getNumber(rawVariantOriginal);

      // Use actual discount percentage from database (variant or product discount)
      const variantDiscount = getNumber(pricedVariant?.discount ?? pricedVariant?.prices?.discount ?? null);
      const productDiscount = getNumber(product?.prices?.discount ?? 0);
      // Use variant discount if available, otherwise use product discount
      const discount = variantDiscount !== null && variantDiscount !== undefined ? variantDiscount : productDiscount;

      console.log("Discount Debug (pricedVariant):", {
        pricedVariantDiscount: pricedVariant?.discount,
        pricedVariantPricesDiscount: pricedVariant?.prices?.discount,
        variantDiscount,
        productDiscount,
        finalDiscount: discount
      });

      setDiscount(discount);
      setPrice(price);
      setOriginalPrice(originalPrice);

      // Set dynamic title and description - variant first, then product
      const firstVariantTitleText = showingTranslateValue(pricedVariant?.title);
      const firstVariantDescText = showingTranslateValue(
        pricedVariant?.description
      );
      setDynamicTitle(
        firstVariantTitleText || showingTranslateValue(product?.title)
      );
      setDynamicDescription(
        firstVariantDescText || showingTranslateValue(product?.description)
      );

      // Set variant-specific dynamic and media sections
      setVariantDynamicSections(
        Array.isArray(pricedVariant?.dynamicSections) &&
          pricedVariant.dynamicSections.length > 0
          ? pricedVariant.dynamicSections
          : null
      );
      setVariantMediaSections(
        Array.isArray(pricedVariant?.mediaSections) &&
          pricedVariant.mediaSections.length > 0
          ? pricedVariant.mediaSections
          : null
      );
    } else {
      setStock(product?.stock);
      setActiveImage(productImages[0] || "");

      const baseRawPrice = product?.prices?.price ?? 0;
      const baseRawOriginal =
        product?.prices?.originalPrice ?? baseRawPrice;

      const price = getNumber(baseRawPrice);
      const originalPrice = getNumber(baseRawOriginal);

      // Use actual discount percentage from database (product discount)
      const discount = getNumber(product?.prices?.discount ?? 0);

      console.log("Discount Debug (no variant):", {
        productPricesDiscount: product?.prices?.discount,
        finalDiscount: discount
      });

      setDiscount(discount);
      setPrice(price);
      setOriginalPrice(originalPrice);

      // Set dynamic title and description - use product title/description when no variant
      setDynamicTitle(showingTranslateValue(product?.title));
      setDynamicDescription(showingTranslateValue(product?.description));

      // Reset variant-specific sections when no variant
      setVariantDynamicSections(null);
      setVariantMediaSections(null);
    }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.stock,
    product?.variants,
    selectVa,
    selectVariant,
    value,
    productImages,
    variantTitle,
    showingTranslateValue,
    getNumber,
    product?.title,
    product?.description,
  ]);

  useEffect(() => {
    // Initialize gallery images and active image when product media changes
    const initialImage = productImages[0] || "";
    setActiveImage(initialImage);
    setCurrentImages((prev) =>
      prev && prev.length > 0 ? prev : productImages
    );
    // Initialize dynamic title and description on mount
    if (!dynamicTitle) {
      setDynamicTitle(showingTranslateValue(product?.title));
    }
    if (!dynamicDescription) {
      setDynamicDescription(showingTranslateValue(product?.description));
    }
  }, [productImages]);

  // Calculate expected delivery time
  useEffect(() => {
    const calculateDelivery = async () => {
      try {
        console.log("Calculating delivery time...", {
          hasGlobalSetting: !!globalSetting,
          hasShippingAddress: !!shippingAddressData,
          globalSetting: globalSetting ? {
            hasAddress: !!globalSetting.address,
            hasPostCode: !!globalSetting.post_code
          } : null
        });

        const deliveryTime = await getExpectedDeliveryTime(
          globalSetting,
          shippingAddressData
        );

        console.log("Delivery time result:", deliveryTime);
        setExpectedDeliveryTime(deliveryTime);
      } catch (error) {
        console.error("Error calculating delivery time:", error);
        // Set to null on error so we show the location picker
        setExpectedDeliveryTime(null);
      }
    };

    calculateDelivery();

    const handleLocationUpdate = () => {
      console.log("Location updated event received, recalculating delivery time...");
      calculateDelivery();
    };

    if (typeof window !== "undefined") {
      window.addEventListener('locationUpdated', handleLocationUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('locationUpdated', handleLocationUpdate);
      }
    };
  }, [globalSetting, shippingAddressData]);

  // Fetch reviews when product or filters change
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) return;
      try {
        setReviewsLoading(true);
        const res = await ReviewServices.getProductReviews({
          productId: product._id,
          sort: reviewsSort,
          rating: reviewsRatingFilter,
          page: 1,
          limit: 6,
        });
        setReviews(res.reviews || []);
        setRatingSummary(res.ratingSummary || null);
        setReviewsPage(1);
        setReviewsHasMore(
          res.pagination && res.pagination.page < res.pagination.pages
        );
      } catch (err) {
        notifyError(
          err?.response?.data?.message || "Failed to load reviews."
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?._id, reviewsSort, reviewsRatingFilter]);

  const handleLoadMoreReviews = async () => {
    if (!product?._id || !reviewsHasMore || reviewsLoading) return;
    try {
      const nextPage = reviewsPage + 1;
      setReviewsLoading(true);
      const res = await ReviewServices.getProductReviews({
        productId: product._id,
        sort: reviewsSort,
        rating: reviewsRatingFilter,
        page: nextPage,
        limit: 6,
      });
      setReviews((prev) => [...prev, ...(res.reviews || [])]);
      setReviewsPage(nextPage);
      setReviewsHasMore(
        res.pagination && res.pagination.page < res.pagination.pages
      );
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Failed to load more reviews."
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async ({ productId, rating, reviewText }) => {
    if (!productId) return;
    try {
      setReviewSubmitting(true);
      const res = await ReviewServices.addOrUpdateReview({
        productId,
        rating,
        reviewText,
      });

      if (res.review) {
        setReviews((prev) => {
          const idx = prev.findIndex((r) => r._id === res.review._id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = res.review;
            return updated;
          }
          return [res.review, ...prev];
        });
      }
      if (res.ratingSummary) {
        setRatingSummary(res.ratingSummary);
      }
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Failed to submit review."
      );
      throw err;
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleMarkHelpful = async (review) => {
    if (!review?._id) return;
    try {
      const res = await ReviewServices.markHelpful(review._id);
      if (res.review) {
        setReviews((prev) =>
          prev.map((r) => (r._id === res.review._id ? res.review : r))
        );
      }
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Failed to mark as helpful."
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) return;
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await ReviewServices.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      notifySuccess("Review deleted successfully.");
      // If we deleted the only review by the current user, it will disappear from existingReview too
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Failed to delete review."
      );
    }
  };

  // Additional useEffect to handle variant changes when selectVa changes (for immediate updates on button click)
  useEffect(() => {
    // Only trigger if we have variants
    if (!product?.variants || product.variants.length === 0) return;

    // Get attribute keys
    const attributeKeys = variantTitle?.map(att => att._id) || [];
    if (attributeKeys.length === 0) return;

    // Check if selectVa has any attribute selections
    const hasAttributeSelection = selectVa && Object.keys(selectVa).some(key => attributeKeys.includes(key));

    if (!hasAttributeSelection) return;

    // Find matching variant based on selected attributes
    const matchingVariant = product.variants.find((variant) => {
      return attributeKeys.every((attrKey) => {
        const selectedValue = selectVa[attrKey];
        // If attribute is selected, it must match; if not selected, allow any value
        if (!selectedValue) return true;
        return variant[attrKey] === selectedValue;
      });
    });

    // Compare by SKU or by checking if attributes match
    const isDifferent = !selectVariant ||
      matchingVariant?.sku !== selectVariant?.sku ||
      attributeKeys.some(key => matchingVariant[key] !== selectVariant[key]);

    if (matchingVariant && isDifferent) {
      setSelectVariant(matchingVariant);

      // Update images immediately - prioritize variant images
      let variantImages = [];
      if (Array.isArray(matchingVariant?.images) && matchingVariant.images.length > 0) {
        variantImages = matchingVariant.images;
      } else if (matchingVariant?.image) {
        variantImages = [matchingVariant.image];
      }

      // If variant has video, add it to images array
      if (matchingVariant?.video && typeof matchingVariant.video === "string" && matchingVariant.video.trim() !== "") {
        if (!variantImages.includes(matchingVariant.video)) {
          variantImages.push(matchingVariant.video);
        }
      }

      const variantImage = variantImages.length > 0
        ? variantImages[0]
        : (productImages[0] || "");
      setActiveImage(variantImage);
      setCurrentImages(
        variantImages.length > 0 ? variantImages : productImages
      );

      // Update price, stock, etc. immediately
      setStock(matchingVariant?.quantity || 0);
      const price = getNumber(matchingVariant?.price);
      const originalPrice = getNumber(matchingVariant?.originalPrice);

      // Use actual discount percentage from database (variant discount)
      const variantDiscount = getNumber(matchingVariant?.discount ?? matchingVariant?.prices?.discount ?? null);
      const productDiscount = getNumber(product?.prices?.discount ?? 0);
      // Use variant discount if available, otherwise use product discount
      const discount = variantDiscount !== null && variantDiscount !== undefined ? variantDiscount : productDiscount;

      setDiscount(discount);
      setPrice(price);
      setOriginalPrice(originalPrice);

      // Update dynamic title and description immediately
      const variantTitleText = showingTranslateValue(matchingVariant?.title);
      const variantDescText = showingTranslateValue(matchingVariant?.description);
      setDynamicTitle(variantTitleText || showingTranslateValue(product?.title));
      setDynamicDescription(variantDescText || showingTranslateValue(product?.description));

      // Update variant-specific dynamic and media sections immediately
      // Always set if array exists, even if sections have isVisible: false
      setVariantDynamicSections(
        Array.isArray(matchingVariant?.dynamicSections) && matchingVariant.dynamicSections.length > 0
          ? matchingVariant.dynamicSections
          : null
      );
      setVariantMediaSections(
        Array.isArray(matchingVariant?.mediaSections) && matchingVariant.mediaSections.length > 0
          ? matchingVariant.mediaSections
          : null
      );
    }
  }, [selectVa, variantTitle, product?.variants, productImages, showingTranslateValue, getNumber, product?.title, product?.description, selectVariant]);
  useEffect(() => {
    // GUARD: Exit early if product or variants array doesn't exist yet
    if (!product || !product.variants || product.variants.length === 0) {
      return;
    }

    // Now this is completely safe to run because variants is guaranteed to be an array
    const res = Object.keys(Object.assign({}, ...product.variants));
    const varTitle = attributes?.filter((att) => res.includes(att?._id));

    setVariantTitle(varTitle?.sort());
  }, [product, variants, attributes]); // Added 'product' here to re-run once the product details load

  useEffect(() => {
    setIsLoading(false);
  }, [product]);

  // Scroll spy to update active tab and show/hide sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "product-description",
        "specification",
        "key-uses",
        "how-to-use",
        "safety-information",
        "additional-information",
        "faq"
      ];

      let currentSection = "";
      const isDesktop = window.innerWidth >= 1024;
      // Desktop: Header (~100px) + Tabs (~60px) + Buffer = ~180px
      // Mobile: Header (~64px) + Tabs (~60px) + Buffer = ~140px
      const offset = isDesktop ? 180 : 140;

      // Check if product-description section is reached to show sticky bottom bar (mobile only)
      const productDescriptionElement = document.getElementById("product-description");
      if (productDescriptionElement && !isDesktop) {
        const rect = productDescriptionElement.getBoundingClientRect();
        // Show sticky bottom bar when product description section reaches top
        const shouldShowSticky = rect.top <= offset;
        setShowStickyBottomBar(shouldShowSticky);
      } else {
        setShowStickyBottomBar(false);
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset) {
            currentSection = sectionId;
          }
        }
      }

      if (currentSection) {
        setActiveTab(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll active tab into view when it changes
  useEffect(() => {
    const tabContainer = document.querySelector('.tab-navigation-container');
    if (!tabContainer || !activeTab) return;

    const activeButton = tabContainer.querySelector(`[data-tab="${activeTab}"]`);
    if (activeButton) {
      const containerWidth = tabContainer.offsetWidth;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;

      const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

      tabContainer.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  const handleAddToCart = (p) => {
    if (stock <= 0) return notifyError("Insufficient stock");

    const hasVariants = product?.variants && product.variants.length > 0;
    if (
      hasVariants &&
      (!selectVariant || Object.keys(selectVariant).length === 0)
    ) {
      return notifyError("Please select all variants first!");
    }

    const { variants, categories, description, ...updatedProduct } = product;

    // Ensure we have a valid price (prefer wholesaler price when applicable)
    const currentPrice = (isWholesaler && product?.wholePrice && Number(product.wholePrice) > 0)
      ? Number(product.wholePrice)
      : (price > 0
        ? price
        : getNumber(selectVariant?.price ?? product?.prices?.price ?? 0)
      );

    const currentOriginalPrice = (isWholesaler && product?.wholePrice && Number(product.wholePrice) > 0)
      ? (product?.prices?.originalPrice ?? product?.prices?.price ?? 0)
      : (originalPrice > 0
        ? originalPrice
        : getNumber(selectVariant?.originalPrice ?? product?.prices?.originalPrice ?? currentPrice)
      );

    const newItem = {
      ...updatedProduct,
      id: `${!hasVariants || p.variants.length === 0
          ? p._id
          : p._id +
          "-" +
          variantTitle?.map((att) => selectVariant[att._id]).join("-")
        }`,

      title: `${!hasVariants || p.variants.length === 0
          ? dynamicTitle || showingTranslateValue(product?.title)
          : (dynamicTitle || showingTranslateValue(product?.title)) +
          "-" +
          variantTitle
            ?.map((att) =>
              att.variants?.find((v) => v._id === selectVariant[att._id])
            )
            .map((el) => showingTranslateValue(el?.name))
        }`,
      image: activeImage || product.image?.[0] || product.images?.[0],
      variant: selectVariant,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
    };

    const minQty = isWholesaler && product?.minQuantity ? Number(product.minQuantity) : 1;
    handleAddItem(newItem, minQty);
  };

  const handleAddToWishlist = (p) => {
    if (typeof window === "undefined") return;

    try {
      const result = addToWishlist(p);

      if (!result.ok && result.reason === "exists") {
        notifyError("Product already in wishlist");
        return;
      }

      if (!result.ok) {
        notifyError("Failed to add to wishlist");
        return;
      }

      notifySuccess("Product added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      notifyError("Failed to add to wishlist");
    }
  };

  const handleAddToCompare = (p) => {
    if (typeof window === "undefined") return;

    try {
      const storedCompare = localStorage.getItem("compare");
      let compare = storedCompare ? JSON.parse(storedCompare) : [];

      // Check if product already exists in compare
      const exists = compare.some((item) => item._id === p._id);

      if (exists) {
        notifyError("Product already in compare list");
        return;
      }

      // Limit compare list to 4 products
      if (compare.length >= 4) {
        notifyError("You can compare maximum 4 products");
        return;
      }

      // Add product to compare
      compare.push(p);
      localStorage.setItem("compare", JSON.stringify(compare));
      notifySuccess("Product added to compare list");
    } catch (error) {
      console.error("Error adding to compare:", error);
      notifyError("Failed to add to compare list");
    }
  };

  const handleBuyNow = (p) => {
    try {
      // Check stock first - handle products with and without variants
      if (stock <= 0) {
        return notifyError("Insufficient stock");
      }

      // Check if variants need to be selected
      const hasVariants = product?.variants && product.variants.length > 0;
      if (
        hasVariants &&
        (!selectVariant || Object.keys(selectVariant).length === 0)
      ) {
        return notifyError("Please select all variants first!");
      }

      // Prepare product item for direct checkout
      const { variants, categories, description, ...updatedProduct } = product;

      // Ensure we have a valid price (prefer wholesaler price when applicable)
      const currentPrice = (isWholesaler && product?.wholePrice && Number(product.wholePrice) > 0)
        ? Number(product.wholePrice)
        : (price > 0
          ? price
          : getNumber(selectVariant?.price ?? product?.prices?.price ?? 0)
        );
      const currentOriginalPrice = (isWholesaler && product?.wholePrice && Number(product.wholePrice) > 0)
        ? (product?.prices?.originalPrice ?? product?.prices?.price ?? 0)
        : (originalPrice > 0
          ? originalPrice
          : getNumber(selectVariant?.originalPrice ?? product?.prices?.originalPrice ?? currentPrice)
        );

      const minQtyBuy = isWholesaler && product?.minQuantity ? Number(product.minQuantity) : item;
      const newItem = {
        ...updatedProduct,
        id: `${!hasVariants || (p.variants && p.variants.length <= 1)
            ? p._id
            : p._id +
            variantTitle?.map((att) => selectVariant[att._id]).join("-")
          }`,
        title: `${!hasVariants || (p.variants && p.variants.length <= 1)
            ? dynamicTitle || showingTranslateValue(product?.title)
            : (dynamicTitle || showingTranslateValue(product?.title)) +
            "-" +
            variantTitle
              ?.map((att) =>
                att.variants?.find((v) => v._id === selectVariant[att._id])
              )
              .map((el) => showingTranslateValue(el?.name))
          }`,
        image: activeImage || product.image?.[0],
        variant: selectVariant || {},
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        quantity: minQtyBuy,
      };

      // Replace entire cart with only this product (Flipkart style - Buy Now replaces cart)
      setItems([newItem]);

      // Flipkart-style: login first if needed, then existing checkout page
      setTimeout(() => {
        if (!userInfo?.token) {
          router.push("/auth/login?redirectUrl=checkout");
          return;
        }
        router.push("/checkout");
      }, 150);
    } catch (error) {
      console.error("Buy Now error:", error);
      notifyError("Something went wrong. Please try again.");
    }
  };

  // Share current product + variant selection URL
  const handleShareCurrentVariant = async () => {
    const urlToShare =
      (typeof window !== "undefined" && window.location.href) ||
      shareUrl ||
      `https://Farmacykart-store-nine.vercel.app/product/${router.query.slug}`;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: dynamicTitle || showingTranslateValue(product?.title),
          text: dynamicDescription || showingTranslateValue(product?.description),
          url: urlToShare,
        });
        return;
      }

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(urlToShare);
        notifySuccess("Link copied to clipboard!");
        return;
      }

      notifySuccess("Share this link: " + urlToShare);
    } catch (err) {
      if (err?.name === "AbortError") return;
      notifyError("Unable to share link. Please try again.");
    }
  };

  const handleChangeImage = (img) => {
    if (img) {
      setActiveImage(img);
    }
  };

  // Update images when variant changes - create variant-specific image list
  const variantImages = useMemo(() => {
    if (!selectVariant || Object.keys(selectVariant).length === 0) {
      return productImages;
    }

    // Get images for selected variant
    const variantImgs = [];
    if (Array.isArray(selectVariant?.images) && selectVariant.images.length > 0) {
      variantImgs.push(...selectVariant.images);
    } else if (selectVariant?.image) {
      variantImgs.push(selectVariant.image);
    }

    // If variant has images, use them; otherwise use all product images
    return variantImgs.length > 0 ? variantImgs : productImages;
  }, [selectVariant, productImages]);

  const { t } = useTranslation();

  const productFaqs = useMemo(() => {
    // Handle new listSectionSchema structure (with items array)
    if (product?.faqs && typeof product.faqs === 'object' && !Array.isArray(product.faqs)) {
      // New structure: { enabled, icon, title, items: [{ key, value }] }
      if (product.faqs.items && Array.isArray(product.faqs.items)) {
        return product.faqs.items
          .filter(
            (item) =>
              item &&
              (item.key || item.value) &&
              (item.key?.trim() || item.value?.trim()) &&
              product.faqs.enabled !== false
          )
          .map((item) => ({
            question: item.key || item.value || "",
            answer: item.value || item.key || "",
            answerType: "custom",
            isVisible: true,
          }));
      }
      return [];
    }

    // Handle old array structure (backward compatibility)
    if (Array.isArray(product?.faqs)) {
      return product.faqs.filter(
        (faq) =>
          faq &&
          faq?.question &&
          faq.question.trim() !== "" &&
          faq?.isVisible !== false
      );
    }

    return [];
  }, [product?.faqs]);

  // category name slug
  const category_name = (showingTranslateValue(product?.category?.name) || "")
    .toLowerCase()
    .replace(/[^A-Z0-9]+/gi, "-");

  // Helper to create URL-friendly slugs for attribute/variant names
  const slugify = (str = "") =>
    str
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // NOTE: Variant URL syncing disabled to avoid navigation loops during Buy Now flow.
  // If you want to re-enable deep-linking by variant, restore the previous
  // useEffects that read/write variant params from/to the URL.

  // console.log("discount", discount);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const rect = element.getBoundingClientRect();
      // Header is approx 80-100px. Tabs are 50-60px. Total ~140-160px. 
      // Using 180px provides a safe buffer so the title is clearly visible.
      const offset = 180;
      const targetPosition = window.pageYOffset + rect.top - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={dynamicTitle || showingTranslateValue(product?.title)}
          description={dynamicDescription || showingTranslateValue(product?.description)}
        >
          <div className="lg:px-8 py-4">
            <div className="mx-auto px-4 lg:px-12 max-w-screen-2xl">
              <div className="flex items-center pb-6 justify-between gap-4">
                <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-zinc-400 font-medium">
                  <Link href="/" className="hover:text-yellow-400 transition-colors flex items-center gap-1 text-zinc-400">
                    Home
                  </Link>
                  <FiChevronRight className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                  <Link
                    href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                    className="hover:text-yellow-400 transition-colors text-zinc-300 capitalize"
                  >
                    {category_name?.replace(/-/g, " ")}
                  </Link>
                  <FiChevronRight className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                  <span className="text-yellow-400 font-semibold truncate max-w-[200px] sm:max-w-md">
                    {dynamicTitle || showingTranslateValue(product?.title)}
                  </span>
                </nav>
              </div>
              <div className="w-full rounded-3xl bg-transparent">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  <div className="flex-shrink-0 w-full mx-auto md:w-5/12 lg:w-5/12 xl:w-5/12">
                    <div className="mt-1 lg:mt-2 lg:sticky lg:top-28 lg:space-y-4">
                      {!isWholesaler && <Discount slug product={product} discount={discount} />}

                      {/* Flipkart-style Product Image Gallery with modern floating action buttons */}
                      <ProductImageGallery
                        images={currentImages.length > 0 ? currentImages : productImages}
                        productTitle={
                          dynamicTitle || showingTranslateValue(product?.title)
                        }
                        buttons={
                          <div className="absolute right-3.5 top-3.5 z-20 flex flex-col items-center gap-2.5">
                            {/* Wishlist Button */}
                            <div className="relative group">
                              <button
                                type="button"
                                onClick={() => handleAddToWishlist(product)}
                                className="w-10 h-10 rounded-full bg-black/80 hover:bg-yellow-400 text-zinc-300 hover:text-slate-950 border border-zinc-700/80 hover:border-yellow-400 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                                aria-label="Add to wishlist"
                              >
                                <FiHeart className="w-4 h-4" />
                              </button>
                              <span className="absolute right-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-200 whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30">
                                Wishlist
                              </span>
                            </div>

                            {/* Compare Button */}
                            <div className="relative group">
                              <button
                                type="button"
                                onClick={() => handleAddToCompare(product)}
                                className="w-10 h-10 rounded-full bg-black/80 hover:bg-yellow-400 text-zinc-300 hover:text-slate-950 border border-zinc-700/80 hover:border-yellow-400 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                                aria-label="Add to compare"
                              >
                                <FiShuffle className="w-4 h-4" />
                              </button>
                              <span className="absolute right-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-200 whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30">
                                Compare
                              </span>
                            </div>

                            {/* Share Button */}
                            <div className="relative group">
                              <button
                                type="button"
                                onClick={handleShareCurrentVariant}
                                className="w-10 h-10 rounded-full bg-black/80 hover:bg-yellow-400 text-zinc-300 hover:text-slate-950 border border-zinc-700/80 hover:border-yellow-400 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                                aria-label="Share this product"
                              >
                                <FiShare2 className="w-4 h-4" />
                              </button>
                              <span className="absolute right-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-200 whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30">
                                Share
                              </span>
                            </div>
                          </div>
                        }
                      />

                      {/* Add to Cart & Buy Now under gallery (Kalki Luxury Style) */}
                      <div className="mt-6">
                        <div className="flex flex-col sm:flex-row gap-3.5">
                          <button
                            onClick={() => handleAddToCart(product)}
                            type="button"
                            className="add-to-cart-btn flex-1 h-14 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2.5 border-2 border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-slate-950 shadow-md hover:shadow-yellow-400/25 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                          >
                            <FiShoppingCart className="w-5 h-5" />
                            <span>{t("AddToCart")}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBuyNow(product);
                            }}
                            type="button"
                            className="flex-1 h-14 rounded-2xl text-base font-black flex items-center justify-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-xl shadow-yellow-400/25 hover:shadow-yellow-400/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                          >
                            <FiZap className="w-5 h-5 fill-current" />
                            <span>Buy Now</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 mt-3.5 font-medium">
                          <FiShield className="w-4 h-4 text-emerald-400" />
                          <span>100% Secure &amp; Verified Checkout</span>
                        </div>

                        {/* Trust Features Section */}
                        <div className="mt-5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {/* Feature 1 */}
                            <div className="flex items-center gap-3 sm:border-r border-zinc-800/80 sm:pr-4">
                              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 shadow-sm">
                                <FiCheckCircle className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs sm:text-sm font-bold text-white">100% Genuine</p>
                                <p className="text-[11px] text-zinc-400">Quality assured</p>
                              </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex items-center gap-3 sm:border-r border-zinc-800/80 sm:pr-4">
                              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 shadow-sm">
                                <FiShield className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs sm:text-sm font-bold text-white">Secure Pay</p>
                                <p className="text-[11px] text-zinc-400">Encrypted checkout</p>
                              </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 shadow-sm">
                                <FiTruck className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs sm:text-sm font-bold text-white">Fast Delivery</p>
                                <p className="text-[11px] text-zinc-400">Doorstep dispatch</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      </div>
                    </div>



                  <div className="w-full lg:w-7/12 relative min-w-0">
                    <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row">
                      <div className="xl:pr-6 md:pr-6 w-full">
                        <div className="mb-6">
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-3">
                            {dynamicTitle || showingTranslateValue(product?.title)}
                          </h1>

                          {/* Top summary rating row */}
                          {ratingSummary && (
                            <div className="flex items-center flex-wrap gap-2.5 mb-3.5">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-sm">
                                <span>
                                  {ratingSummary.averageRating?.toFixed
                                    ? ratingSummary.averageRating.toFixed(1)
                                    : "0.0"}
                                </span>
                                <AiFillStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              </div>
                              <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                                {ratingSummary.totalRatings || 0} Ratings &amp;{" "}
                                {ratingSummary.totalReviews || 0} Reviews
                              </span>
                              <span className="text-zinc-600">·</span>
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                                <FiCheckCircle className="w-3.5 h-3.5" /> Verified
                              </span>
                            </div>
                          )}

                          <div className="text-sm sm:text-base leading-relaxed text-zinc-300 mb-4 font-normal">
                            {(() => {
                              const descriptionText = dynamicDescription || showingTranslateValue(product?.description);
                              const displayText = isReadMore
                                ? (descriptionText?.slice(0, 230) || "")
                                : (descriptionText || "");
                              const textLength = descriptionText?.length || 0;

                              return (
                                <>
                                  {displayText}
                                  {textLength > 230 && (
                                    <>
                                      <br />
                                      <span
                                        onClick={() => setIsReadMore(!isReadMore)}
                                        className="read-or-hide cursor-pointer text-yellow-400 hover:text-yellow-300 font-semibold ml-1"
                                      >
                                        {isReadMore
                                          ? t("moreInfo")
                                          : t("showLess")}
                                      </span>
                                    </>
                                  )}
                                </>
                              );
                            })()}
                          </div>

                          <div className="mb-6">
                            <Stock stock={stock} />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-zinc-900/95 via-zinc-900/70 to-zinc-950/95 rounded-3xl p-5 sm:p-6 mb-6 border border-zinc-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
                          <div className="absolute -top-10 -right-10 w-36 h-36 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
                          <Price
                            // If wholesaler and product has wholesale price, show that price
                            price={
                              (isWholesaler && product?.wholePrice && Number(product.wholePrice) > 0)
                                ? Number(product.wholePrice)
                                : (price > 0
                                  ? price
                                  : getNumber(
                                    (product?.variants?.[0]?.price ??
                                      product?.prices?.price) || 0
                                  ))
                            }
                            product={product}
                            currency={currency}
                            discount={discount || product?.prices?.discount || 0}
                            originalPrice={
                              originalPrice > 0
                                ? originalPrice
                                : getNumber(
                                  (product?.variants?.[0]?.originalPrice ??
                                    product?.prices?.originalPrice ??
                                    product?.variants?.[0]?.price ??
                                    product?.prices?.price) || 0
                                )
                            }
                            hideDiscountAndMRP={isWholesaler}
                            showTaxLabel
                          />

                          {discount > 0 && !isWholesaler && (
                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-bold">
                              <span className="animate-bounce-short">🔥</span> Special Discount Applied
                            </div>
                          )}

                          {isWholesaler && product?.minQuantity && Number(product.minQuantity) > 0 && (
                            <p className="text-xs md:text-sm text-yellow-400 font-semibold mt-4 border-t pt-3 border-zinc-800">
                              Min order quantity: <span className="font-bold text-white">{product.minQuantity} Units</span>
                            </p>
                          )}
                        </div>

                        {/* Flipkart-style Variant Selection */}
                        <div className="mb-6 space-y-4">
                          {variantTitle?.map((a, i) => (
                            <div key={i + 1} className="pb-3">
                              <div className="flex items-center mb-2">
                                <h4 className="text-sm font-semibold text-white mr-2">
                                  {showingTranslateValue(a?.name)}:
                                </h4>
                                {selectVariant[a._id] && (
                                  <span className="text-xs text-yellow-400 font-medium">
                                    {
                                      showingTranslateValue(
                                        a?.variants?.find(v => v._id === selectVariant[a._id])?.name
                                      )
                                    }
                                  </span>
                                )}
                              </div>
                              <div className="max-w-full">
                                <VariantList
                                  att={a._id}
                                  lang={lang}
                                  option={a.option}
                                  setValue={setValue}
                                  varTitle={variantTitle}
                                  setSelectVa={setSelectVa}
                                  variants={product.variants}
                                  selectVariant={selectVariant}
                                  setSelectVariant={setSelectVariant}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>

                          <div className="flex items-center flex-wrap gap-2 pt-3 pb-2 border-t border-zinc-800/80 mt-4">
                            <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                              Category:
                            </span>
                            <Link
                              href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                            >
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/50 transition-all capitalize"
                                onClick={() => setIsLoading(!isLoading)}
                              >
                                {category_name?.replace(/-/g, " ")}
                              </button>
                            </Link>
                            <Tags product={product} />
                          </div>

                          <div className="mt-5 space-y-3">
                            {/* Order by phone card */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center flex-shrink-0">
                                  <FiPhoneCall className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">Order by Phone</p>
                                  <a
                                    href={`tel:${(storeCustomizationSetting?.navbar?.phone || storeCustomizationSetting?.footer?.bottom_contact || globalSetting?.contact || "+91 98765 43210").replace(/\s+/g, '')}`}
                                    className="text-xs sm:text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
                                  >
                                    {storeCustomizationSetting?.navbar?.phone || storeCustomizationSetting?.footer?.bottom_contact || globalSetting?.contact || "+91 98765 43210"}
                                  </a>
                                </div>
                              </div>
                              <a
                                href={`tel:${(storeCustomizationSetting?.navbar?.phone || storeCustomizationSetting?.footer?.bottom_contact || globalSetting?.contact || "+91 98765 43210").replace(/\s+/g, '')}`}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 transition-all shadow-md active:scale-95"
                              >
                                Call Now
                              </a>
                            </div>

                            {/* Expected Delivery Time / Check Delivery */}
                            {expectedDeliveryTime ? (
                              <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                                  <FiTruck className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-zinc-400 text-xs font-medium">Expected Delivery</span>
                                  <span className="text-white font-bold text-sm sm:text-base">
                                    {expectedDeliveryTime}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 font-medium">
                                  <FiTruck className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                  <span>Check Delivery &amp; Availability:</span>
                                </div>
                                <LocationPickerDropdown className="w-full sm:w-auto !border !border-zinc-700/80 !bg-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-200 hover:!border-yellow-400 transition-all justify-between !h-auto" />
                              </div>
                            )}
                          </div>
                          {/* social share
                          <div className="mt-2">
                              <h3 className="text-base font-semibold mb-1 font-serif">
                              {t("shareYourSocial")}
                            </h3>
                              <p className="font-sans text-sm text-gray-500">
                              {t("shareYourSocialText")}
                            </p>
                            <ul className="flex mt-4">
                              <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-store-500  mr-2 transition ease-in-out duration-500">
                                <FacebookShareButton
                                  url={
                                    shareUrl ||
                                    (typeof window !== "undefined"
                                      ? window.location.href
                                      : `https://Farmacykart-store-nine.vercel.app/product/${router.query.slug}`)
                                  }
                                  quote=""
                                >
                                  <FacebookIcon size={32} round />
                                </FacebookShareButton>
                              </li>
                              <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-store-500  mr-2 transition ease-in-out duration-500">
                                <TwitterShareButton
                                  url={
                                    shareUrl ||
                                    (typeof window !== "undefined"
                                      ? window.location.href
                                      : `https://Farmacykart-store-nine.vercel.app/product/${router.query.slug}`)
                                  }
                                  quote=""
                                >
                                  <TwitterIcon size={32} round />
                                </TwitterShareButton>
                              </li>
                              <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-store-500  mr-2 transition ease-in-out duration-500">
                                <a
                                  href={`https://www.instagram.com/?url=${
                                    shareUrl ||
                                    (typeof window !== "undefined"
                                      ? window.location.href
                                      : `https://Farmacykart-store-nine.vercel.app/product/${router.query.slug}`)
                                  }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-full h-full"
                                  aria-label="Share on Instagram"
                                >
                                  <FaInstagram size={32} style={{ color: '#E4405F' }} />
                                </a>
                              </li>
                              <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-store-500  mr-2 transition ease-in-out duration-500">
                                <WhatsappShareButton
                                  url={
                                    shareUrl ||
                                    (typeof window !== "undefined"
                                      ? window.location.href
                                      : `https://Farmacykart-store-nine.vercel.app/product/${router.query.slug}`)
                                  }
                                  quote=""
                                >
                                  <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                              </li>
                              <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-store-500  mr-2 transition ease-in-out duration-500">
                                <LinkedinShareButton
                                  url={
                                    shareUrl ||
                                    (typeof window !== "undefined"
                                      ? window.location.href
                                      : `https://Farmacykart-store-nine.vercel.app/product/${router.query.slug}`)
                                  }
                                  quote=""
                                >
                                  <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                              </li>
                            </ul>
                          </div> */}


                          {/* Composition Section */}
                          {product?.composition?.enabled !== false && product?.composition?.description && (
                            <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-white">
                              <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                  {product.composition.title || "Composition"}
                                </h2>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                {product.composition.description}
                              </p>
                            </div>
                          )}

                          {/* Product Highlights Section */}
                          {product?.productHighlights?.enabled !== false && product?.productHighlights?.items?.length > 0 && (
                            <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-white">
                              <div className="flex items-center gap-3 mb-4">
                                {product.productHighlights.icon && (
                                  <img src={product.productHighlights.icon} alt="" className="w-10 h-10" />
                                )}
                                <h2 className="text-xl font-semibold text-gray-800">
                                  {product.productHighlights.title || "Product Highlights"}
                                </h2>
                              </div>
                              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 text-justify">
                                {product.productHighlights.items.map((item, idx) => (
                                  <li key={idx} className="leading-relaxed">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Premium Tab Navigation */}
                          <div className="sticky top-16 lg:top-[80px] z-40 bg-black/90 backdrop-blur-md mt-12 mb-8 py-1 border-b border-zinc-800 shadow-xl">
                            <style jsx global>{`
                              .tab-navigation-container {
                                scrollbar-width: none !important;
                                -ms-overflow-style: none !important;
                              }
                              .tab-navigation-container::-webkit-scrollbar {
                                display: none !important;
                              }
                              @keyframes pulse-subtle {
                                0% { opacity: 0.95; transform: scale(1); }
                                50% { opacity: 1; transform: scale(1.02); }
                                100% { opacity: 0.95; transform: scale(1); }
                              }
                              .lg\:animate-pulse-subtle:hover {
                                animation: pulse-subtle 2s infinite ease-in-out;
                              }
                              .animate-bounce-short {
                                animation: bounce-short 1s infinite;
                              }
                              @keyframes bounce-short {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-3px); }
                              }
                            `}</style>
                            <div className="max-w-screen-2xl mx-auto px-4 lg:px-12">
                              <div className="flex gap-6 overflow-x-auto tab-navigation-container">
                                {product?.productDescription?.enabled !== false && (
                                  <button
                                    data-tab="product-description"
                                    onClick={() => handleTabClick("product-description")}
                                    className={`relative py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === "product-description"
                                        ? "text-yellow-400"
                                        : "text-zinc-400 hover:text-zinc-200"
                                      }`}
                                  >
                                    Description
                                    {activeTab === "product-description" && (
                                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                                    )}
                                  </button>
                                )}
                                {product?.dynamicSections?.some(s => s?.name?.toLowerCase().includes("specification")) && (
                                  <button
                                    data-tab="specification"
                                    onClick={() => handleTabClick("specification")}
                                    className={`relative py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === "specification"
                                        ? "text-yellow-400"
                                        : "text-zinc-400 hover:text-zinc-200"
                                      }`}
                                  >
                                    Specification
                                    {activeTab === "specification" && (
                                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                                    )}
                                  </button>
                                )}
                                {product?.keyUses?.enabled !== false && product?.keyUses?.items?.length > 0 && (
                                  <button
                                    data-tab="key-uses"
                                    onClick={() => handleTabClick("key-uses")}
                                    className={`relative py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === "key-uses"
                                        ? "text-yellow-400"
                                        : "text-zinc-400 hover:text-zinc-200"
                                      }`}
                                  >
                                    Key Uses
                                    {activeTab === "key-uses" && (
                                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                                    )}
                                  </button>
                                )}
                                {product?.howToUse?.enabled !== false && product?.howToUse?.items?.length > 0 && (
                                  <button
                                    data-tab="how-to-use"
                                    onClick={() => handleTabClick("how-to-use")}
                                    className={`relative py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === "how-to-use"
                                        ? "text-yellow-400"
                                        : "text-zinc-400 hover:text-zinc-200"
                                      }`}
                                  >
                                    Usage Guide
                                    {activeTab === "how-to-use" && (
                                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                                    )}
                                  </button>
                                )}
                                {product?.safetyInformation?.enabled !== false && product?.safetyInformation?.items?.length > 0 && (
                                  <button
                                    data-tab="safety-information"
                                    onClick={() => handleTabClick("safety-information")}
                                    className={`relative py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === "safety-information"
                                        ? "text-yellow-400"
                                        : "text-zinc-400 hover:text-zinc-200"
                                      }`}
                                  >
                                    Safety
                                    {activeTab === "safety-information" && (
                                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                                    )}
                                  </button>
                                )}
                                {productFaqs.length > 0 && (
                                  <button
                                    data-tab="faq"
                                    onClick={() => handleTabClick("faq")}
                                    className={`relative py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === "faq"
                                        ? "text-yellow-400"
                                        : "text-zinc-400 hover:text-zinc-200"
                                      }`}
                                  >
                                    FAQs
                                    {activeTab === "faq" && (
                                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Product Description Section */}
                          {product?.productDescription?.enabled !== false && product?.productDescription?.description && (
                            <div id="product-description" className="mt-8 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="w-1.5 h-6 bg-yellow-400 rounded-full flex-shrink-0" />
                                {product.productDescription.icon && (
                                  <img src={product.productDescription.icon} alt="" className="w-8 h-8 rounded-lg" />
                                )}
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                  {product.productDescription.title || "Product Description"} of {dynamicTitle || showingTranslateValue(product?.title)}
                                </h2>
                              </div>
                              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed text-justify font-normal">
                                {product.productDescription.description}
                              </p>
                            </div>
                          )}

                          {/* Specification Section */}
                          {product?.dynamicSections?.some(s => s?.name?.toLowerCase().includes("specification")) && (
                            <div id="specification" className="mt-8 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                              {product.dynamicSections
                                .filter(s => s?.name?.toLowerCase().includes("specification"))
                                .map((section, idx) => (
                                  <div key={idx} className="mb-6 last:mb-0">
                                    <div className="flex items-center gap-3 mb-4">
                                      <span className="w-1.5 h-6 bg-yellow-400 rounded-full flex-shrink-0" />
                                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                                        {section.name} of {dynamicTitle || showingTranslateValue(product?.title)}
                                      </h2>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-300">
                                      {section.subsections
                                        ?.filter(sub => sub?.type !== "paragraph" && (sub?.key || sub?.value))
                                        .map((sub, subIdx) => (
                                          <li key={subIdx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                                            <span className="text-zinc-400 font-medium">{sub.key || sub.title}:</span>
                                            <span className="text-white font-bold">{sub.value || sub.content}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                            </div>
                          )}

                          {/* Key Uses Section */}
                          {product?.keyUses?.enabled !== false && product?.keyUses?.items?.length > 0 && (
                            <div id="key-uses" className="mt-8 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="w-1.5 h-6 bg-yellow-400 rounded-full flex-shrink-0" />
                                {product.keyUses.icon && (
                                  <img src={product.keyUses.icon} alt="" className="w-8 h-8 rounded-lg" />
                                )}
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                  {product.keyUses.title || "Key Uses"} of {dynamicTitle || showingTranslateValue(product?.title)}
                                </h2>
                              </div>
                              <ul className="space-y-3 text-sm text-zinc-300">
                                {product.keyUses.items.map((item, idx) => (
                                  <li key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 leading-relaxed">
                                    <strong className="text-yellow-400 mr-2">{item.key || item.value}:</strong>{" "}
                                    {item.value && item.key ? item.value : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* How To Use Section */}
                          {product?.howToUse?.enabled !== false && product?.howToUse?.items?.length > 0 && (
                            <div id="how-to-use" className="mt-8 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="w-1.5 h-6 bg-yellow-400 rounded-full flex-shrink-0" />
                                {product.howToUse.icon && (
                                  <img src={product.howToUse.icon} alt="" className="w-8 h-8 rounded-lg" />
                                )}
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                  {product.howToUse.title || "How To Use"}
                                </h2>
                              </div>
                              <ul className="space-y-3 text-sm text-zinc-300">
                                {product.howToUse.items.map((item, idx) => (
                                  <li key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 leading-relaxed flex items-start gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Safety Information Section */}
                          {product?.safetyInformation?.enabled !== false && product?.safetyInformation?.items?.length > 0 && (
                            <div id="safety-information" className="mt-8 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="w-1.5 h-6 bg-yellow-400 rounded-full flex-shrink-0" />
                                {product.safetyInformation.icon && (
                                  <img src={product.safetyInformation.icon} alt="" className="w-8 h-8 rounded-lg" />
                                )}
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                  {product.safetyInformation.title || "Safety Information"}
                                </h2>
                              </div>
                              <ul className="space-y-3 text-sm text-zinc-300">
                                {product.safetyInformation.items.map((item, idx) => (
                                  <li key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 leading-relaxed flex items-start gap-2.5">
                                    <FiShield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Additional Information Section */}
                          {product?.additionalInformation?.enabled !== false && product?.additionalInformation?.subsections?.length > 0 && (
                            <div id="additional-information" className="mt-8 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="w-1.5 h-6 bg-yellow-400 rounded-full flex-shrink-0" />
                                {product.additionalInformation.icon && (
                                  <img src={product.additionalInformation.icon} alt="" className="w-8 h-8 rounded-lg" />
                                )}
                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                  {product.additionalInformation.title || "Additional Information"}
                                </h2>
                              </div>
                              <div className="space-y-6">
                                {product.additionalInformation.subsections.map((subsection, idx) => (
                                  <div key={idx} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5">
                                    <h3 className="inline-block px-3 py-1 mb-3 text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                                      {subsection.label}
                                    </h3>
                                    <ul className="space-y-2 text-sm text-zinc-300">
                                      {subsection.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="leading-relaxed">
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Product Details Section (Dynamic & Media) */}
                          <ProductDetailsSection
                            dynamicSections={variantDynamicSections || product?.dynamicSections}
                            mediaSections={variantMediaSections || product?.mediaSections}
                            selectedAttributes={selectVa || selectVariant || {}}
                            isVariantSpecific={!!variantDynamicSections}
                          />

                          {/* Modern FAQ Section */}
                          {productFaqs.length > 0 && (
                            <div id="faq" className="mt-12 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                                {product?.faqs?.title || (product?.faqTitle && product.faqTitle.trim().length
                                  ? product.faqTitle
                                  : t("frequentlyAskedQuestions") ||
                                  "Common Questions")}
                              </h3>
                              <div className="space-y-3">
                                {productFaqs.map((faq, index) => {
                                  const isOpen = activeFaqIndex === index;
                                  return (
                                    <div key={`${faq.question}-${index}`} className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'border-yellow-400/40 bg-zinc-900/90 shadow-md' : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70'}`}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setActiveFaqIndex(isOpen ? null : index)
                                        }
                                        className="w-full flex items-center justify-between text-left px-5 py-4 focus:outline-none"
                                      >
                                        <span className="text-sm sm:text-base font-bold text-white pr-4">
                                          {faq.question}
                                        </span>
                                        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-yellow-400' : 'text-zinc-400'}`}>
                                          <FiChevronDown className="w-5 h-5" />
                                        </span>
                                      </button>
                                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-5 pb-5 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3.5">
                                          {faq.answerType === "yes" || faq.answerType === "no"
                                            ? faq.answer
                                            : faq.answer || faq.customAnswer || ""}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Manufacturer Details Section */}
                          {product?.manufacturerDetails?.enabled !== false && product?.manufacturerDetails?.items?.length > 0 && (
                            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full" />
                                {product?.manufacturerDetails?.title || "Manufacturer details"}
                              </h3>
                              <div className="space-y-2 text-sm text-zinc-300 leading-relaxed">
                                {product.manufacturerDetails.items.map((item, idx) => (
                                  <p key={idx} className="leading-relaxed">
                                    {item}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Disclaimer Section */}
                          {product?.disclaimer?.enabled !== false && product?.disclaimer?.description && (
                            <div className="mt-4 p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full" />
                                {product?.disclaimer?.title || "Disclaimer"}
                              </h3>
                              <div className="text-sm text-zinc-400 leading-relaxed">
                                <p className="leading-relaxed">
                                  {typeof product.disclaimer.description === 'object' && product.disclaimer.description !== null
                                    ? showingTranslateValue(product.disclaimer.description)
                                    : product.disclaimer.description}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Contact Section */}
                          {/* <div className="mt-4 p-6 bg-white">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                              In case of any issues, contact us:
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              {(() => {
                                // Try storeCustomizationSetting first, then fallback to globalSetting
                                // Get email - handle both translated object and plain string
                                const emailRaw = storeCustomizationSetting?.contact_us?.email_box_email || globalSetting?.email;
                                const email = emailRaw 
                                  ? (typeof emailRaw === 'object' && emailRaw !== null && !Array.isArray(emailRaw) ? showingTranslateValue(emailRaw) : (typeof emailRaw === 'string' ? emailRaw : ""))
                                  : "";
                                
                                // Get phone - handle both translated object and plain string
                                const phoneRaw = storeCustomizationSetting?.contact_us?.call_box_phone || globalSetting?.contact;
                                const phone = phoneRaw 
                                  ? (typeof phoneRaw === 'object' && phoneRaw !== null && !Array.isArray(phoneRaw) ? showingTranslateValue(phoneRaw) : (typeof phoneRaw === 'string' ? phoneRaw : ""))
                                  : "";
                                
                                // Get address - handle both translated object and plain string
                                const addressRaw = storeCustomizationSetting?.contact_us?.address_box_address_one || globalSetting?.address;
                                const address = addressRaw 
                                  ? (typeof addressRaw === 'object' && addressRaw !== null && !Array.isArray(addressRaw) ? showingTranslateValue(addressRaw) : (typeof addressRaw === 'string' ? addressRaw : ""))
                                  : "";
                                
                                return (
                                  <>
                                    {(email || phone) ? (
                                      <p className="leading-relaxed">
                                        {email && (
                                          <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">
                                            {email}
                                          </a>
                                        )}
                                        {email && phone && " | "}
                                        {phone && (
                                          <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-800">
                                            {phone}
                                          </a>
                                        )}
                                      </p>
                                    ) : null}
                                    {address ? (
                                      <p className="leading-relaxed">
                                        Address: {address}
                                      </p>
                                    ) : null}
                                  </>
                                );
                              })()}
                            </div>
                          </div> */}

                          {/* Enhanced Sticky Bottom Bar (Mobile only) */}
                          {showStickyBottomBar && (
                            <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black/95 backdrop-blur-md border-t border-zinc-800 shadow-[0_-8px_24px_rgba(0,0,0,0.8)] lg:hidden transition-all duration-300 slide-up">
                              <div className="max-w-screen-2xl mx-auto px-5 py-3.5">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-xs font-semibold text-zinc-400 truncate mb-1">
                                      {dynamicTitle || showingTranslateValue(product?.title)}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-xl font-black text-white tracking-tight">
                                        {currency}
                                        {getNumberTwo(
                                          (isWholesaler && product?.wholePrice && Number(product.wholePrice) > 0)
                                            ? Number(product.wholePrice)
                                            : (price > 0 ? price : getNumber((product?.variants?.[0]?.price ?? product?.prices?.price) || 0))
                                        )}
                                      </span>
                                      {discount > 0 && (
                                        <span className="text-xs font-extrabold text-yellow-400">
                                          ({discount}% OFF)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    type="button"
                                    className="add-to-cart-btn flex-shrink-0 h-12 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 active:scale-95 transition-all shadow-lg shadow-yellow-400/20"
                                  >
                                    <FiShoppingCart className="w-4 h-4" />
                                    <span>Add To Cart</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Ratings & Reviews Section - right side only */}
                          <div id="ratings-section" className="mt-8 lg:mt-10 space-y-4">
                            <RatingSummary summary={ratingSummary} />
                            <WriteReviewForm
                              productId={product?._id}
                              existingReview={reviews.find(
                                (r) => r.user?._id === userInfo?._id
                              )}
                              onSubmitReview={handleSubmitReview}
                              isSubmitting={reviewSubmitting}
                            />
                            <ReviewFilters
                              sort={reviewsSort}
                              ratingFilter={reviewsRatingFilter}
                              onSortChange={setReviewsSort}
                              onRatingFilterChange={setReviewsRatingFilter}
                            />
                            <ReviewList
                              reviews={reviews}
                              loading={reviewsLoading}
                              onLoadMore={handleLoadMoreReviews}
                              canLoadMore={reviewsHasMore}
                              onMarkHelpful={handleMarkHelpful}
                              onDeleteReview={handleDeleteReview}
                              currentUser={userInfo}
                            />
                          </div>




                        </div>


                      </div>

                      {/* shipping description card */}
                      {/* <div className="w-full xl:w-5/12 lg:w-6/12 md:w-5/12">
                        <div
                          className={`mt-6 md:mt-0 lg:mt-0 bg-gray-50 border border-gray-100 p-4 lg:p-8 rounded-lg`}
                        >
                          <Card />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* related products */}
              {relatedProducts?.length >= 2 && (
                <div className="pt-12 lg:pt-20 lg:pb-12 border-t border-zinc-800/80 mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {t("Related Products")}
                    </h3>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {(isWholesaler ? relatedProducts?.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler) : relatedProducts)?.slice(1, 13).map((product, i) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            attributes={attributes}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

// you can use getServerSideProps alternative for getStaticProps and getStaticPaths

export const getServerSideProps = async (context) => {
  const { slug } = context.params;

  const [data, attributesResponse] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: "",
      slug: slug,
    }),

    AttributeServices.getShowingAttributes({}),
  ]);

  let product = {};

  if (slug) {
    product = data?.products?.find((p) => p.slug === slug);
  }

  return {
    props: {
      product: product || null,
      attributes: attributesResponse?.attributes || [],
      relatedProducts: data?.relatedProducts || [],
    },
  };
};
export default ProductScreen;


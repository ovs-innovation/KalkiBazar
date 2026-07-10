import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useContext } from "react";
import { IoAdd, IoRemove, IoStar } from "react-icons/io5";
import { FiHeart, FiShuffle } from "react-icons/fi";
import { useCart } from "react-use-cart";
import { useRouter } from "next/router";

//internal import
import Stock from "@components/common/Stock";
import { notifyError, notifySuccess } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import Discount from "@components/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { handleLogEvent } from "src/lib/analytics";
import { addToWishlist } from "@lib/wishlist";

// const productImages = {
//   "paracetamol-500mg": "/images/img1.jpeg",
//   "Combiflame": "/images/img2.jpeg",
//   "Cardicheck": "/images/img3.jpeg",
//   "tafamidis": "/images/img4.webp",
//   "vitamin c-100mg": "/images/img5.jpeg",
// };


const ProductCard = ({ product, attributes, hidePriceAndAdd = false, hideDiscount = false, hideWishlistCompare = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { items, addItem, updateItemQuantity, inCart, getItem } = useCart();
  const { state } = useContext(UserContext) || {};
  const isWholesaler = state?.userInfo?.role && state.userInfo.role.toString().toLowerCase() === "wholesaler";
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue, getNumberTwo } = useUtilsFunction();
  const router = useRouter();

  const storeColor = storeCustomizationSetting?.theme?.color || "teal";
  const currency = "₹";

  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError("Insufficient stock!");

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } = product;

    const wholesalePriceValue = product?.wholePrice && Number(product.wholePrice) > 0 ? Number(product.wholePrice) : null;
    const priceToUse = isWholesaler && wholesalePriceValue ? wholesalePriceValue : (p.prices?.price || 0);

    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p._id,
      variant: p.prices,
      price: priceToUse,
      originalPrice: product.prices?.originalPrice,
      image: product.image?.[0] || product.images?.[0],
    };

    const minQty = isWholesaler && product?.minQuantity ? Number(product.minQuantity) : 1;
    addItem(newItem, minQty);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;

    try {
      const result = addToWishlist(product);
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

  const handleAddToCompare = (e) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;

    try {
      const storedCompare = localStorage.getItem("compare");
      let compare = storedCompare ? JSON.parse(storedCompare) : [];
      const exists = compare.some((item) => item._id === product._id);

      if (exists) {
        notifyError("Product already in compare list");
        return;
      }
      if (compare.length >= 4) {
        notifyError("You can compare maximum 4 products");
        return;
      }

      compare.push(product);
      localStorage.setItem("compare", JSON.stringify(compare));
      notifySuccess("Product added to compare list");
    } catch (error) {
      console.error("Error adding to compare:", error);
      notifyError("Failed to add to compare list");
    }
  };
  const imageSrc =
    product?.image?.[0] || productImages[product?.slug] || "/images/default.webp";

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product}
          currency={currency}
          attributes={attributes}
        />
      )}
      <div className="group relative flex flex-col w-full max-w-[360px] xl:max-w-[370px] mx-auto h-[420px] sm:h-[480px] overflow-hidden bg-white rounded-3xl border border-slate-100 hover:border-store-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-500">

        {/* Product Image Container */}
        <div
          onClick={() => {
            router.push(`/product/${product.slug}`);
            handleLogEvent("product", `Mapped to ${showingTranslateValue(product?.title)} product page`);
          }}
          className="relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-white rounded-t-3xl p-3 sm:p-6 h-[180px] sm:h-[210px] overflow-hidden cursor-pointer"
        >
          {/* Discount Badge */}
          {!hideDiscount && !isWholesaler && (
            <Discount product={product} />
          )}

          {/* Stock Badge */}
          {product.stock < 1 && (
            <div className="absolute top-4 left-4 z-10">
              <Stock product={product} stock={product.stock} card />
            </div>
          )}

          {/* Wishlist and Compare - Top Right */}
          {!hideWishlistCompare && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex flex-col gap-2">
              <button
                onClick={handleAddToWishlist}
                className="p-2 sm:p-2.5 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-red-500 rounded-full shadow-sm hover:shadow border border-slate-100/50 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleAddToCompare}
                className="p-2 sm:p-2.5 bg-white/80 backdrop-blur-sm text-slate-600 hover:text-store-600 rounded-full shadow-sm hover:shadow border border-slate-100/50 hover:scale-110 active:scale-95 transition-all duration-300 hidden lg:flex"
                aria-label="Add to compare"
              >
                <FiShuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}

          {/* Zoom effect on hover */}
          <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            {product.image[0] ? (
              <ImageWithFallback
                src={imageSrc}
                alt={showingTranslateValue(product?.title)}
                width={300}
                height={300}
                className="max-w-full max-h-[150px] sm:max-h-[190px] object-contain w-auto h-auto drop-shadow-sm"
                style={{ width: "auto", height: "auto" }}
              />
            ) : (
              <Image
                src="/placeholder.png"
                width={300}
                height={300}
                style={{
                  objectFit: "contain",
                  maxHeight: "130px",
                  width: 'auto',
                  height: 'auto'
                }}
                sizes="100%"
                alt="product"
                className="max-w-full h-auto drop-shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Info Content Section */}
        <div className="flex flex-col flex-grow p-3 sm:p-5 text-left bg-white rounded-b-3xl">

          {/* Brand/Category Tag */}
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-store-600 mb-1.5">
            {product.brandName || "PHARMACY ESSENTIALS"}
          </div>

          {/* Product Title */}
          <h2
            className="text-base font-bold text-slate-800 line-clamp-1 mb-1 cursor-pointer hover:text-store-600 transition-colors"
            onClick={() => router.push(`/product/${product.slug}`)}
            title={showingTranslateValue(product?.title)}
          >
            {showingTranslateValue(product?.title)}
          </h2>

          {/* Description Subtitle Snippet */}
          <p className="text-xs text-gray-400 line-clamp-1 mb-2.5 leading-relaxed">
            {product?.description ? showingTranslateValue(product.description) : "Premium formula crafted to balance and clean effectively."}
          </p>

          {/* Star Rating Metrics Row */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <IoStar key={i} size={11} className="fill-current" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-400 mt-0.5 ml-1">
              {product?.rating || "4.8"}
            </span>
          </div>

          {/* Price Section */}
          {!hidePriceAndAdd && (
            <div className="flex flex-col items-start mb-4">
              {(() => {
                const basePrice = product?.isCombination ? product?.variants[0]?.price : product?.prices?.price;
                const wholesalePrice = product?.wholePrice && Number(product.wholePrice) > 0 ? Number(product.wholePrice) : null;
                const currentPrice = isWholesaler && wholesalePrice ? wholesalePrice : basePrice;
                const discount = product?.isCombination ? product?.variants[0]?.discount : product?.prices?.discount;
                let originalPriceValue = product?.isCombination ? product?.variants[0]?.originalPrice : product?.prices?.originalPrice;

                if (!originalPriceValue && discount) {
                  originalPriceValue = (basePrice || 0) + (discount || 0);
                }

                return (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-xl font-extrabold text-slate-900">
                      {currency}{getNumberTwo(Math.max(0, currentPrice))}
                    </p>
                    {!isWholesaler && originalPriceValue > currentPrice && (
                      <p className="text-sm text-gray-400 line-through font-medium">
                        {currency}{getNumberTwo(originalPriceValue)}
                      </p>
                    )}
                    {isWholesaler && wholesalePrice && (
                      <p className="text-xs text-gray-500 w-full mt-0.5">
                        Wholesale: <span className="font-semibold">{currency}{getNumberTwo(wholesalePrice)}</span>
                        {product.minQuantity ? ` (Min ${product.minQuantity})` : ""}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Action Button Section */}
          <div className="w-full mt-auto">
            {!hidePriceAndAdd && (
              <div className="flex justify-start w-full">
                {inCart(product._id) ? (
                  (() => {
                    const item = getItem(product._id);
                    return (
                      item && (
                        <div key={item.id} className="h-10 w-full flex items-center justify-between px-4 border border-slate-100 text-slate-700 bg-slate-50/50 rounded-xl font-bold transition">
                          <button
                            onClick={() => {
                              const minQty = isWholesaler && product?.minQuantity ? Number(product.minQuantity) : 1;
                              if (isWholesaler && product?.minQuantity && item.quantity <= minQty) {
                                notifyError(`Minimum quantity is ${minQty}`);
                                return;
                              }
                              updateItemQuantity(item.id, item.quantity - 1);
                            }}
                            disabled={isWholesaler && product?.minQuantity && item.quantity <= Number(product.minQuantity)}
                            className={`p-1.5 hover:text-store-600 transition-colors ${isWholesaler && product?.minQuantity && item.quantity <= Number(product.minQuantity) ? 'opacity-30 cursor-not-allowed' : ''}`}
                          >
                            <IoRemove className="w-4 h-4" />
                          </button>
                          <p className="text-xs px-2 font-bold text-slate-800">
                            {item.quantity}
                          </p>
                          <button
                            className="p-1.5 hover:text-store-600 transition-colors"
                            onClick={() =>
                              item?.variants?.length > 0
                                ? handleAddItem(item)
                                : handleIncreaseQuantity({ ...item, stock: product.stock })
                            }
                          >
                            <IoAdd className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    );
                  })()
                ) : (
                  <button
                    onClick={() => handleAddItem(product)}
                    aria-label="Add to cart"
                      className="w-full bg-[#3E3A30] text-[#FAF9F5] hover:bg-[#25221B] shadow-[0_4px_12px_rgba(62,58,48,0.15)] hover:shadow-[0_8px_20px_rgba(62,58,48,0.3)] h-11 px-5 flex items-center justify-center rounded-2xl font-black text-sm transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
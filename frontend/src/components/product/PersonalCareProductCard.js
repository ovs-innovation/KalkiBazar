import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useContext } from "react";
import { IoAdd, IoRemove, IoStar, IoCartOutline } from "react-icons/io5";
import { FiHeart, FiShuffle } from "react-icons/fi";
import { useCart } from "react-use-cart";
import { useRouter } from "next/router";

// Internal imports
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

const productImages = {
  "paracetamol-500mg": "/images/img1.jpeg",
  "Combiflame": "/images/img2.jpeg",
  "Cardicheck": "/images/img3.jpeg",
  "tafamidis": "/images/img4.webp",
  "vitamin c-100mg": "/images/img5.jpeg",
};

const PersonalCareProductCard = ({
  product,
  attributes,
  hidePriceAndAdd = false,
  hideDiscount = false,
  hideWishlistCompare = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { items, addItem, updateItemQuantity, inCart, getItem } = useCart();
  const { state } = useContext(UserContext) || {};
  const isWholesaler =
    state?.userInfo?.role &&
    state.userInfo.role.toString().toLowerCase() === "wholesaler";
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue, getNumberTwo } = useUtilsFunction();
  const router = useRouter();

  const currency = "₹";

  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError("Insufficient stock!");

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } = product;

    const wholesalePriceValue =
      product?.wholePrice && Number(product.wholePrice) > 0
        ? Number(product.wholePrice)
        : null;
    const priceToUse =
      isWholesaler && wholesalePriceValue ? wholesalePriceValue : (p.prices?.price || 0);

    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p._id,
      variant: p.prices,
      price: priceToUse,
      originalPrice: product.prices?.originalPrice,
      image: product.image?.[0] || product.images?.[0],
    };

    const minQty =
      isWholesaler && product?.minQuantity ? Number(product.minQuantity) : 1;
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
    product?.image?.[0] || "/placeholder.png";

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
      
      {/* Premium organic card design */}
      <div className="group relative flex flex-col w-full h-full max-w-[270px] xl:max-w-[280px] mx-auto select-none bg-transparent">
        
        {/* Product Image Container Box */}
        <div
          onClick={() => {
            router.push(`/product/${product.slug}`);
            handleLogEvent("product", `Mapped to ${showingTranslateValue(product?.title)} product page`);
          }}
          className="relative w-full h-[140px] sm:h-[160px] md:h-[175px] rounded-xl sm:rounded-2xl border border-[#EBE8DF]/60 shadow-[0_4px_16px_rgba(0,0,0,0.015)] cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_10px_25px_rgba(180,160,130,0.08)] hover:border-amber-300/40 group/img flex-shrink-0"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Natural Discount Badge */}
          {!hideDiscount && !isWholesaler && (() => {
            const basePrice = product?.isCombination ? product?.variants[0]?.price : product?.prices?.price;
            const discountVal = product?.isCombination ? product?.variants[0]?.discount : product?.prices?.discount;
            let originalPrice = product?.isCombination ? product?.variants[0]?.originalPrice : product?.prices?.originalPrice;
            if (!originalPrice && discountVal) {
              originalPrice = (basePrice || 0) + (discountVal || 0);
            }
            const discountPercentage = originalPrice > basePrice ? Math.round(((originalPrice - basePrice) / originalPrice) * 100) : 0;
            const finalDiscount = product?.discount || discountPercentage;

            return finalDiscount > 1 ? (
              <span className="absolute top-2.5 left-2.5 z-10 bg-[#B28E68] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap uppercase tracking-wider">
                -{finalDiscount}% OFF
              </span>
            ) : null;
          })()}

          {/* Stock Status Badge */}
          {product.stock < 1 && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Stock product={product} stock={product.stock} card />
            </div>
          )}

          {/* Wishlist and Compare */}
          {!hideWishlistCompare && (
            <div className="absolute top-2.5 right-2.5 z-30 flex flex-col gap-1.5 opacity-100 translate-x-0 transition-all duration-300 pointer-events-auto">
              <button
                onClick={handleAddToWishlist}
                className="product-action-btn wishlist-btn w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
                style={{
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
                }}
                aria-label="Add to wishlist"
                title="Add to Wishlist"
              >
                <FiHeart className="w-4 h-4" style={{ color: "#ffffff", stroke: "#ffffff", strokeWidth: 2.2 }} />
              </button>
              <button
                onClick={handleAddToCompare}
                className="product-action-btn compare-btn w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 hidden lg:flex"
                style={{
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
                }}
                aria-label="Add to compare"
                title="Compare Product"
              >
                <FiShuffle className="w-4 h-4" style={{ color: "#ffffff", stroke: "#ffffff", strokeWidth: 2.2 }} />
              </button>
            </div>
          )}

          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 transition-all duration-500 group-hover/img:scale-105 group-hover/img:-translate-y-0.5">
            {product.image[0] ? (
              <ImageWithFallback
                src={imageSrc}
                alt={showingTranslateValue(product?.title)}
                width={200}
                height={200}
                className="max-w-full max-h-full object-contain w-auto h-auto drop-shadow-md"
                style={{ width: "auto", height: "auto" }}
              />
            ) : (
              <Image
                src="/placeholder.png"
                width={200}
                height={200}
                style={{
                  objectFit: "contain",
                  maxHeight: "115px",
                  width: "auto",
                  height: "auto",
                }}
                sizes="100%"
                alt="product"
                className="max-w-full h-auto drop-shadow-md"
              />
            )}
          </div>
        </div>

        {/* Info Content Section */}
        <div className="flex flex-col pt-2.5 pb-1 text-left bg-transparent flex-grow">
          
          {/* Sophisticated natural tag */}
          <div className="text-[9px] sm:text-[10px] font-black tracking-widest text-amber-400 mb-0.5 uppercase truncate">
            {product.brandName || "PERSONAL CARE & WELLNESS"}
          </div>

          {/* Product Title Wrapper with Fixed Height for Vertical Alignment */}
          <div className="h-9 sm:h-10 flex items-center mb-1">
            <h2
              className="text-xs sm:text-[13px] md:text-sm font-semibold text-slate-100 line-clamp-2 leading-tight hover:text-amber-400 transition-colors cursor-pointer w-full"
              onClick={() => router.push(`/product/${product.slug}`)}
              title={showingTranslateValue(product?.title)}
            >
              {showingTranslateValue(product?.title)}
            </h2>
          </div>

          {/* Warm Amber Star Rating */}
          <div className="flex items-center gap-0.5 text-amber-400 mb-1 h-3.5">
            {[...Array(5)].map((_, i) => (
              <IoStar key={i} size={11} className="fill-current" />
            ))}
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 ml-1">
              {product?.rating || "4.9"}
            </span>
          </div>

          {/* Price Section with Fixed Height for Vertical Alignment */}
          {!hidePriceAndAdd && (
            <div className="h-7 sm:h-8 flex items-center mt-0.5">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                {(() => {
                  const basePrice = product?.isCombination ? product?.variants[0]?.price : product?.prices?.price;
                  const wholesalePrice = product?.wholePrice && Number(product.wholePrice) > 0 ? Number(product.wholePrice) : null;
                  const currentPrice = isWholesaler && wholesalePrice ? wholesalePrice : basePrice;
                  const discount = product?.isCombination ? product?.variants[0]?.discount : product?.prices?.discount;
                  let originalPriceValue = product?.isCombination ? product?.variants[0]?.originalPrice : product?.prices?.originalPrice;

                  if (!originalPriceValue && discount) {
                    originalPriceValue = (basePrice || 0) + (discount || 0);
                  }
                  const hasDiscount = !isWholesaler && originalPriceValue > currentPrice;

                  return (
                    <>
                      <p className={`text-sm sm:text-base font-extrabold ${hasDiscount ? 'text-rose-500' : 'text-slate-100'}`}>
                        {currency}{getNumberTwo(Math.max(0, currentPrice))}
                      </p>
                      {hasDiscount && (
                        <p className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                          {currency}{getNumberTwo(originalPriceValue)}
                        </p>
                      )}
                      {isWholesaler && wholesalePrice && (
                        <p className="text-[11px] text-slate-400 w-full mt-0.5">
                          Wholesale: <span className="font-semibold text-amber-400">{currency}{getNumberTwo(wholesalePrice)}</span>
                          {product.minQuantity ? ` (Min ${product.minQuantity})` : ""}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Action Button Section */}
          {!hidePriceAndAdd && (
            <div className="flex justify-start w-full mt-auto pt-1">
              {inCart(product._id) ? (
                (() => {
                  const item = getItem(product._id);
                  return (
                    item && (
                      <div key={item.id} className="h-7 sm:h-8 w-24 sm:w-28 flex items-center justify-between px-2 border border-slate-700 text-slate-200 bg-slate-900 rounded-full font-bold transition-all shadow-sm">
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
                          className={`p-0.5 hover:text-amber-400 transition-colors ${isWholesaler && product?.minQuantity && item.quantity <= Number(product.minQuantity) ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <IoRemove className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-xs font-bold text-white px-1">
                          {item.quantity}
                        </p>
                        <button
                          className="p-0.5 hover:text-amber-400 transition-colors"
                          onClick={() =>
                            item?.variants?.length > 0
                              ? handleAddItem(item)
                              : handleIncreaseQuantity({ ...item, stock: product.stock })
                          }
                        >
                          <IoAdd className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  );
                })()
              ) : (
                <button
                  onClick={() => handleAddItem(product)}
                  title="Add to cart"
                  className="flex items-center gap-1.5 sm:gap-2 group/btn cursor-pointer select-none"
                >
                  <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md group-hover/btn:bg-amber-400 group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-all duration-300">
                    <IoCartOutline className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 tracking-wide uppercase group-hover/btn:text-amber-400 transition-colors duration-300">
                    ADD TO CART
                  </span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(PersonalCareProductCard), {
  ssr: false,
});

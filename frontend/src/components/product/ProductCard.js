import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useContext } from "react";
import { IoAdd, IoRemove, IoStar, IoCartOutline } from "react-icons/io5";
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
      <div className="group relative flex flex-col w-full h-full max-w-[360px] xl:max-w-[370px] mx-auto select-none bg-transparent">
        
        {/* Product Image Container Box */}
        <div
          onClick={() => {
            router.push(`/product/${product.slug}`);
            handleLogEvent("product", `Mapped to ${showingTranslateValue(product?.title)} product page`);
          }}
          className="relative w-full h-[180px] sm:h-[220px] rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:border-slate-300/80 group/img flex-shrink-0"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Discount Badge */}
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
              <span className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap uppercase tracking-wider">
                -{finalDiscount}% OFF
              </span>
            ) : null;
          })()}

          {/* Stock Badge */}
          {product.stock < 1 && (
            <div className="absolute top-3 left-3 z-10">
              <Stock product={product} stock={product.stock} card />
            </div>
          )}

          {/* Wishlist and Compare - Top Right */}
          {!hideWishlistCompare && (
            <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover/img:opacity-100 group-hover/img:translate-x-0 transition-all duration-300">
              <button
                onClick={handleAddToWishlist}
                className="p-1.5 bg-white text-slate-600 hover:text-red-500 rounded-full shadow-sm hover:shadow border border-slate-100 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleAddToCompare}
                className="p-1.5 bg-white text-slate-600 hover:text-store-500 rounded-full shadow-sm hover:shadow border border-slate-100 hover:scale-110 active:scale-95 transition-all duration-300 hidden lg:flex"
                aria-label="Add to compare"
              >
                <FiShuffle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-500 group-hover/img:scale-108 group-hover/img:-translate-y-1">
            {product.image[0] ? (
              <ImageWithFallback
                src={imageSrc}
                alt={showingTranslateValue(product?.title)}
                width={250}
                height={250}
                className="max-w-full max-h-full object-contain w-auto h-auto drop-shadow-sm"
                style={{ width: "auto", height: "auto" }}
              />
            ) : (
              <Image
                src="/placeholder.png"
                width={250}
                height={250}
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
        <div className="flex flex-col pt-3 pb-2 text-left bg-transparent flex-grow">

          {/* Brand/Category Tag */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {product.brandName || "PHARMACY ESSENTIALS"}
          </div>

          {/* Product Title Wrapper with Fixed Height for Vertical Alignment */}
          <div className="h-11 flex items-center mb-1.5">
            <h2
              className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 leading-snug hover:text-store-500 transition-colors cursor-pointer w-full"
              onClick={() => router.push(`/product/${product.slug}`)}
              title={showingTranslateValue(product?.title)}
            >
              {showingTranslateValue(product?.title)}
            </h2>
          </div>

          {/* Star Rating Metrics Row with Fixed Height */}
          <div className="flex items-center gap-0.5 text-amber-400 mb-1.5 h-4">
            {[...Array(5)].map((_, i) => (
              <IoStar key={i} size={12} className="fill-current" />
            ))}
            <span className="text-[10px] font-bold text-gray-400 mt-0.5 ml-1">
              {product?.rating || "4.8"}
            </span>
          </div>

          {/* Price Section with Fixed Height for Vertical Alignment */}
          {!hidePriceAndAdd && (
            <div className="h-8 flex items-center mt-1">
              <div className="flex items-baseline gap-2 flex-wrap">
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
                      <p className={`text-base md:text-lg font-extrabold ${hasDiscount ? 'text-rose-600' : 'text-slate-900'}`}>
                        {currency}{getNumberTwo(Math.max(0, currentPrice))}
                      </p>
                      {hasDiscount && (
                        <p className="text-xs text-gray-400 line-through font-medium mt-0.5">
                          {currency}{getNumberTwo(originalPriceValue)}
                        </p>
                      )}
                      {isWholesaler && wholesalePrice && (
                        <p className="text-xs text-gray-500 w-full mt-0.5">
                          Wholesale: <span className="font-semibold">{currency}{getNumberTwo(wholesalePrice)}</span>
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
            <div className="flex justify-start w-full mt-auto">
              {inCart(product._id) ? (
                (() => {
                  const item = getItem(product._id);
                  return (
                    item && (
                      <div key={item.id} className="h-8 w-28 flex items-center justify-between px-2.5 border border-slate-200 text-slate-700 bg-white rounded-full font-bold transition-all shadow-sm mt-2">
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
                          className={`p-1 hover:text-store-500 transition-colors ${isWholesaler && product?.minQuantity && item.quantity <= Number(product.minQuantity) ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <IoRemove className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-xs font-bold text-slate-800 px-1">
                          {item.quantity}
                        </p>
                        <button
                          className="p-1 hover:text-store-500 transition-colors"
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
                  className="flex items-center gap-2 mt-2 group/btn cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-store-500 flex items-center justify-center text-white shadow-[0_2px_10px_rgba(var(--store-color-rgb,0,0,0),0.2)] group-hover/btn:bg-store-600 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300">
                    <IoCartOutline className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-slate-700 tracking-wider uppercase group-hover/btn:text-store-500 transition-colors duration-300">
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

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
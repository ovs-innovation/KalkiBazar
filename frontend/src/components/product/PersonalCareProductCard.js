import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useContext } from "react";
import { IoAdd, IoRemove, IoStar } from "react-icons/io5";
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
      
      {/* Premium organic card design */}
      <div className="group relative flex flex-col w-full max-w-[360px] xl:max-w-[370px] mx-auto h-[440px] sm:h-[490px] overflow-hidden bg-[#FAF9F5] hover:bg-white rounded-[2.25rem] border border-[#EBE8DF] hover:border-amber-300/40 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_45px_rgba(180,160,130,0.12)] transition-all duration-500">
        
        {/* Soft natural gradient backdrop for image */}
        <div
          onClick={() => {
            router.push(`/product/${product.slug}`);
            handleLogEvent("product", `Mapped to ${showingTranslateValue(product?.title)} product page`);
          }}
          className="relative flex items-center justify-center bg-gradient-to-b from-[#F2EFE9] to-[#FAF9F5] rounded-t-[2.25rem] p-4 sm:p-6 h-[190px] sm:h-[220px] overflow-hidden cursor-pointer"
        >
          {/* Natural Discount Badge */}
          {!hideDiscount && !isWholesaler && (
            <Discount product={product} />
          )}

          {/* Stock Status Badge */}
          {product.stock < 1 && (
            <div className="absolute top-4 left-4 z-10">
              <Stock product={product} stock={product.stock} card />
            </div>
          )}

          {/* Organic Glassmorphic Badges */}
          {!hideWishlistCompare && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex flex-col gap-2">
              <button
                onClick={handleAddToWishlist}
                className="p-2 sm:p-2.5 bg-white/70 hover:bg-rose-50 text-[#6C6753] hover:text-rose-600 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white/60 hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-md"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleAddToCompare}
                className="p-2 sm:p-2.5 bg-white/70 hover:bg-amber-50 text-[#6C6753] hover:text-amber-700 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white/60 hover:scale-110 active:scale-95 transition-all duration-300 hidden lg:flex backdrop-blur-md"
                aria-label="Add to compare"
              >
                <FiShuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}

          {/* Premium Floating Zoom Interaction */}
          <div className="relative w-full h-full flex items-center justify-center transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-1">
            {product.image[0] ? (
              <ImageWithFallback
                src={imageSrc}
                alt={showingTranslateValue(product?.title)}
                width={300}
                height={300}
                className="max-w-full max-h-[160px] sm:max-h-[195px] object-contain w-auto h-auto drop-shadow-md"
                style={{ width: "auto", height: "auto" }}
              />
            ) : (
              <Image
                src="/placeholder.png"
                width={300}
                height={300}
                style={{
                  objectFit: "contain",
                  maxHeight: "140px",
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

        {/* Detailed organic description block */}
        <div className="flex flex-col flex-grow p-4 sm:p-6 text-left rounded-b-[2.25rem] transition-colors duration-500">
          
          {/* Sophisticated natural tag */}
          <div className="text-[10px] font-black tracking-widest text-[#B28E68] mb-1.5 uppercase">
            {product.brandName || "PERSONAL CARE & WELLNESS"}
          </div>

          {/* Product Title */}
          <h2
            className="text-base font-bold text-[#3E3A30] line-clamp-1 mb-1 cursor-pointer hover:text-amber-800 transition-colors"
            onClick={() => router.push(`/product/${product.slug}`)}
            title={showingTranslateValue(product?.title)}
          >
            {showingTranslateValue(product?.title)}
          </h2>

          {/* Description Subtitle */}
          <p className="text-xs text-[#7A7463] line-clamp-1 mb-3 leading-relaxed">
            {product?.description
              ? showingTranslateValue(product.description)
              : "Nourishing formula crafted for natural care and balance."}
          </p>

          {/* Warm Amber Star Rating */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <IoStar key={i} size={11} className="fill-current" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#8C8673] mt-0.5 ml-1">
              {product?.rating || "4.9"}
            </span>
          </div>

          {/* Price Layout */}
          {!hidePriceAndAdd && (
            <div className="flex flex-col items-start mb-4">
              {(() => {
                const basePrice = product?.isCombination
                  ? product?.variants[0]?.price
                  : product?.prices?.price;
                const wholesalePrice =
                  product?.wholePrice && Number(product.wholePrice) > 0
                    ? Number(product.wholePrice)
                    : null;
                const currentPrice =
                  isWholesaler && wholesalePrice ? wholesalePrice : basePrice;
                const discount = product?.isCombination
                  ? product?.variants[0]?.discount
                  : product?.prices?.discount;
                let originalPriceValue = product?.isCombination
                  ? product?.variants[0]?.originalPrice
                  : product?.prices?.originalPrice;

                if (!originalPriceValue && discount) {
                  originalPriceValue = (basePrice || 0) + (discount || 0);
                }

                return (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-xl font-black text-[#2E2C25]">
                      {currency}
                      {getNumberTwo(Math.max(0, currentPrice))}
                    </p>
                    {!isWholesaler && originalPriceValue > currentPrice && (
                      <p className="text-sm text-[#A8A18C] line-through font-semibold">
                        {currency}
                        {getNumberTwo(originalPriceValue)}
                      </p>
                    )}
                    {isWholesaler && wholesalePrice && (
                      <p className="text-xs text-[#7A7463] w-full mt-0.5">
                        Wholesale:{" "}
                        <span className="font-bold">
                          {currency}
                          {getNumberTwo(wholesalePrice)}
                        </span>
                        {product.minQuantity ? ` (Min ${product.minQuantity})` : ""}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Sophisticated Wide Pill Add to Bag button */}
          <div className="w-full mt-auto">
            {!hidePriceAndAdd && (
              <div className="flex justify-start w-full">
                {inCart(product._id) ? (
                  (() => {
                    const item = getItem(product._id);
                    return (
                      item && (
                        <div
                          key={item.id}
                          className="h-11 w-full flex items-center justify-between px-5 border border-[#E0DCCA] text-[#3E3A30] bg-[#F5F2E6] rounded-2xl font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                        >
                          <button
                            onClick={() => {
                              const minQty =
                                isWholesaler && product?.minQuantity
                                  ? Number(product.minQuantity)
                                  : 1;
                              if (
                                isWholesaler &&
                                product?.minQuantity &&
                                item.quantity <= minQty
                              ) {
                                notifyError(`Minimum quantity is ${minQty}`);
                                return;
                              }
                              updateItemQuantity(item.id, item.quantity - 1);
                            }}
                            disabled={
                              isWholesaler &&
                              product?.minQuantity &&
                              item.quantity <= Number(product.minQuantity)
                            }
                            className={`p-1.5 hover:text-amber-800 transition-colors ${
                              isWholesaler &&
                              product?.minQuantity &&
                              item.quantity <= Number(product.minQuantity)
                                ? "opacity-30 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <IoRemove className="w-4 h-4" />
                          </button>
                          <p className="text-xs px-2 font-black text-[#2E2C25]">
                            {item.quantity}
                          </p>
                          <button
                            className="p-1.5 hover:text-amber-800 transition-colors"
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
                    aria-label="Add to bag"
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

export default dynamic(() => Promise.resolve(PersonalCareProductCard), {
  ssr: false,
});

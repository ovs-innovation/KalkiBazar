import useUtilsFunction from "@hooks/useUtilsFunction";

const Price = ({
  product,
  price,
  card,
  currency,
  originalPrice,
  discount,
  showTaxLabel,
  hideDiscountAndMRP = false,
}) => {
  // console.log("price", price, "originalPrice", originalPrice, "card", card);
  const { getNumberTwo } = useUtilsFunction();
  const taxRateValue = Number(product?.taxRate ?? 0);
  const shouldShowTax =
    typeof showTaxLabel === "boolean" ? showTaxLabel : !card;
  const hasTaxInfo =
    shouldShowTax && !Number.isNaN(taxRateValue) && taxRateValue >= 0;
  const taxBadgeText = hasTaxInfo
    ? `${product?.isPriceInclusive ? "Incl. GST" : "Excl. GST"} (${taxRateValue}%)`
    : "";

  // Get discount percentage from prop or product
  // Show discount as percentage, not as amount (without decimals)
  let discountPercentage = 0;
  
  if (discount && discount > 0) {
    // If discount is percentage (<= 100), use it directly
    // If discount > 100, it might be amount, convert to percentage
    if (discount <= 100) {
      discountPercentage = Math.round(discount);
    } else if (originalPrice > 0) {
      // It's an amount, convert to percentage and round
      discountPercentage = Math.round((discount / originalPrice) * 100);
    }
  } else if (product?.prices?.discount) {
    // Fallback to product discount if discount prop is not available
    const productDiscount = Number(product.prices.discount);
    if (productDiscount > 0 && productDiscount <= 100) {
      discountPercentage = Math.round(productDiscount);
    } else if (productDiscount > 100 && originalPrice > 0) {
      // It's an amount, convert to percentage and round
      discountPercentage = Math.round((productDiscount / originalPrice) * 100);
    }
  }

  // Use passed `price` prop if provided, otherwise fallback to product prices
  const effectivePrice = Math.max(0, typeof price === 'number' && !Number.isNaN(price) ? price : Number(product?.prices?.price || 0));

  return (
    <div className="product-price font-sans">
      {product?.isCombination ? (
        <div className="flex flex-wrap items-baseline gap-2">
          <span
            className={
              card
                ? "inline-block text-lg font-bold text-white"
                : "inline-block text-3xl sm:text-4xl font-black text-white tracking-tight"
            }
          >
            {currency}
            {getNumberTwo(Math.max(0, price))}
          </span>
          {(!hideDiscountAndMRP && originalPrice > price) ? (
            <>
              <del
                className={
                  card
                    ? "text-xs font-normal text-zinc-500"
                    : "text-base sm:text-lg font-normal text-zinc-500 ml-1.5"
                }
              >
                {currency}
                {getNumberTwo(originalPrice)}
              </del>
              <span
                className={
                  card
                    ? "text-yellow-400 text-xs font-black ml-1"
                    : "inline-block bg-yellow-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md ml-2 uppercase tracking-wider shadow-sm"
                }
              >
                {Math.round(discountPercentage)}% Off
              </span>
            </>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-wrap items-baseline gap-2">
          <span
            className={
              card
                ? "inline-block text-lg font-bold text-white"
                : "inline-block text-3xl sm:text-4xl font-black text-white tracking-tight"
            }
          >
            {currency}
            {getNumberTwo(effectivePrice)}
          </span>
          {(!hideDiscountAndMRP && originalPrice > effectivePrice) ? (
            <>
              <del
                className={
                  card
                    ? "text-xs font-normal text-zinc-500"
                    : "text-base sm:text-lg font-normal text-zinc-500 ml-1.5"
                }
              >
                {currency}
                {getNumberTwo(originalPrice)}
              </del>
              <span
                className={
                  card
                    ? "text-yellow-400 text-xs font-black ml-1"
                    : "inline-block bg-yellow-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md ml-2 uppercase tracking-wider shadow-sm"
                }
              >
                {Math.round(discountPercentage)}% Off
              </span>
            </>
          ) : null}
        </div>
      )}
      {hasTaxInfo && (
        <div className="text-[11px] sm:text-xs font-medium mt-1.5">
          {product?.isPriceInclusive ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
              ✓ Incl. of GST
            </span>
          ) : (
            <span className="text-zinc-400 inline-flex items-center gap-1.5">
              <span>+ GST Extra</span>
              <span className="inline-flex items-center rounded bg-zinc-800 border border-zinc-700/80 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">
                {taxRateValue}%
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Price;

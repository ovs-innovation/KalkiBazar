import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVariant,
  setSelectVa,
}) => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green"; 
  // Helper function to get variant details including hex color
  const getVariantDetails = (attributeId, variantId) => {
    const attribute = varTitle?.find(attr => attr._id === attributeId);
    if (!attribute) return null;
    
    const variant = attribute.variants?.find(v => v._id === variantId);
    return variant;
  };

  // Check if this is a color attribute
  const isColorAttribute = (attributeId) => {
    const attribute = varTitle?.find(attr => attr._id === attributeId);
    return attribute?.title?.en?.toLowerCase() === "color" || 
           attribute?.name?.en?.toLowerCase() === "color";
  };

  // Check if a given option (value for this attribute) is available
  // given current selection (other attributes) and variant stock.
  const isOptionAvailable = (attributeId, valueId) => {
    if (!Array.isArray(variants) || variants.length === 0) return false;

    // Normalize current selection: only keep real attribute ids
    const attributeIds = (varTitle || []).map((a) => a._id);
    const rawSelection = selectVariant || {};
    const selection = {};
    attributeIds.forEach((id) => {
      if (rawSelection && rawSelection[id]) {
        selection[id] = rawSelection[id];
      }
    });
    const attributeKeys = Object.keys(selection);

    return variants.some((variant) => {
      // Must match this attribute's value
      if (variant[attributeId] !== valueId) return false;
      // Must have stock
      if (Number(variant.quantity) <= 0) return false;

      // Other selected attributes must also match
      return attributeKeys.every((key) => {
        if (key === attributeId) return true;
        const selectedVal = selection[key];
        if (!selectedVal) return true;
        return variant[key] === selectedVal;
      });
    });
  };

  const handleChangeVariant = (v) => {
    // Set value to trigger useEffect
    setValue(v || att);
    
    // Merge with existing selection to maintain other attribute selections
    const updatedSelection = {
      ...selectVariant,
      [att]: v,
    };
    
    // Update both states to ensure variant finding works
    setSelectVariant(updatedSelection);
    setSelectVa(updatedSelection);
  };
  // console.log("option", );

  return (
    <>
      {option === "Dropdown" ? (
        <select
          onChange={(e) => handleChangeVariant(e.target.value)}
          className={`focus:shadow-none w-3/4 px-2 py-1 form-select outline-none h-10 max-w-28 text-sm focus:outline-none block rounded-md bg-store-100 border-transparent focus:bg-white border-store-300 focus:border-store-400 focus:ring-0`}
          name="parent"
        >
          {[
            ...new Map(
              variants.map((v) => [v[att], v].filter(Boolean))
            ).values(),
          ]
            .filter(Boolean)
            .map(
              (vl, i) =>
                Object?.values(selectVariant).includes(vl[att]) &&
                varTitle.map((vr) =>
                  vr?.variants?.map(
                    (el) =>
                      vr?._id === att &&
                      el?._id === vl[att] && (
                        <option
                          key={i + 1}
                          value={selectVariant[att]}
                          defaultValue={selectVariant[att]}
                          hidden
                        >
                          {showingTranslateValue(el.name)}
                        </option>
                      )
                    // console.log('el', el._id === v[att] && el.name)
                  )
                )
            )}

          {[
            ...new Map(
              variants.map((v) => [v[att], v].filter(Boolean))
            ).values(),
          ]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <option
                        key={el._id}
                        value={vl[att]}
                        defaultValue
                        disabled={!isOptionAvailable(att, vl[att])}
                      >
                        {showingTranslateValue(el.name)}
                        {!isOptionAvailable(att, vl[att]) ? " (Out of stock)" : ""}
                      </option>
                    )
                )
              )
            )}
        </select>
      ) : (
        <div className="flex flex-wrap gap-2">
          {[
            ...new Map(
              variants?.map((v) => [v[att], v].filter(Boolean))
            ).values(),
          ]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle
                .map((vr) =>
                  vr?.variants?.map(
                    (el) =>
                      vr?._id === att &&
                      el?._id === vl[att] && {
                        el,
                        isSelected: Object?.values(selectVariant).includes(
                          vl[att]
                        ),
                        isDisabled: !isOptionAvailable(att, vl[att]),
                      }
                  )
                )
                .flat()
                .filter(Boolean)
                .map(({ el, isSelected, isDisabled }, idx) => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isDisabled) return;
                      handleChangeVariant(vl[att]);
                    }}
                    key={`${i}-${idx}-${el._id}`}
                    className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded border-2 transition-all duration-200 ${
                      isDisabled
                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-store-50 border-store-500 text-store-800 shadow-sm"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    type="button"
                    disabled={isDisabled}
                  >
                    {/* Color circle for color attributes */}
                    {isColorAttribute(att) && el.hexColor && (
                      <div
                        className={`w-4 h-4 rounded-full mr-2 shadow-sm border ${
                          isSelected ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: el.hexColor }}
                      />
                    )}
                    <span>{showingTranslateValue(el.name)}</span>

                    {/* Selected checkmark (Flipkart style) */}
                    {isSelected && (
                      <svg
                        className="ml-2 w-4 h-4 text-store-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))
            )}
        </div>
      )}
    </>
  );
};

export default VariantList;


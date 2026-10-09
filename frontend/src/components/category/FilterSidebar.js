import React, { useEffect, useState } from "react";
import { IoClose, IoStar } from "react-icons/io5";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CategoryServices from "@services/CategoryServices";
import BrandServices from "@services/BrandServices";
import useUtilsFunction from "@hooks/useUtilsFunction";

const FilterSidebar = ({
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedRating,
  setSelectedRating,
  selectedDiscount,
  setSelectedDiscount,
  onClearAll,
}) => {
  const { showingTranslateValue, currency } = useUtilsFunction();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [openSections, setOpenSections] = useState({
    brand: false,
    rating: false,
    discount: false,
    category: true,
  });

  const getLevel1Categories = (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) return [];
    const homeRoot = categories.find(cat => 
      cat.id === "Root" || 
      showingTranslateValue(cat?.name)?.toLowerCase() === "home"
    );
    if (homeRoot && homeRoot.children && homeRoot.children.length > 0) {
      return homeRoot.children;
    }
    return categories;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, brandData] = await Promise.all([
          CategoryServices.getShowingCategory(),
          BrandServices.getShowingBrands(),
        ]);
        const mainCategories = getLevel1Categories(catData || []);
        setCategories(mainCategories);
        setBrands(brandData || []);
      } catch (err) {
        console.error("Error fetching filter data", err);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands(brandId);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategories(catId);
  };

  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
  };

  const ratings = [4, 3, 2, 1];
  const discounts = [50, 40, 30, 20, 10];

  const hasActiveFilters = (
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    selectedRating > 0 ||
    selectedDiscount > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 100000
  );

  return (
    <div
      className="search-filter-sidebar border border-zinc-850 rounded-2xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: "#000000", borderColor: "#27272a" }}
    >
      {/* Header Section */}
      <div
        className="p-4 sm:p-5 border-b border-zinc-800 flex justify-between items-center"
        style={{ backgroundColor: "#000000", borderBottomColor: "#27272a" }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white tracking-wide">Filters</h2>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </div>
        <button
          onClick={onClearAll}
          className="text-yellow-400 text-xs font-bold tracking-wider uppercase hover:text-yellow-300 transition-colors focus:outline-none"
        >
          Clear All
        </button>
      </div>

      {/* Active Filters Section */}
      {hasActiveFilters && (
        <div
          className="p-3.5 flex flex-wrap gap-1.5 border-b"
          style={{ backgroundColor: "#050505", borderBottomColor: "#27272a" }}
        >
          {selectedBrands.map((brandId) => {
            const brand = brands.find((b) => b._id === brandId);
            if (!brand) return null;
            return (
              <span
                key={brandId}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-full group hover:border-yellow-400/60 transition-all"
              >
                {showingTranslateValue(brand.name)}
                <button
                  onClick={() => handleBrandChange(brandId)}
                  className="p-0.5 rounded-full text-zinc-400 group-hover:text-yellow-400 hover:bg-zinc-800 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
          {(() => {
            const tags = [];
            const consumed = new Set();

            for (const parentCat of categories) {
              if (parentCat.children && parentCat.children.length > 0) {
                const childIds = parentCat.children.map((c) => c._id);
                const allSelected = childIds.every((id) => selectedCategories.includes(id));
                if (allSelected) {
                  tags.push({ id: parentCat._id, name: parentCat.name, isParent: true });
                  childIds.forEach((id) => consumed.add(id));
                  consumed.add(parentCat._id);
                }
              }
            }

            for (const catId of selectedCategories) {
              if (consumed.has(catId)) continue;
              let cat = categories.find((c) => c._id === catId);
              if (!cat) {
                for (const parentCat of categories) {
                  if (parentCat.children) {
                    const child = parentCat.children.find((c) => c._id === catId);
                    if (child) {
                      cat = child;
                      break;
                    }
                  }
                }
              }
              if (cat) tags.push({ id: catId, name: cat.name, isParent: false });
            }

            return tags.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-full group hover:border-yellow-400/60 transition-all"
              >
                {showingTranslateValue(t.name)}
                <button
                  onClick={() => {
                    if (t.isParent) {
                      const parent = categories.find((c) => c._id === t.id);
                      const childIds = parent?.children?.map((c) => c._id) || [t.id];
                      handleCategoryChange(childIds);
                    } else {
                      handleCategoryChange(t.id);
                    }
                  }}
                  className="p-0.5 rounded-full text-zinc-400 group-hover:text-yellow-400 hover:bg-zinc-800 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            ));
          })()}

          {priceRange.min > 0 && (
            <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-full group hover:border-yellow-400/60 transition-all">
              Min: {priceRange.min}
              <button
                onClick={() => setPriceRange((prev) => ({ ...prev, min: 0 }))}
                className="p-0.5 rounded-full text-zinc-400 group-hover:text-yellow-400 hover:bg-zinc-800 transition-colors"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {priceRange.max < 100000 && (
            <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-full group hover:border-yellow-400/60 transition-all">
              Max: {priceRange.max}
              <button
                onClick={() => setPriceRange((prev) => ({ ...prev, max: 100000 }))}
                className="p-0.5 rounded-full text-zinc-400 group-hover:text-yellow-400 hover:bg-zinc-800 transition-colors"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedRating > 0 && (
            <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-full group hover:border-yellow-400/60 transition-all">
              {selectedRating}★ & above
              <button
                onClick={() => setSelectedRating(0)}
                className="p-0.5 rounded-full text-zinc-400 group-hover:text-yellow-400 hover:bg-zinc-800 transition-colors"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedDiscount > 0 && (
            <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-full group hover:border-yellow-400/60 transition-all">
              {selectedDiscount}%+ Off
              <button
                onClick={() => setSelectedDiscount(0)}
                className="p-0.5 rounded-full text-zinc-400 group-hover:text-yellow-400 hover:bg-zinc-800 transition-colors"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Categories Section */}
      <div className="border-b" style={{ borderBottomColor: "#27272a" }}>
        <button
          onClick={() => toggleSection("category")}
          className="w-full p-4 flex justify-between items-center text-sm font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors group"
        >
          <span>Categories</span>
          <span className="text-zinc-400 p-1 rounded-lg bg-zinc-900 group-hover:text-yellow-400 transition-colors">
            {openSections.category ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.category && (
          <div className="px-3.5 pb-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 space-y-1">
            {categories.map((cat) => {
              const hasChildren = cat?.children && cat.children.length > 0;
              const isExpanded = expandedCategories[cat._id];
              const isChecked =
                selectedCategories.includes(cat._id) ||
                (hasChildren && cat.children.every((c) => selectedCategories.includes(c._id)));

              return (
                <div key={cat._id} className="mb-1 last:mb-0">
                  {/* Parent Category Row */}
                  <div
                    onClick={() => {
                      const ids = (cat.children && cat.children.length > 0) ? [cat._id, ...cat.children.map(c => c._id)] : [cat._id];
                      handleCategoryChange(ids);
                    }}
                    className={`filter-item-row flex items-center justify-between p-2 rounded-xl transition-all duration-150 group cursor-pointer border border-transparent ${
                      isChecked
                        ? "bg-zinc-900 border-zinc-800 text-yellow-400"
                        : "hover:bg-zinc-900 text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center flex-1 min-w-0 pointer-events-none">
                      <input
                        type="checkbox"
                        id={`cat-${cat._id}`}
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-yellow-400 accent-yellow-400 focus:ring-yellow-400/20 cursor-pointer pointer-events-auto"
                      />
                      <label
                        htmlFor={`cat-${cat._id}`}
                        className={`ml-3 text-sm font-medium cursor-pointer flex-1 truncate select-none transition-colors ${
                          isChecked ? "text-yellow-400 font-semibold" : "text-zinc-300 group-hover:text-yellow-400"
                        }`}
                      >
                        {showingTranslateValue(cat.name)}
                      </label>
                    </div>
                    {hasChildren && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(cat._id);
                        }}
                        className="ml-2 p-1.5 rounded-lg text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 transition-all"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Subcategories Container */}
                  {hasChildren && isExpanded && (
                    <div className="ml-5 mt-1 border-l border-zinc-800 pl-3.5 space-y-1 py-1">
                      {cat.children.map((subCat) => {
                        const isSubChecked = selectedCategories.includes(subCat._id);
                        return (
                          <div
                            key={subCat._id}
                            onClick={() => handleCategoryChange(subCat._id)}
                            className={`filter-item-row flex items-center p-1.5 rounded-lg transition-colors group/sub cursor-pointer ${
                              isSubChecked
                                ? "bg-zinc-900 text-yellow-400 font-medium"
                                : "hover:bg-zinc-900 text-zinc-400"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={`subcat-${subCat._id}`}
                              checked={isSubChecked}
                              onChange={() => {}}
                              className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-yellow-400 accent-yellow-400 cursor-pointer pointer-events-none"
                            />
                            <label
                              htmlFor={`subcat-${subCat._id}`}
                              className={`ml-2.5 text-xs sm:text-sm cursor-pointer select-none transition-colors ${
                                isSubChecked ? "text-yellow-400 font-semibold" : "text-zinc-400 group-hover/sub:text-yellow-400"
                              }`}
                            >
                              {showingTranslateValue(subCat.name)}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="border-b p-4" style={{ borderBottomColor: "#27272a" }}>
        <h3 className="text-sm font-bold text-zinc-200 mb-4">Price</h3>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <select
              value={priceRange.min}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-full text-xs sm:text-sm bg-black border border-zinc-800 rounded-xl py-2 px-3 pr-7 focus:outline-none focus:border-yellow-400 transition-all appearance-none cursor-pointer text-zinc-200 font-semibold shadow-inner"
            >
              <option className="bg-black text-zinc-100" value="0">0 {currency}</option>
              <option className="bg-black text-zinc-100" value="500">500 {currency}</option>
              <option className="bg-black text-zinc-100" value="1000">1000 {currency}</option>
              <option className="bg-black text-zinc-100" value="5000">5000 {currency}</option>
              <option className="bg-black text-zinc-100" value="10000">10000 {currency}</option>
              <option className="bg-black text-zinc-100" value="50000">50000 {currency}</option>
            </select>
          </div>
          <span className="text-zinc-500 text-xs font-bold px-1 uppercase tracking-wider">to</span>
          <div className="relative w-full">
            <select
              value={priceRange.max}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-full text-xs sm:text-sm bg-black border border-zinc-800 rounded-xl py-2 px-3 pr-7 focus:outline-none focus:border-yellow-400 transition-all appearance-none cursor-pointer text-zinc-200 font-semibold shadow-inner"
            >
              <option className="bg-black text-zinc-100" value={priceRange.max}>
                {priceRange.max >= 100000 ? "Max" : `${priceRange.max} ${currency}`}
              </option>
              <option className="bg-black text-zinc-100" value="1000">1000 {currency}</option>
              <option className="bg-black text-zinc-100" value="5000">5000 {currency}</option>
              <option className="bg-black text-zinc-100" value="10000">10000 {currency}</option>
              <option className="bg-black text-zinc-100" value="50000">50000 {currency}</option>
              <option className="bg-black text-zinc-100" value="100000">100000 {currency}</option>
            </select>
          </div>
        </div>
        <div className="px-1 mt-5">
          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={priceRange.max}
            onChange={(e) => handlePriceChange(e, "max")}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-400 bg-zinc-800"
            style={{
              background: `linear-gradient(to right, #facc15 0%, #facc15 ${(priceRange.max / 100000) * 100}%, #27272a ${(priceRange.max / 100000) * 100}%, #27272a 100%)`,
            }}
          />
        </div>
      </div>

      {/* Brand Section */}
      <div className="border-b" style={{ borderBottomColor: "#27272a" }}>
        <button
          onClick={() => toggleSection("brand")}
          className="w-full p-4 flex justify-between items-center text-sm font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors group"
        >
          <span>Brand</span>
          <span className="text-zinc-400 p-1 rounded-lg bg-zinc-900 group-hover:text-yellow-400 transition-colors">
            {openSections.brand ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.brand && (
          <div className="px-3.5 pb-4 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 space-y-1">
            {brands.map((brand) => {
              const isBrandChecked = selectedBrands.includes(brand._id);
              return (
                <div
                  key={brand._id}
                  onClick={() => handleBrandChange(brand._id)}
                  className={`filter-item-row flex items-center p-2 rounded-xl transition-all duration-150 group cursor-pointer border border-transparent ${
                    isBrandChecked
                      ? "bg-zinc-900 border-zinc-800 text-yellow-400"
                      : "hover:bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`brand-${brand._id}`}
                    checked={isBrandChecked}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-yellow-400 accent-yellow-400 cursor-pointer pointer-events-none"
                  />
                  <label
                    htmlFor={`brand-${brand._id}`}
                    className={`ml-3 text-sm font-medium cursor-pointer select-none flex-1 transition-colors ${
                      isBrandChecked ? "text-yellow-400 font-semibold" : "text-zinc-300 group-hover:text-yellow-400"
                    }`}
                  >
                    {showingTranslateValue(brand.name)}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Ratings Section */}
      <div className="border-b" style={{ borderBottomColor: "#27272a" }}>
        <button
          onClick={() => toggleSection("rating")}
          className="w-full p-4 flex justify-between items-center text-sm font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors group"
        >
          <span>Customer Ratings</span>
          <span className="text-zinc-400 p-1 rounded-lg bg-zinc-900 group-hover:text-yellow-400 transition-colors">
            {openSections.rating ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.rating && (
          <div className="px-3.5 pb-4 space-y-1">
            {ratings.map((rating) => {
              const isRatingChecked = selectedRating === rating;
              return (
                <div
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`filter-item-row flex items-center p-2 rounded-xl transition-all duration-150 cursor-pointer group border border-transparent ${
                    isRatingChecked
                      ? "bg-zinc-900 border-zinc-800 text-yellow-400"
                      : "hover:bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={isRatingChecked}
                    onChange={() => setSelectedRating(rating)}
                    className="h-4 w-4 border-zinc-700 bg-zinc-900 text-yellow-400 accent-yellow-400 cursor-pointer pointer-events-none"
                  />
                  <div className={`ml-3 flex items-center text-sm font-medium select-none transition-colors ${
                    isRatingChecked ? "text-yellow-400 font-semibold" : "text-zinc-300 group-hover:text-yellow-400"
                  }`}>
                    {rating} <IoStar className="text-amber-400 w-4 h-4 ml-1 mr-1.5" /> & above
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Discount Section */}
      <div className="last:border-none">
        <button
          onClick={() => toggleSection("discount")}
          className="w-full p-4 flex justify-between items-center text-sm font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors group"
        >
          <span>Discount</span>
          <span className="text-zinc-400 p-1 rounded-lg bg-zinc-900 group-hover:text-yellow-400 transition-colors">
            {openSections.discount ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.discount && (
          <div className="px-3.5 pb-4 space-y-1">
            {discounts.map((discount) => {
              const isDiscountChecked = selectedDiscount === discount;
              return (
                <div
                  key={discount}
                  onClick={() => setSelectedDiscount(discount)}
                  className={`filter-item-row flex items-center p-2 rounded-xl transition-all duration-150 cursor-pointer group border border-transparent ${
                    isDiscountChecked
                      ? "bg-zinc-900 border-zinc-800 text-yellow-400"
                      : "hover:bg-zinc-900 text-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="discount"
                    checked={isDiscountChecked}
                    onChange={() => setSelectedDiscount(discount)}
                    className="h-4 w-4 border-zinc-700 bg-zinc-900 text-yellow-400 accent-yellow-400 cursor-pointer pointer-events-none"
                  />
                  <label className={`ml-3 text-sm font-medium cursor-pointer select-none flex-1 transition-colors ${
                    isDiscountChecked ? "text-yellow-400 font-semibold" : "text-zinc-300 group-hover:text-yellow-400"
                  }`}>
                    {discount}% or more
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;

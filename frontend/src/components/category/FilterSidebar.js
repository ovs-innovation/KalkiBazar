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
    // setSelectedBrands is now a wrapper function from parent that handles clearing search query
    // It expects the brandId and handles the toggle logic internally
    setSelectedBrands(brandId);
  };

  const handleCategoryChange = (catId) => {
    // setSelectedCategories is now a wrapper function from parent that handles clearing search query
    // It expects the catId and handles the toggle logic internally
    setSelectedCategories(catId);
  };

  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    // setPriceRange is now a wrapper function from parent that handles clearing search query
    // It expects the full priceRange object
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
  };

  const ratings = [4, 3, 2, 1];
  const discounts = [50, 40, 30, 20, 10];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">Filters</h2>
          {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedRating > 0 || selectedDiscount > 0 || priceRange.min > 0 || priceRange.max < 100000) && (
            <span className="h-2 w-2 rounded-full bg-store-600 animate-pulse" />
          )}
        </div>
        <button
          onClick={onClearAll}
          className="text-store-600 text-xs font-semibold tracking-wider uppercase hover:text-store-700 transition-colors focus:outline-none focus:underline"
        >
          Clear All
        </button>
      </div>

      {/* Active Filters Section */}
      {(selectedBrands.length > 0 ||
        selectedCategories.length > 0 ||
        selectedRating > 0 ||
        selectedDiscount > 0 ||
        priceRange.min > 0 ||
        priceRange.max < 100000) && (
          <div className="p-4 flex flex-wrap gap-1.5 border-b border-gray-50 bg-white">
            {selectedBrands.map((brandId) => {
              const brand = brands.find((b) => b._id === brandId);
              if (!brand) return null;
              return (
                <span
                  key={brandId}
                  className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-50 border border-gray-200/60 text-xs font-medium text-gray-700 rounded-full group hover:border-gray-300 transition-all"
                >
                  {showingTranslateValue(brand.name)}
                  <button
                    onClick={() => handleBrandChange(brandId)}
                    className="p-0.5 rounded-full text-gray-400 group-hover:text-red-500 hover:bg-red-50 transition-colors"
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
                  className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-50 border border-gray-200/60 text-xs font-medium text-gray-700 rounded-full group hover:border-gray-300 transition-all"
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
                    className="p-0.5 rounded-full text-gray-400 group-hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <IoClose className="w-3.5 h-3.5" />
                  </button>
                </span>
              ));
            })()}

            {priceRange.min > 0 && (
              <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-50 border border-gray-200/60 text-xs font-medium text-gray-700 rounded-full group hover:border-gray-300 transition-all">
                Min: {priceRange.min}
                <button
                  onClick={() => setPriceRange((prev) => ({ ...prev, min: 0 }))}
                  className="p-0.5 rounded-full text-gray-400 group-hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {priceRange.max < 100000 && (
              <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-50 border border-gray-200/60 text-xs font-medium text-gray-700 rounded-full group hover:border-gray-300 transition-all">
                Max: {priceRange.max}
                <button
                  onClick={() => setPriceRange((prev) => ({ ...prev, max: 100000 }))}
                  className="p-0.5 rounded-full text-gray-400 group-hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedRating > 0 && (
              <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-50 border border-gray-200/60 text-xs font-medium text-gray-700 rounded-full group hover:border-gray-300 transition-all">
                {selectedRating}★ & above
                <button
                  onClick={() => setSelectedRating(0)}
                  className="p-0.5 rounded-full text-gray-400 group-hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedDiscount > 0 && (
              <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-50 border border-gray-200/60 text-xs font-medium text-gray-700 rounded-full group hover:border-gray-300 transition-all">
                {selectedDiscount}%+ Off
                <button
                  onClick={() => setSelectedDiscount(0)}
                  className="p-0.5 rounded-full text-gray-400 group-hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <IoClose className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}

      {/* Categories Section */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection("category")}
          className="w-full p-4 flex justify-between items-center text-sm font-semibold text-gray-800 hover:bg-gray-50/70 transition-colors"
        >
          <span>Categories</span>
          <span className="text-gray-400 p-1 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
            {openSections.category ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.category && (
          <div className="px-4 pb-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {categories.map((cat) => {
              const hasChildren = cat?.children && cat.children.length > 0;
              const isExpanded = expandedCategories[cat._id];

              return (
                <div key={cat._id} className="mb-2.5 last:mb-0">
                  {/* Parent Category Row */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center flex-1 min-w-0">
                      <input
                        type="checkbox"
                        id={`cat-${cat._id}`}
                        checked={
                          selectedCategories.includes(cat._id) ||
                          (cat.children && cat.children.length > 0 && cat.children.every((c) => selectedCategories.includes(c._id)))
                        }
                        onChange={() => {
                          const ids = (cat.children && cat.children.length > 0) ? [cat._id, ...cat.children.map(c => c._id)] : [cat._id];
                          handleCategoryChange(ids);
                        }}
                        className="h-4 w-4 rounded-md border-gray-300 text-store-600 focus:ring-store-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
                      />
                      <label
                        htmlFor={`cat-${cat._id}`}
                        className="ml-3 text-sm font-medium text-gray-700 cursor-pointer flex-1 truncate select-none group-hover:text-gray-900"
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
                        className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-store-600 hover:bg-store-50/50 transition-all"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Subcategories Container */}
                  {hasChildren && isExpanded && (
                    <div className="ml-5 mt-1 border-l border-gray-200/80 pl-4 space-y-2 py-1">
                      {cat.children.map((subCat) => (
                        <div key={subCat._id} className="flex items-center p-1 rounded-lg hover:bg-gray-50/50 transition-colors group/sub">
                          <input
                            type="checkbox"
                            id={`subcat-${subCat._id}`}
                            checked={selectedCategories.includes(subCat._id)}
                            onChange={() => handleCategoryChange(subCat._id)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-store-600 focus:ring-store-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
                          />
                          <label
                            htmlFor={`subcat-${subCat._id}`}
                            className="ml-2.5 text-sm text-gray-600 cursor-pointer select-none group-hover/sub:text-gray-900"
                          >
                            {showingTranslateValue(subCat.name)}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="border-b border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Price</h3>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <select
              value={priceRange.min}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-xl py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-store-500/20 focus:border-store-500 transition-all appearance-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="0">0 {currency}</option>
              <option value="500">500 {currency}</option>
              <option value="1000">1000 {currency}</option>
              <option value="5000">5000 {currency}</option>
              <option value="10000">10000 {currency}</option>
              <option value="50000">50000 {currency}</option>
            </select>
          </div>
          <span className="text-gray-400 text-xs font-medium px-1">to</span>
          <div className="relative w-full">
            <select
              value={priceRange.max}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-xl py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-store-500/20 focus:border-store-500 transition-all appearance-none cursor-pointer text-gray-700 font-medium"
            >
              <option value={priceRange.max}>
                {priceRange.max >= 100000 ? "Max" : `${priceRange.max} ${currency}`}
              </option>
              <option value="1000">1000 {currency}</option>
              <option value="5000">5000 {currency}</option>
              <option value="10000">10000 {currency}</option>
              <option value="50000">50000 {currency}</option>
              <option value="100000">100000 {currency}</option>
            </select>
          </div>
        </div>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="100000"
            step="500"
            value={priceRange.max}
            onChange={(e) => handlePriceChange(e, "max")}
            className="w-full mt-5 h-1.5 rounded-lg appearance-none cursor-pointer accent-store-600 bg-gray-100"
            style={{
              background: `linear-gradient(to right, var(--store-color-600, #4f46e5) 0%, var(--store-color-600, #4f46e5) ${(priceRange.max / 100000) * 100
                }%, #f3f4f6 ${(priceRange.max / 100000) * 100}%, #f3f4f6 100%)`,
            }}
          />
        </div>
      </div>

      {/* Brand Section */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection("brand")}
          className="w-full p-4 flex justify-between items-center text-sm font-semibold text-gray-800 hover:bg-gray-50/70 transition-colors"
        >
          <span>Brand</span>
          <span className="text-gray-400 p-1 rounded-lg bg-gray-50">
            {openSections.brand ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.brand && (
          <div className="px-4 pb-4 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {brands.map((brand) => (
              <div key={brand._id} className="flex items-center p-1.5 rounded-xl hover:bg-gray-50 transition-colors group">
                <input
                  type="checkbox"
                  id={`brand-${brand._id}`}
                  checked={selectedBrands.includes(brand._id)}
                  onChange={() => handleBrandChange(brand._id)}
                  className="h-4 w-4 rounded-md border-gray-300 text-store-600 focus:ring-store-500/20 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor={`brand-${brand._id}`}
                  className="ml-3 text-sm font-medium text-gray-600 cursor-pointer select-none group-hover:text-gray-900 flex-1"
                >
                  {showingTranslateValue(brand.name)}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Ratings Section */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full p-4 flex justify-between items-center text-sm font-semibold text-gray-800 hover:bg-gray-50/70 transition-colors"
        >
          <span>Customer Ratings</span>
          <span className="text-gray-400 p-1 rounded-lg bg-gray-50">
            {openSections.rating ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.rating && (
          <div className="px-4 pb-4 space-y-1">
            {ratings.map((rating) => (
              <div
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                  className="h-4 w-4 border-gray-300 text-store-600 focus:ring-store-500/20 focus:ring-offset-0 cursor-pointer"
                />
                <div className="ml-3 flex items-center text-sm font-medium text-gray-600 group-hover:text-gray-900 select-none">
                  {rating} <IoStar className="text-amber-400 w-4 h-4 ml-1 mr-1.5" /> & above
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discount Section */}
      <div className="last:border-none">
        <button
          onClick={() => toggleSection("discount")}
          className="w-full p-4 flex justify-between items-center text-sm font-semibold text-gray-800 hover:bg-gray-50/70 transition-colors"
        >
          <span>Discount</span>
          <span className="text-gray-400 p-1 rounded-lg bg-gray-50">
            {openSections.discount ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </span>
        </button>
        {openSections.discount && (
          <div className="px-4 pb-4 space-y-1">
            {discounts.map((discount) => (
              <div
                key={discount}
                onClick={() => setSelectedDiscount(discount)}
                className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <input
                  type="radio"
                  name="discount"
                  checked={selectedDiscount === discount}
                  onChange={() => setSelectedDiscount(discount)}
                  className="h-4 w-4 border-gray-300 text-store-600 focus:ring-store-500/20 focus:ring-offset-0 cursor-pointer"
                />
                <label className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer select-none flex-1">
                  {discount}% or more
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;

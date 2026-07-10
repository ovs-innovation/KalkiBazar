import { useState, useEffect } from "react";
import { Select } from "@windmill/react-ui";

// internal import
import useAsync from "@/hooks/useAsync";
import CategoryServices from "@/services/CategoryServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const ParentCategory = ({
  selectedCategory,
  setSelectedCategory,
  setDefaultCategory,
  defaultCategory,
}) => {
  const { data, loading } = useAsync(CategoryServices?.getAllCategory);
  const { showingTranslateValue } = useUtilsFunction();

  // Local state: which parent category is picked in the first dropdown
  const [selectedParentId, setSelectedParentId] = useState("");
  // Local state: which sub-category is picked in the second dropdown
  const [selectedSubId, setSelectedSubId] = useState("");

  // Top-level (parent) categories — those with no parent or at root level
  const parentCategories = Array.isArray(data) ? data : [];

  // Sub-categories of the chosen parent
  const subCategories = parentCategories.find(
    (c) => c._id === selectedParentId
  )?.children || [];

  // Helper: find a category object by id (recursive)
  const findObject = (categories, targetId) => {
    if (!categories || !Array.isArray(categories)) return undefined;
    for (const cat of categories) {
      if (cat._id === targetId) return cat;
      if (cat.children?.length > 0) {
        const found = findObject(cat.children, targetId);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Sync dropdown values with edit/default category on load
  useEffect(() => {
    if (!loading && Array.isArray(data) && defaultCategory && defaultCategory[0]?._id) {
      const currentId = defaultCategory[0]._id;
      const cat = findObject(data, currentId);
      if (cat) {
        if (cat.parentId) {
          setSelectedParentId(cat.parentId);
          setSelectedSubId(currentId);
        } else {
          setSelectedParentId(currentId);
          setSelectedSubId("");
        }
      }
    }
  }, [data, loading, defaultCategory]);

  // Push a category and its ancestors into the selectedCategory list
  const addCategory = (id) => {
    if (!id) return;
    
    // Find all categories up to the root
    const collectCategories = (targetId, collected = []) => {
      const cat = findObject(data, targetId);
      if (!cat) return collected;
      collected.unshift(cat); // Add parent before child
      if (cat.parentId) {
        return collectCategories(cat.parentId, collected);
      }
      return collected;
    };

    const categoriesToAdd = collectCategories(id);
    if (categoriesToAdd.length === 0) return;

    setSelectedCategory((prev) => {
      let updated = [...prev];
      categoriesToAdd.forEach((cat) => {
        const already = updated.some((v) => v._id === cat._id);
        if (!already) {
          updated.push({
            _id: cat._id,
            name: showingTranslateValue(cat.name),
          });
        }
      });
      return updated;
    });

    // Set the selected leaf category as the default category
    const selectedLeaf = categoriesToAdd[categoriesToAdd.length - 1];
    const entry = {
      _id: selectedLeaf._id,
      name: showingTranslateValue(selectedLeaf.name),
    };
    setDefaultCategory(() => [entry]);
  };

  // When parent dropdown changes
  const handleParentChange = (e) => {
    const id = e.target.value;
    setSelectedParentId(id);
    setSelectedSubId(""); // reset sub-category

    if (id) {
      addCategory(id);
    }
  };

  // When sub-category dropdown changes
  const handleSubChange = (e) => {
    const id = e.target.value;
    setSelectedSubId(id);
    if (id) addCategory(id);
  };

  // Remove a selected category chip
  const handleRemove = (removedId) => {
    const updated = selectedCategory.filter((v) => v._id !== removedId);
    setSelectedCategory(updated);

    if (defaultCategory && defaultCategory.length > 0 && defaultCategory[0]._id === removedId) {
      setDefaultCategory(updated.length > 0 ? [updated[updated.length - 1]] : []);
    }
  };

  return (
    <div className="space-y-3">
      {/* ── Category Dropdown ── */}
      <Select
        value={selectedParentId}
        onChange={handleParentChange}
        disabled={loading}
        className="w-full border-gray-200 focus:border-[#008f89]"
      >
        <option value="">
          {loading ? "Loading categories..." : "Select Category"}
        </option>
        {parentCategories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {showingTranslateValue(cat.name)}
          </option>
        ))}
      </Select>

      {/* ── Sub-category Dropdown (only shown when parent has children) ── */}
      {selectedParentId && subCategories.length > 0 && (
        <Select
          value={selectedSubId}
          onChange={handleSubChange}
          className="w-full border-gray-200 focus:border-[#008f89]"
        >
          <option value="">Select Sub-category</option>
          {subCategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {showingTranslateValue(sub.name)}
            </option>
          ))}
        </Select>
      )}

      {/* ── Selected Category Chips ── */}
      {selectedCategory.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {selectedCategory.map((cat) => (
            <span
              key={cat._id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6f4f3] text-[#008f89] border border-[#b2dedd]"
            >
              {cat.name}
              <button
                type="button"
                onClick={() => handleRemove(cat._id)}
                className="ml-1 text-[#008f89] hover:text-red-500 leading-none"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentCategory;

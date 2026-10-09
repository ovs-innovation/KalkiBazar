import React, { useContext } from "react";
import dynamic from "next/dynamic";
import Drawer from "rc-drawer";
import { IoClose } from "react-icons/io5";

import FilterSidebar from "@components/category/FilterSidebar";
import { SidebarContext } from "@context/SidebarContext";

const FilterDrawer = ({
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
  const { filterDrawerOpen, closeFilterDrawer } = useContext(SidebarContext);

  return (
    <Drawer
      open={filterDrawerOpen}
      onClose={closeFilterDrawer}
      parent={null}
      level={null}
      placement={"right"}
      width="300px"
    >
      <div className="flex flex-col h-full bg-black text-zinc-100" style={{ backgroundColor: "#000000" }}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-850" style={{ backgroundColor: "#000000", borderBottomColor: "#27272a" }}>
          <h2 className="text-lg font-bold text-white">Filters</h2>
          <button onClick={closeFilterDrawer} className="p-2 text-zinc-400 hover:text-yellow-400 rounded-lg hover:bg-zinc-900 transition-colors">
            <IoClose size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3" style={{ backgroundColor: "#000000" }}>
          <FilterSidebar
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedDiscount={selectedDiscount}
            setSelectedDiscount={setSelectedDiscount}
            onClearAll={onClearAll}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default dynamic(() => Promise.resolve(FilterDrawer), { ssr: false });

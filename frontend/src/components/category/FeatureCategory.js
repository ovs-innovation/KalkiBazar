import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// Internal imports
import CategoryServices from "@services/CategoryServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const FeatureCategory = ({ initialSelectedCategory }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();
  const [selectedLeft, setSelectedLeft] = useState(null);

  const { data, error, isLoading: loading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const parentCategories = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const homeRoot = data.find(cat =>
      cat.id === "" ||
      showingTranslateValue(cat?.name)?.toLowerCase() === "home"
    );

    let topLevel = [];
    if (homeRoot && homeRoot.children && homeRoot.children.length > 0) {
      topLevel = homeRoot.children;
    } else {
      topLevel = data;
    }

    return topLevel;
  }, [data, showingTranslateValue]);

  const rightCategories = useMemo(() => {
    return selectedLeft?.children || [];
  }, [selectedLeft]);

  useEffect(() => {
    if (initialSelectedCategory) {
      setSelectedLeft(initialSelectedCategory);
    } else if (parentCategories.length > 0 && !selectedLeft) {
      setSelectedLeft(parentCategories[0]);
    }
  }, [parentCategories, initialSelectedCategory, selectedLeft]);

  const handleSubcategoryClick = (subcategory) => {
    const catName = showingTranslateValue(subcategory?.name) || "";
    router.push(
      {
        pathname: "/search",
        query: { category: catName, _id: subcategory._id },
      },
      undefined,
      { shallow: false }
    );
  };

  if (loading) return <CMSkeleton count={10} height={20} error={error} loading={loading} />;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent">

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1.5 block">
            Curated Formulations
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Featured Categories
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Choose your necessary products from our top clinically verified medical collections.
          </p>
        </div>
        <button
          onClick={() => router.push('/search')}
          className="self-start sm:self-auto inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 active:scale-95 shadow-sm"
        >
          View All Products &rarr;
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[21rem_1fr] lg:gap-8 items-stretch">

        {/* Left Sidebar - Parent Categories */}
        <div className="w-full mb-6 lg:mb-0 flex flex-col min-h-0">

          {/* Desktop Sidebar Layout */}
          <div className="hidden lg:flex lg:flex-col bg-white rounded-2xl shadow-[0_10px_30px_-15px_rgba(15,23,42,0.06)] border border-slate-200/70 overflow-hidden flex-1 min-h-[480px]">
            <div className="bg-indigo-950 px-6 py-6 flex-shrink-0 relative overflow-hidden">
              <div className="absolute -top-12 -right-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-indigo-500/20 blur-xl" />
              <h2 className="text-lg font-extrabold text-white tracking-wide relative z-10">Departments</h2>
              <p className="text-indigo-200/70 text-xs mt-1 relative z-10">Select a category to view sub-items</p>
            </div>

            <div className="p-3.5 flex-1 overflow-y-auto custom-scrollbar space-y-1.5 mt-2">
              {parentCategories.map((category) => {
                const isActive = selectedLeft?._id === category._id;
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelectedLeft(category)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                      ? "bg-indigo-50/70 text-indigo-950 font-bold"
                      : "hover:bg-slate-50 text-slate-600 font-medium hover:text-slate-900"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSideIndicator"
                        className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-indigo-600"
                      />
                    )}

                    <div className={`relative w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? "bg-indigo-600 shadow-md shadow-indigo-200" : "bg-slate-50 group-hover:bg-indigo-50/50"
                      }`}>
                      {category.icon ? (
                        <img
                          src={category.icon}
                          alt={showingTranslateValue(category?.name)}
                          className={`w-5.5 h-5.5 object-contain transition-transform ${isActive ? "brightness-0 invert" : ""}`}
                        />
                      ) : (
                        <span className={`text-sm font-bold ${isActive ? "text-white" : "text-slate-500"}`}>
                          {showingTranslateValue(category?.name)?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <span className="text-sm block truncate leading-tight tracking-tight">
                        {showingTranslateValue(category?.name)}
                      </span>
                    </div>

                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-indigo-600 translate-x-0.5" : "text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="lg:hidden">
            <div className="flex gap-2.5 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory">
              {parentCategories.map((category) => {
                const isActive = selectedLeft?._id === category._id;
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelectedLeft(category)}
                    className={`flex-shrink-0 snap-start flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 min-w-[145px] border ${isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium"
                      }`}
                  >
                    <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? "bg-white/20" : "bg-slate-50"}`}>
                      {category.icon ? (
                        <img
                          src={category.icon}
                          alt={showingTranslateValue(category?.name)}
                          className={`w-5 h-5 object-contain ${isActive ? "brightness-0 invert" : ""}`}
                        />
                      ) : (
                        <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-500"}`}>
                          {showingTranslateValue(category?.name)?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs tracking-tight whitespace-nowrap">
                      {showingTranslateValue(category?.name)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content Area - Subcategories */}
        <div className="flex-1 min-w-0 w-full flex flex-col min-h-0">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_-15px_rgba(15,23,42,0.06)] border border-slate-200/70 overflow-hidden flex flex-col flex-1">

            {/* Active Subsection Banner Header */}
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">
                    {showingTranslateValue(selectedLeft?.name) || "Loading..."}
                  </h3>
                  {rightCategories.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {rightCategories.length} Items Available
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Explore premium pharmacy collections under this division</p>
              </div>
            </div>

            {/* Subcategories Grid Content */}
            <div className="p-4 sm:p-6 lg:p-8 flex-1 min-h-0 bg-gradient-to-b from-white to-slate-50/30">
              <AnimatePresence mode="wait">
                {rightCategories.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
                  >
                    {rightCategories.map((child) => (
                      <button
                        key={child._id}
                        onClick={() => handleSubcategoryClick(child)}
                        className="group relative bg-white rounded-xl border border-slate-200/60 p-4 transition-all duration-300 hover:shadow-[0_12px_24px_-10px_rgba(15,23,42,0.08)] hover:border-indigo-200 text-center flex flex-col items-center"
                      >
                        {/* Image Wrapper Block */}
                        <div className="w-full aspect-square mb-3.5 bg-slate-50/80 rounded-xl p-3 relative overflow-hidden flex items-center justify-center transition-colors group-hover:bg-indigo-50/40">
                          <img
                            src={child.icon || "/placeholder.png"}
                            alt={showingTranslateValue(child?.name)}
                            className="w-4/5 h-4/5 object-contain transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Title text */}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-2 transition-colors duration-200 min-h-[2.5rem] flex items-center justify-center px-1 tracking-tight leading-snug">
                          {showingTranslateValue(child?.name)}
                        </h4>

                        {/* Interactive Tiny Pill indicator */}
                        <div className="mt-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-all duration-200 flex items-center gap-0.5">
                          Explore &rarr;
                        </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center max-w-sm mx-auto"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-300 mb-4 border border-slate-100">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-slate-800 text-sm font-bold">No Subcategories Found</p>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      We haven't added sub-items into this specific tier yet. Check alternative departments or look up keywords directly above.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Styled JSX Custom Scrollbar overrides */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default FeatureCategory;
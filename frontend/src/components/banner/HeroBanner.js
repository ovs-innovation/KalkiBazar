import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
import { HiShieldCheck } from "react-icons/hi";
import { RiTruckLine } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import useTranslation from "next-translate/useTranslation";
import LocationPickerDropdown from "@components/location/LocationPickerDropdown";
import SearchSuggestions from "@components/search/SearchSuggestions";
import useGetSetting from "@hooks/useGetSetting";

const HeroBanner = () => {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");
  const searchInputRef = useRef(null);
  const { storeCustomizationSetting } = useGetSetting();

  const handleSearchChange = (value) => {
    setSearchText(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmedSearchText = searchText.trim();
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    if (trimmedSearchText) {
      router
        .push(
          { pathname: "/search", query: { query: trimmedSearchText } },
          `/search?query=${encodeURIComponent(trimmedSearchText)}`,
          { shallow: false }
        )
        .then(() => setSearchText(""))
        .catch((err) => {
          window.location.href = `/search?query=${encodeURIComponent(trimmedSearchText)}`;
        });
    }
  };

  const bannerImageUrl = "/images/bgbanner.png";

  const badges = [
    { icon: <MdVerified className="w-4 h-4 text-yellow-400" />, label: "100% Organic & Fresh" },
    { icon: <RiTruckLine className="w-4 h-4 text-yellow-400" />, label: "Express 15-Min Delivery" },
    { icon: <HiShieldCheck className="w-4 h-4 text-yellow-400" />, label: "Best Price Guaranteed" },
  ];

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        minHeight: "480px",
        backgroundImage: `url(${bannerImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        marginTop: "20px"
      }}
    >
      {/* Premium dark gradient overlay to blend with the dark page and ensure text readability on the left */}
      <div
        className="absolute inset-0 z-10 block md:hidden"
        style={{
          background: "rgba(3, 3, 3, 0.88)",
        }}
      />
      <div
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(3,3,3,0.98) 0%, rgba(3,3,3,0.90) 35%, rgba(3,3,3,0.5) 55%, rgba(3,3,3,0) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center min-h-[480px] px-6 sm:px-10 md:px-16 lg:px-20 py-10">
        <div className="w-full max-w-[700px]">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 mb-5 bg-yellow-950/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-yellow-800/40 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
            </span>
            <span
              className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-yellow-400"
              style={{ letterSpacing: "0.18em" }}
            >
              ⚡ Fast & Fresh Grocery Delivery
            </span>
          </div>

          {/* Heading — tighter, more elegant */}
          <h1
            className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-4"
          >
            {storeCustomizationSetting?.home?.hero_title ? (
              storeCustomizationSetting.home.hero_title
            ) : (
              <>
                Fresh Grocery
                <br />
                <span className="text-white">Delivered to Your Door.</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-white text-sm md:text-[15px] leading-[1.7] mb-8 max-w-[420px] font-normal">
            {storeCustomizationSetting?.home?.hero_description ||
              "Shop organic vegetables, fresh fruits, daily essentials, and farm-fresh dairy products at the best prices."}
          </p>

          {/* Search bar — premium pill style */}
          <div id="hero-search-anchor" className="w-full max-w-[650px] scroll-mt-32">
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-slate-900/90 backdrop-blur-md rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.4),0_1px_4px_rgba(0,0,0,0.1)] border border-slate-800/80 focus-within:shadow-[0_10px_35px_rgba(234,179,8,0.2)] focus-within:border-yellow-500/50 transition-all duration-300 p-1.5 gap-1"
            >
              {/* Location picker */}
              <div className="shrink-0 flex items-center pl-1">
                <LocationPickerDropdown
                  hideDivider
                  className="!px-2 !border-none !bg-transparent !text-slate-300 !text-[13px] !font-semibold"
                />
              </div>

              {/* Thin divider */}
              <div className="w-px h-5 shrink-0" />

              {/* Input */}
              <div className="flex-1 flex items-center px-3 relative min-w-0">
                <IoSearchOutline className="text-slate-400 text-[17px] shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search fresh vegetables, fruits, grocery items..."
                  className="w-full py-2 border-none text-slate-100 bg-transparent text-[13px] font-semibold focus:outline-none focus:ring-0 min-w-0"
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (searchText.trim().length > 0) setShowSuggestions(true);
                  }}
                  onBlur={(e) => {
                    const relatedTarget = e.relatedTarget;
                    const sc = document.querySelector(".search-suggestions-container");
                    if (!relatedTarget || (sc && !sc.contains(relatedTarget))) {
                      setTimeout(() => {
                        const ae = document.activeElement;
                        if (!sc || !sc.contains(ae)) setShowSuggestions(false);
                      }, 200);
                    }
                  }}
                />
                <SearchSuggestions
                  searchText={searchText}
                  showSuggestions={showSuggestions}
                  onSelect={() => { setSearchText(""); setShowSuggestions(false); }}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>

              {/* Search button — pill inside pill */}
              <button
                type="submit"
                className="shrink-0 flex items-center gap-2 active:scale-[0.96] border border-yellow-500 bg-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 text-white text-[13px] font-bold px-5 py-2.5 rounded-full transition-all duration-200"
              >
                <IoSearchOutline className="text-white text-sm" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-8 flex-wrap">
            {badges.map((b, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-800/60 shadow-sm">
                  {b.icon}
                  <span className="text-slate-300 text-[11px] font-bold tracking-wide">{b.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

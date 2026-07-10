import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
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
      router.push(
        {
          pathname: "/search",
          query: { query: trimmedSearchText },
        },
        `/search?query=${encodeURIComponent(trimmedSearchText)}`,
        { shallow: false }
      ).then(() => {
        setSearchText("");
      }).catch((err) => {
        console.error("Navigation error:", err);
        window.location.href = `/search?query=${encodeURIComponent(trimmedSearchText)}`;
      });
    }
  };

  // RESTORED SHARP BACKGROUND: Use the sharp background image
  const bannerImageUrl = "/images/banner.jpeg";

  return (
    <div
      className="w-full relative overflow-hidden bg-slate-950"
      style={{
        minHeight: '350px',
        height: 'auto',
        backgroundImage: `url(${bannerImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background Layer: BANNER BLUR EFFECT (significant blur on background content) */}
      <div className="absolute inset-0 z-1 bg-white/20 backdrop-blur-[2x] pointer-events-none" />

      {/* Side Feature Cards - Desktop Only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      </div>

      {/* Content Section: MOVED TO LEFT SIDE */}
      <div className="hero-padding relative z-20 w-full flex flex-col items-start justify-center px-4 md:px-10 md:py-14 min-h-[300px]">
        {/* Adjusted width for left alignment */}
        <div className="text-left w-full max-w-xl mb-8 px-2">
          {/* DARKER TEXT: Fixed dark text color (slate-800) */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-5 tracking-tight text-teal-900">
            {storeCustomizationSetting?.home?.hero_title || "Your Premium Digital Pharmacy & Wellness Partner"}
          </h1>
          {/* DARKER TEXT: Fixed dark description color (slate-700) */}
          <p className="text-sm md:text-base lg:text-lg text-black max-w-2xl mb-2" style={{ fontFamily: 'Poppins, Arial, sans-serif' }}>
            {storeCustomizationSetting?.home?.hero_description || "Compare trusted formulations • Verifiable quality prescriptions • Superfast secure home dispatch"}
          </p>

          {/* Search Box: MOVED TO LEFT SIDE */}
          <div className="w-full flex flex-col items-start mt-8">
            <div id="hero-search-anchor" className="w-full max-w-xl scroll-mt-32">
              <form onSubmit={handleSubmit} className="w-full relative flex items-center bg-slate-100 rounded-full shadow-2xl border border-slate-200 transition-all duration-300 p-1.5 focus-within:border-store-500/50 focus-within:ring-2 focus-within:ring-store-500/20">
                <div className="relative z-50 shrink-0 mr-1 md:mr-2">
                  <LocationPickerDropdown hideDivider className="!px-2 md:!px-4 !border-none !bg-transparent !text-slate-900" />
                </div>

                {/* Search Input Box */}
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    <IoSearchOutline className="text-xl" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search medicines, healthcare essentials.."
                    className="w-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-0 text-slate-900 font-medium border-0 focus:border-0 placeholder-slate-500 bg-transparent text-sm md:text-base"
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      if (searchText.trim().length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={(e) => {
                      const relatedTarget = e.relatedTarget;
                      const suggestionsContainer = document.querySelector('.search-suggestions-container');

                      if (!relatedTarget || (suggestionsContainer && !suggestionsContainer.contains(relatedTarget))) {
                        setTimeout(() => {
                          const activeElement = document.activeElement;
                          if (!suggestionsContainer || !suggestionsContainer.contains(activeElement)) {
                            setShowSuggestions(false);
                          }
                        }, 200);
                      }
                    }}
                  />
                  <SearchSuggestions
                    searchText={searchText}
                    showSuggestions={showSuggestions}
                    onSelect={() => {
                      setSearchText("");
                      setShowSuggestions(false);
                    }}
                    onClose={() => setShowSuggestions(false)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-padding {
          padding-top: 3rem;
          padding-bottom: 2.5rem;
        }

        @media (max-width: 768px) {
          .hero-padding {
            padding-top: 4rem;
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;
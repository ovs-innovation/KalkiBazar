import React, { useContext, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiAlignLeft, FiUser } from "react-icons/fi";
import { IoSearchOutline, IoLockClosedOutline, IoClose } from "react-icons/io5";
import { useRouter } from "next/router";

// internal imports
import { getUserSession } from "@lib/auth";
import { SidebarContext } from "@context/SidebarContext";
import CategoryDrawer from "@components/drawer/CategoryDrawer";
import LocationButton from "@components/location/LocationButton";
import SearchSuggestions from "@components/search/SearchSuggestions";
import CustomerNotificationBell from "@components/notification/CustomerNotificationBell";
import KalkiBazar from "../../../public/logo/kalkiBazar.png";

const MobileFooter = () => {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const { toggleCategoryDrawer, showSearch, setShowSearch, toggleSearch } = useContext(SidebarContext);
  const userInfo = getUserSession();
  const router = useRouter();

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
        setShowSearch(false);
      }).catch((err) => {
        console.error("Navigation error:", err);
        window.location.href = `/search?query=${encodeURIComponent(trimmedSearchText)}`;
      });
    } else {
      router.push(`/`);
      setSearchText("");
      setShowSearch(false);
    }
  };

  return (
    <>
      {/* Category Drawer */}
      <CategoryDrawer />

      {/* Mobile Top Header */}
      <header className="lg:hidden fixed z-[60] top-0 left-0 right-0 glass-header bg-slate-950/95 border-b border-slate-800/80 flex items-center justify-between w-full h-16 px-3 sm:px-6 shadow-md backdrop-blur-xl">
        {/* Left: Category Drawer Menu & Logo */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Open Categories"
            onClick={toggleCategoryDrawer}
            className="flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-yellow-400 hover:bg-slate-900 transition-colors focus:outline-none"
          >
            <FiAlignLeft className="w-6 h-6" />
          </button>

          <Link
            href="/"
            className="flex items-center shrink-0 group"
            aria-label="Kalki Bazar Home"
          >
            <Image
              src={KalkiBazar}
              alt="Kalki Bazar"
              width={140}
              height={48}
              priority
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ height: "46px", width: "auto" }}
            />
          </Link>
        </div>

        {/* Right: Search, Notification Bell, User Account/Login */}
        <div className="flex items-center gap-2">
          {/* Search Toggle Button */}
          <button
            type="button"
            onClick={toggleSearch}
            className={`p-2 rounded-full transition-colors ${
              showSearch
                ? "text-yellow-400 bg-yellow-400/10"
                : "text-slate-300 hover:text-yellow-400 hover:bg-slate-900"
            }`}
            aria-label="Toggle Search"
          >
            <IoSearchOutline className="text-xl" />
          </button>

          {/* Customer Notifications */}
          <CustomerNotificationBell className="text-xl hover:text-yellow-400" />

          {/* User Account / Login */}
          <div className="flex items-center">
            {userInfo?.image ? (
              <Link href="/user/dashboard" className="block">
                <Image
                  width={30}
                  height={30}
                  src={userInfo.image}
                  alt="Account"
                  className="rounded-full object-cover w-7 h-7 border border-yellow-500/40"
                />
              </Link>
            ) : userInfo?.name ? (
              <Link
                href="/user/dashboard"
                className="w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center justify-center border border-yellow-500/40"
              >
                {userInfo.name[0]}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 font-bold px-3 py-1.5 rounded-full flex items-center gap-1 text-xs shadow-sm transition-all"
              >
                <FiUser className="text-xs" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Expandable Mobile Search Bar Dropdown */}
      {showSearch && (
        <div className="fixed z-50 top-16 left-0 right-0 w-full bg-slate-900/98 backdrop-blur-2xl border-b border-slate-800 px-3 py-2.5 shadow-2xl animate-expandSearch">
          <form
            onSubmit={handleSubmit}
            className="relative bg-slate-950 rounded-full border border-slate-700/80 focus-within:border-yellow-500/50 w-full flex items-center overflow-visible p-1 shadow-inner"
          >
            {/* Location Button */}
            <LocationButton className="h-9 flex-shrink-0 !text-slate-300 !border-none !bg-transparent text-xs" />

            <div className="w-px h-5 bg-slate-800 shrink-0" />

            {/* Search Input */}
            <div className="flex-1 relative min-w-0">
              <input
                ref={searchInputRef}
                onChange={(e) => handleSearchChange(e.target.value)}
                value={searchText}
                type="search"
                placeholder="Search grocery, medicines, daily essentials..."
                className="w-full pl-3 pr-10 appearance-none text-xs sm:text-sm font-sans rounded-full min-h-[36px] bg-transparent text-slate-100 placeholder-slate-400 outline-none border-none focus:outline-none"
                onFocus={() => searchText.trim().length > 0 && setShowSuggestions(true)}
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
              <button
                aria-label="Search"
                type="submit"
                className="outline-none text-yellow-400 hover:text-yellow-300 absolute top-0 right-0 h-full px-3 flex items-center justify-center text-lg"
              >
                <IoSearchOutline />
              </button>
              <SearchSuggestions
                searchText={searchText}
                showSuggestions={showSuggestions}
                onSelect={() => {
                  setSearchText("");
                  setShowSuggestions(false);
                  setShowSearch(false);
                }}
                onClose={() => setShowSuggestions(false)}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(MobileFooter), { ssr: false });

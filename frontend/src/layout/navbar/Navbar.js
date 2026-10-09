import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import { FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";

import { getUserSession } from "@lib/auth";
import useWishlist from "@hooks/useWishlist";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CartDrawer from "@components/drawer/CartDrawer";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import CategoryServices from "@services/CategoryServices";
import SearchSuggestions from "@components/search/SearchSuggestions";
import LowerCategoryNavbar from "./LowerCategoryNavbar";
import CustomerNotificationBell from "@components/notification/CustomerNotificationBell";
import LocationPickerDropdown from "@components/location/LocationPickerDropdown";
import KalkiBazar from "../../../public/logo/kalkiBazar.png";

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex items-center shrink-0 group py-1" aria-label="Kalki Bazar">
      <Image
        src={KalkiBazar}
        alt="Kalki Bazar"
        width={180}
        height={72}
        priority
        className="object-contain transition-transform duration-300 group-hover:scale-105"
        style={{ height: "66px", width: "auto", minWidth: "120px" }}
      />
    </Link>
  );
};

const Navbar = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const router = useRouter();
  const { dispatch } = useContext(UserContext) || {};
  const { toggleCartDrawer } = useContext(SidebarContext);
  const { totalUniqueItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const userInfo = getUserSession();

  const { data: categoriesData } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const getLevel1Categories = (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) return [];

    const homeRoot = categories.find(
      (cat) =>
        cat.id === "Root" ||
        showingTranslateValue(cat?.name)?.toLowerCase() === "home"
    );

    let topLevel = homeRoot?.children?.length ? homeRoot.children : categories;
    return topLevel;
  };

  const categories = getLevel1Categories(categoriesData);

  // Manage search bar open/closed state
  const isSearchPage = router.pathname === "/search";
  const [isSearchOpen, setIsSearchOpen] = useState(isSearchPage);
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Check auth token expiration
  const handleLogOut = () => {
    signOut();
    Cookies.remove("userInfo");
    Cookies.remove("couponInfo");
    if (dispatch) {
      dispatch({ type: "USER_LOGOUT" });
    }
    router.push("/");
  };

  useEffect(() => {
    if (userInfo && typeof userInfo.token === "string") {
      try {
        const decoded = jwtDecode(userInfo.token);
        const expireTime = new Date(decoded?.exp * 1000);
        const currentTime = new Date();
        if (currentTime >= expireTime) {
          handleLogOut();
        }
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (router.pathname === "/search") {
      setIsSearchOpen(true);
      if (router.query.query) {
        setSearchText(router.query.query);
      }
    } else {
      setIsSearchOpen(false);
    }
  }, [router.pathname, router.query.query]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleCloseSearch = () => {
    if (!isSearchPage) {
      setIsSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchOpen && !isSearchPage) {
        handleCloseSearch();
      }
    };

    const handleClickOutside = (e) => {
      if (
        isSearchOpen &&
        !isSearchPage &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        const box = document.querySelector(".search-suggestions-container");
        if (!box || !box.contains(e.target)) {
          handleCloseSearch();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, isSearchPage]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchText.trim();
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    if (trimmed) {
      router
        .push(
          { pathname: "/search", query: { query: trimmed } },
          `/search?query=${encodeURIComponent(trimmed)}`,
          { shallow: false }
        )
        .catch(() => {
          window.location.href = `/search?query=${encodeURIComponent(trimmed)}`;
        });
    }
  };

  return (
    <>
      <CartDrawer />
      <header className="hidden lg:block glass-header bg-slate-950/95 border-b border-slate-800/80 shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-2.5 min-h-[64px] relative">
            {/* Left: Brand Logo + Delivery Location Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <NavbarLogo />

              {/* <div className="hidden lg:flex items-center pl-3 border-l border-slate-800/80">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-400/90 leading-tight">
                    Deliver to
                  </span>
                  <LocationPickerDropdown
                    hideDivider
                    className="!p-0 !bg-transparent !border-none !text-xs !font-semibold !text-slate-200 hover:!text-yellow-400 !justify-start !h-auto pt-0.5"
                  />
                </div>
              </div> */}
            </div>

            {/* Center: Search Bar (when open) OR Categories Dropdown Navigation (when closed) */}
            <div
              ref={searchContainerRef}
              className="flex-1 min-w-0 flex items-center justify-center px-2"
            >
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="navbar-search-form relative z-50 flex items-center w-full max-w-2xl rounded-full border border-yellow-500/50 bg-slate-900/95 backdrop-blur-md p-1 shadow-[0_0_25px_rgba(234,179,8,0.18)] transition-all animate-expandSearch"
                >
                  <div className="flex-1 relative min-w-0 flex items-center min-h-[38px]">
                    <IoSearchOutline className="absolute left-3.5 text-yellow-400 text-lg pointer-events-none z-10" />
                    <input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search for fresh vegetables, fruits, groceries, medicines..."
                      className="navbar-search-input w-full h-full py-1.5 pl-10 pr-2 text-sm text-slate-100 placeholder-slate-400 !bg-transparent !border-0 !outline-none"
                      value={searchText}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
                      onBlur={(e) => {
                        const relatedTarget = e.relatedTarget;
                        const box = document.querySelector(".search-suggestions-container");
                        if (!relatedTarget || (box && !box.contains(relatedTarget))) {
                          setTimeout(() => {
                            const active = document.activeElement;
                            if (!box || !box.contains(active)) setShowSuggestions(false);
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
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 text-xs font-extrabold px-5 py-2 border-0 outline-none shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
                  >
                    Search
                  </button>
                  {!isSearchPage && (
                    <button
                      type="button"
                      onClick={handleCloseSearch}
                      className="ml-1 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center shrink-0"
                      aria-label="Close search"
                      title="Close search (Esc)"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                </form>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <LowerCategoryNavbar
                    variant="inline"
                    categories={categories}
                    showingTranslateValue={showingTranslateValue}
                  />
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Trigger Button (when search is closed) */}
              {!isSearchOpen && (
                <button
                  type="button"
                  onClick={handleOpenSearch}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-yellow-400 hover:bg-slate-800/80 rounded-full transition-all text-xs font-semibold border border-slate-800 hover:border-yellow-500/40"
                  aria-label="Search products"
                  title="Search"
                >
                  <IoSearchOutline className="text-base text-yellow-400" />
                  <span className="hidden xl:inline">Search</span>
                </button>
              )}

              {/* Customer Notification Bell */}
              <CustomerNotificationBell className="text-xl hover:text-yellow-400" />

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-slate-300 hover:text-yellow-400 rounded-full hover:bg-slate-800/70 transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <FiHeart className="text-xl" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center px-0.5 shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Pill */}
              <button
                type="button"
                onClick={toggleCartDrawer}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-full shadow-md hover:shadow-yellow-500/20 active:scale-95 transition-all text-xs"
                aria-label="Shopping Cart"
                title="View Cart"
              >
                <FiShoppingCart className="text-base" />
                <span className="hidden sm:inline">Cart</span>
                {totalUniqueItems > 0 && (
                  <span className="bg-slate-950 text-yellow-400 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {totalUniqueItems}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-slate-800 mx-1" />

              {/* User / Login */}
              {userInfo?.token ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/user/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-yellow-400 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full transition-all"
                    title="My Account"
                  >
                    {userInfo?.image ? (
                      <Image
                        width={22}
                        height={22}
                        src={userInfo.image}
                        alt="Account"
                        className="rounded-full w-5 h-5 object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold flex items-center justify-center border border-yellow-500/40">
                        {userInfo?.name?.[0] || "U"}
                      </div>
                    )}
                    <span className="max-w-[75px] truncate">
                      {userInfo?.name?.split(" ")[0] || "Account"}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogOut}
                    className="text-xs text-slate-400 hover:text-rose-400 p-1.5 rounded-full hover:bg-slate-800/60 transition-colors"
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-100 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-4 py-1.5 rounded-full transition-all shadow-sm"
                >
                  <FiUser className="text-sm text-yellow-400" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <style jsx global>{`
        .navbar-search-form .navbar-search-input {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          --tw-ring-shadow: 0 0 #0000 !important;
        }
        .navbar-search-form .navbar-search-input:focus {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
        @keyframes expandSearch {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(-2px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-expandSearch {
          animation: expandSearch 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });

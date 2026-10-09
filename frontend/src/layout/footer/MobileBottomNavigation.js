import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { FiHome, FiShoppingCart, FiHeart, FiFileText, FiSearch } from "react-icons/fi";
import { SidebarContext } from "@context/SidebarContext";
import useWishlist from "@hooks/useWishlist";

const MobileBottomNavigation = () => {
  const router = useRouter();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { toggleCartDrawer, toggleSearch, showSearch } = useContext(SidebarContext);

  const isActive = (href) => router.pathname === href;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center px-2 py-2 pb-safe max-w-lg mx-auto">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            isActive("/")
              ? "text-yellow-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FiHome className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Search */}
        <button
          onClick={toggleSearch}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            showSearch
              ? "text-yellow-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FiSearch className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* Cart */}
        <button
          onClick={toggleCartDrawer}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition-all duration-200 ${
            router.pathname === "/cart"
              ? "text-yellow-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <FiShoppingCart className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-yellow-500 text-slate-950 text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>

        {/* Orders */}
        <Link
          href="/user/my-orders"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            isActive("/user/my-orders")
              ? "text-yellow-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FiFileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Orders</span>
        </Link>

        {/* WishList */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition-all duration-200 ${
            isActive("/wishlist")
              ? "text-yellow-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <FiHeart className="w-5 h-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Wishlist</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;

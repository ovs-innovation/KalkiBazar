import React from "react";
import Link from "next/link";
import { HiShieldCheck } from "react-icons/hi";
import { RiTruckLine, RiShoppingBag3Line } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import useGetSetting from "@hooks/useGetSetting";

const HeroBanner = () => {
  const { storeCustomizationSetting } = useGetSetting();

  const bannerImageUrl = "/images/bgbanner.png";

  const badges = [
    { icon: <MdVerified className="w-4 h-4 text-yellow-400 shrink-0" />, label: "100% Organic & Fresh" },
    { icon: <RiTruckLine className="w-4 h-4 text-yellow-400 shrink-0" />, label: "Express 15-Min Delivery" },
    { icon: <HiShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />, label: "Best Price Guaranteed" },
  ];

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        minHeight: "440px",
        backgroundImage: `url(${bannerImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark gradient overlay for optimal readability */}
      <div
        className="absolute inset-0 z-10 block md:hidden"
        style={{
          background: "rgba(3, 3, 3, 0.90)",
        }}
      />
      <div
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(3,3,3,0.98) 0%, rgba(3,3,3,0.90) 40%, rgba(3,3,3,0.5) 65%, rgba(3,3,3,0.1) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center min-h-[440px] px-4 sm:px-8 md:px-16 lg:px-20 py-8 sm:py-12">
        <div className="w-full max-w-[680px]">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 mb-4 bg-yellow-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-yellow-800/50 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.16em] uppercase text-yellow-400"
              style={{ letterSpacing: "0.16em" }}
            >
              ⚡ Fast & Fresh Grocery Delivery
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.12] tracking-tight mb-3 sm:mb-4">
            {storeCustomizationSetting?.home?.hero_title ? (
              storeCustomizationSetting.home.hero_title
            ) : (
              <>
                Fresh Grocery
                <br />
                <span className="text-yellow-400">Delivered to Your Door.</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-slate-200 text-xs sm:text-sm md:text-[15px] leading-relaxed mb-6 sm:mb-8 max-w-[460px] font-normal">
            {storeCustomizationSetting?.home?.hero_description ||
              "Shop organic vegetables, fresh fruits, daily essentials, and farm-fresh dairy products at the best prices."}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 font-extrabold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-[0_8px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_12px_28px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <RiShoppingBag3Line className="text-lg" />
              <span>Shop Now</span>
              <span className="ml-0.5">→</span>
            </Link>

            <a
              href="#feature-category"
              className="inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm md:text-base px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border border-slate-700/80 hover:border-yellow-500/50 backdrop-blur-md transition-all duration-200"
            >
              Explore Categories
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-2.5 sm:gap-3 mt-7 sm:mt-9 flex-wrap">
            {badges.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/80 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 rounded-full border border-slate-800/80 shadow-sm"
              >
                {b.icon}
                <span className="text-slate-300 text-[11px] sm:text-xs font-semibold">{b.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

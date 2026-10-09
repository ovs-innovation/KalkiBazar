import React, { useMemo, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward, IoFlash } from "react-icons/io5";
import Cookies from "js-cookie";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Internal imports
import useUtilsFunction from "@hooks/useUtilsFunction";
import SectionHeader from "@components/common/SectionHeader";
import { UserContext } from "@context/UserContext";
import ProductCard from "@components/product/ProductCard";

const DealsYouLove = ({ products, attributes }) => {
  const { getNumber } = useUtilsFunction();

  // Determine wholesaler status from Context or Cookies
  const { state } = useContext(UserContext) || {};
  const isWholesaler = useMemo(() => {
    let role = state?.userInfo?.role;
    if (!role && typeof window !== "undefined") {
      try {
        const cookieUser = Cookies.get("userInfo");
        if (cookieUser) role = JSON.parse(cookieUser)?.role;
      } catch (e) { }
    }
    return role && role.toString().toLowerCase() === "wholesaler";
  }, [state]);

  // Filter products that have at least a 20% discount and match wholesaler criteria
  const dealProducts = useMemo(() => {
    if (!products) return [];

    return products
      .map(p => {
        const retailPrice = getNumber(p?.prices?.price);
        const originalPrice = getNumber(p?.prices?.originalPrice);
        let discountPercent = 0;
        if (originalPrice > retailPrice) {
          discountPercent = Math.round(((originalPrice - retailPrice) / originalPrice) * 100);
        }
        return { ...p, discountPercent };
      })
      .filter(p => p.discountPercent > 0)
      .filter(p => {
        if (!isWholesaler) return true;
        return (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler;
      });
  }, [products, isWholesaler, getNumber]);

  if (!dealProducts || dealProducts.length === 0) return null;

  return (
    <div className="relative lg:py-16 py-10 overflow-hidden bg-transparent">

      {/* Soft Glow Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[-5%] w-[400px] h-[400px] bg-amber-500/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] bg-indigo-500/[0.015] rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="mb-8 flex flex-row items-end justify-between gap-4 border-b border-slate-850 pb-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold uppercase tracking-wider border border-amber-500/20">
              <IoFlash className="animate-pulse text-amber-500 text-sm" /> Hot Offers
            </div>
            <SectionHeader
              title="Special Health Offers"
              subtitle="Grab these limited-time offers and top-tier value formulations before they're gone!"
              align="left"
            />
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="relative group/slider px-2">
          {/* Custom Floating Navigation Buttons on Left & Right */}
          <button
            aria-label="Previous Slide"
            className="prev-deals absolute top-1/2 -left-2 sm:-left-4 md:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
          >
            <IoChevronBack className="text-xl" />
          </button>

          <button
            aria-label="Next Slide"
            className="next-deals absolute top-1/2 -right-2 sm:-right-4 md:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
          >
            <IoChevronForward className="text-xl" />
          </button>

          <div className="w-full">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={14}
              slidesPerView={2}
              navigation={{ prevEl: ".prev-deals", nextEl: ".next-deals" }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                640: { slidesPerView: 3, spaceBetween: 14 },
                768: { slidesPerView: 4, spaceBetween: 16 },
                1024: { slidesPerView: 5, spaceBetween: 18 },
                1280: { slidesPerView: 6, spaceBetween: 18 },
              }}
              className="mySwiper !pb-6 px-1"
            >
              {dealProducts.map((product) => (
                <SwiperSlide key={product._id} className="h-auto">
                  <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard product={product} attributes={attributes} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsYouLove;
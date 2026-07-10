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
    <div className="relative lg:py-16 py-10 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-100">

      {/* Soft Glow Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[-5%] w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="mb-8 flex flex-row items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-bold uppercase tracking-wider border border-amber-200/40">
              <IoFlash className="animate-pulse text-amber-600 text-sm" /> Hot Offers
            </div>
            <SectionHeader
              title="Special Health Offers"
              subtitle="Grab these limited-time offers and top-tier value formulations before they're gone!"
              align="left"
            />
          </div>

          {/* Clean Integrated Header Buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 mb-1">
            <button className="prev-deals w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 active:scale-95 transition-all shadow-sm">
              <IoChevronBack className="text-lg" />
            </button>
            <button className="next-deals w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 active:scale-95 transition-all shadow-sm">
              <IoChevronForward className="text-lg" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={18}
            slidesPerView={2}
            navigation={{ prevEl: ".prev-deals", nextEl: ".next-deals" }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 18 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 22 },
              1280: { slidesPerView: 6, spaceBetween: 24 },
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
  );
};

export default DealsYouLove;
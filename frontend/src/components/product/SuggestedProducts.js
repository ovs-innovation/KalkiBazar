import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { IoChevronBack, IoChevronForward, IoSparkles } from "react-icons/io5";
import SectionHeader from "@components/common/SectionHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const SuggestedProducts = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { state } = useContext(UserContext) || {};
  const isWholesaler = state?.userInfo?.role && state.userInfo.role.toString().toLowerCase() === "wholesaler";
  const [products, setProducts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        setFetchLoading(true);
        let userInfo = null;
        try {
          const cookie = Cookies.get("userInfo");
          if (cookie) userInfo = JSON.parse(cookie);
        } catch (e) { }

        let params = {};
        let guestIds = [];
        const guestHistory = localStorage.getItem("recentlyViewed");
        if (guestHistory) {
          try {
            const parsed = JSON.parse(guestHistory);
            if (Array.isArray(parsed)) {
              const unique = Array.from(new Set(parsed.map(item => item._id)));
              guestIds = unique;
              params.productIds = guestIds.join(",");
            }
          } catch (e) {
            console.error("Error parsing guest history", e);
          }
        }
        const res = await ProductServices.getSuggestedProducts(params);
        
        const filtered = Array.isArray(res)
          ? res.filter((p, i, arr) => p && arr.findIndex(x => x._id === p._id) === i)
          : [];
        
        // If wholesaler, filter to wholesale-eligible products only
        if (isWholesaler) {
          setProducts(filtered.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler));
        } else {
          setProducts(filtered);
        }
      } catch (err) {
        console.error("SuggestedProducts: Error fetching suggested products:", err);
        setProducts([]);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSuggestedProducts();
  }, [isWholesaler]);

  if (fetchLoading) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  const eligibleProducts = isWholesaler
    ? products.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler)
    : products;

  if (eligibleProducts.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full bg-transparent overflow-hidden">
      <div className="relative z-10">
        {/* Header Section with Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest shadow-md mb-3">
            <IoSparkles className="text-slate-950 animate-pulse" />
            Picked For You
          </div>
          <SectionHeader
            title="Suggested For You"
            subtitle="Personalized recommendations based on your activity"
            align="left"
          />
        </div>

        {/* Carousel Slider */}
        <div className="relative group/slider px-2">
          {/* Custom Floating Navigation Buttons on Left & Right */}
          <button
            aria-label="Previous Slide"
            className="prev-suggested absolute top-1/2 -left-2 sm:-left-4 md:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
          >
            <IoChevronBack className="text-xl" />
          </button>

          <button
            aria-label="Next Slide"
            className="next-suggested absolute top-1/2 -right-2 sm:-right-4 md:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
          >
            <IoChevronForward className="text-xl" />
          </button>

          <div className="w-full">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={14}
              slidesPerView={2}
              loop={eligibleProducts.length >= 5}
              navigation={{
                prevEl: ".prev-suggested",
                nextEl: ".next-suggested",
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                640: { slidesPerView: 3, spaceBetween: 14 },
                768: { slidesPerView: 4, spaceBetween: 16 },
                1024: { slidesPerView: 5, spaceBetween: 18 },
                1280: { slidesPerView: 6, spaceBetween: 18 },
              }}
              className="mySwiper !pb-6 px-1"
            >
              {eligibleProducts.map((product) => (
                <SwiperSlide key={product._id} className="h-auto">
                  <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard product={product} />
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

export default SuggestedProducts;

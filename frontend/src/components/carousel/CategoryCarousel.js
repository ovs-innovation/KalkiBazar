import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useRef } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller, Navigation, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";

import { SidebarContext } from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Loading from "@components/preloader/Loading";
import useGetSetting from "@hooks/useGetSetting";
import SectionHeader from "@components/common/SectionHeader";

const CategoryCarousel = () => {
  const router = useRouter();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { showingTranslateValue } = useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomizationSetting } = useGetSetting();

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const handleCategoryClick = (id, category) => {
    const category_name = showingTranslateValue(category)
      ?.toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");

    router.push(`/search?category=${category_name}&_id=${id}`);
    setIsLoading(!isLoading);
  };

  return (
    <section className="relative py-12 md:py-16">
      <div className="page-container">
        <SectionHeader
          badge="Browse"
          title="Shop by Category"
          subtitle="Explore our wide range of healthcare and wellness products"
          align="center"
        />

        <div className="relative category-carousel-wrapper px-2 md:px-10">
          <Swiper
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            navigation={true}
            allowTouchMove={true}
            loop={data?.[0]?.children?.length >= 12}
            breakpoints={{
              320: { slidesPerView: 2.2, spaceBetween: 12 },
              480: { slidesPerView: 2.8, spaceBetween: 16 },
              640: { slidesPerView: 3.5, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 24 },
              1280: { slidesPerView: 6, spaceBetween: 28 },
            }}
            modules={[Autoplay, Navigation, Pagination, Controller]}
            className="mySwiper category-slider !pb-2"
          >
            {loading ? (
              <Loading loading={loading} />
            ) : error ? (
              <p className="flex justify-center items-center m-auto text-base text-red-500 py-8">
                {error?.response?.data?.message || error?.message}
              </p>
            ) : (
              data[0]?.children?.map((category, i) => (
                <SwiperSlide key={i + 1} className="group !h-auto">
                  <button
                    type="button"
                    onClick={() =>
                      handleCategoryClick(category?._id, category.name)
                    }
                    className="w-full text-center cursor-pointer p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-100 hover:border-store-200 premium-shadow hover-scale transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-store-400"
                  >
                    <div className="relative mx-auto mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-store-100 to-store-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-110" />
                      <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] mx-auto rounded-2xl bg-gradient-to-br from-store-50 to-white border border-store-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={category?.icon || "/placeholder.png"}
                          alt={showingTranslateValue(category?.name) || "category"}
                          width={56}
                          height={56}
                          style={{ width: "auto", height: "auto" }}
                          className="object-contain max-h-12 md:max-h-14"
                        />
                      </div>
                    </div>

                    <h3 className="text-xs md:text-sm font-semibold text-neutral-700 group-hover:text-store-700 transition-colors duration-200 line-clamp-2 min-h-[2.25rem] flex items-center justify-center leading-snug">
                      {showingTranslateValue(category?.name)}
                    </h3>

                    <div className="mt-2.5 h-0.5 w-0 mx-auto bg-gradient-to-r from-store-400 to-store-600 rounded-full group-hover:w-10 transition-all duration-400" />
                  </button>
                </SwiperSlide>
              ))
            )}
          </Swiper>

          <button
            ref={prevRef}
            className="carousel-nav-btn prev left-0 md:-left-2"
            aria-label="Previous categories"
          >
            <IoChevronBackOutline size={22} />
          </button>
          <button
            ref={nextRef}
            className="carousel-nav-btn next right-0 md:-right-2"
            aria-label="Next categories"
          >
            <IoChevronForward size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CategoryCarousel);

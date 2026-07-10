import Link from "next/link";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SliderCarousel = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingImage, showingTranslateValue } = useUtilsFunction();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { left_right_arrow, bottom_dots, both_slider } = storeCustomizationSetting?.slider || {};
  const showArrows = left_right_arrow || both_slider;
  const showDots = bottom_dots || both_slider;

  //Map and extract direct CMS customization settings safely
  const backendSliderData = [
    {
      img: storeCustomizationSetting?.slider?.first_img,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.first_title),
      desc: showingTranslateValue(storeCustomizationSetting?.slider?.first_description),
      button: showingTranslateValue(storeCustomizationSetting?.slider?.first_button),
      slug: storeCustomizationSetting?.slider?.first_productSlug,
      catSlug: storeCustomizationSetting?.slider?.first_categorySlug,
      catId: storeCustomizationSetting?.slider?.first_categoryId,
      badge: "Offer"
    },
    {
      img: storeCustomizationSetting?.slider?.second_img,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.second_title),
      desc: showingTranslateValue(storeCustomizationSetting?.slider?.second_description),
      button: showingTranslateValue(storeCustomizationSetting?.slider?.second_button),
      slug: storeCustomizationSetting?.slider?.second_productSlug,
      catSlug: storeCustomizationSetting?.slider?.second_categorySlug,
      catId: storeCustomizationSetting?.slider?.second_categoryId,
      badge: "Deal"
    },
    {
      img: storeCustomizationSetting?.slider?.third_img,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.third_title),
      desc: showingTranslateValue(storeCustomizationSetting?.slider?.third_description),
      button: showingTranslateValue(storeCustomizationSetting?.slider?.third_button),
      slug: storeCustomizationSetting?.slider?.third_productSlug,
      catSlug: storeCustomizationSetting?.slider?.third_categorySlug,
      catId: storeCustomizationSetting?.slider?.third_categoryId,
      badge: "Trending"
    },
    {
      img: storeCustomizationSetting?.slider?.four_img,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.four_title),
      desc: showingTranslateValue(storeCustomizationSetting?.slider?.four_description),
      button: showingTranslateValue(storeCustomizationSetting?.slider?.four_button),
      slug: storeCustomizationSetting?.slider?.four_productSlug,
      catSlug: storeCustomizationSetting?.slider?.four_categorySlug,
      catId: storeCustomizationSetting?.slider?.four_categoryId,
      badge: "Hot"
    },
    {
      img: storeCustomizationSetting?.slider?.five_img,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.five_title),
      desc: showingTranslateValue(storeCustomizationSetting?.slider?.five_description),
      button: showingTranslateValue(storeCustomizationSetting?.slider?.five_button),
      slug: storeCustomizationSetting?.slider?.five_productSlug,
      catSlug: storeCustomizationSetting?.slider?.five_categorySlug,
      catId: storeCustomizationSetting?.slider?.five_categoryId,
      badge: "Promo"
    },
  ].filter(item => item.img).map(item => ({
    ...item,
    img: showingImage(item.img)
  }));

  // Medical-themed placeholder collection with clean marketing info
  // Default images from public/slider folder
  const defaultSliderData = [
    {
      img: "/images/slid1.jpeg",
      title: "Paracetamol & Medicines",
      desc: "Quality medicines delivered safely to your doorstep.",
      badge: "Featured"
    },
    {
      img: "/images/slid2.png",
      title: "Healthcare Essentials",
      desc: "Explore trusted healthcare products at affordable prices.",
      badge: "Best Seller"
    },
    {
      img: "/images/slid3.webp",
      title: "Cardiac Care Products",
      desc: "Premium healthcare solutions for your family.",
      badge: "Top Rated"
    },
    {
      img: "/images/img4.webp",
      title: "Wellness Products",
      desc: "Vitamins, supplements and daily health essentials.",
      badge: "New Arrival"
    },
    {
      img: "/images/img5.jpeg",
      title: "Special Offers",
      desc: "Get amazing discounts on medicines and healthcare products.",
      badge: "Limited Offer"
    }
  ];

  const sliderData = backendSliderData.length > 0 ? backendSliderData : defaultSliderData;

  if (!sliderData || sliderData.length === 0) {
    return null;
  }

  // Refactored unified card presentation framework
  const renderSliderContent = (item, index) => (
    <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] lg:h-[340px] rounded-2xl overflow-hidden group border border-slate-100 bg-gradient-to-br from-slate-50 via-teal-50/10 to-white shadow-md hover:shadow-xl transition-all duration-300">
      <Image
        src={item.img || "/placeholder.png"}
        alt={item.title || `Pharmacy Promotional Offer ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover cursor-pointer group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        priority={index === 0}
      />

      {/* High-Contrast Info Overlay Block */}
      {item.title && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent flex flex-col justify-center px-6 sm:px-10 pointer-events-none select-none z-10">
          <div className="max-w-[75%] sm:max-w-[65%] space-y-2">
            <span className="inline-block bg-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              {item.badge}
            </span>
            <h3 className="text-white text-base sm:text-2xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
              {item.title}
            </h3>
            <p className="text-slate-300 text-[11px] sm:text-sm line-clamp-2 font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white py-6 md:py-8">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="relative group/slider">
          <Swiper
            onInit={(swiper) => {
              if (showArrows) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={showDots ? { clickable: true, dynamicBullets: true } : false}
            navigation={showArrows ? {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            } : false}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={sliderData.length >= 2}
            className="slider-carousel-swiper !pb-10"
          >
            {sliderData.map((item, index) => (
              <SwiperSlide key={index}>
                {item.slug ? (
                  <Link href={`/product/${item.slug}`} className="block h-full">
                    {renderSliderContent(item, index)}
                  </Link>
                ) : item.catSlug ? (
                  <Link href={`/search?category=${item.catSlug}${item.catId ? `&_id=${item.catId}` : ""}`} className="block h-full">
                    {renderSliderContent(item, index)}
                  </Link>
                ) : (
                  renderSliderContent(item, index)
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Minimal Elegant Navigation Controls */}
          {showArrows && (
            <>
              <button
                ref={prevRef}
                className="absolute left-2 top-[45%] -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-full hidden md:flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all transform -translate-x-4 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0"
              >
                <IoChevronBack className="text-lg" />
              </button>
              <button
                ref={nextRef}
                className="absolute right-2 top-[45%] -translate-y-1/2 z-20 w-10 h-10 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-full hidden md:flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all transform translate-x-4 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0"
              >
                <IoChevronForward className="text-lg" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Global CSS Pagination Enhancements */}
      <style jsx global>{`
        .slider-carousel-swiper .swiper-pagination-bullet-active {
          background: #0d9488 !important; /* Premium Teal-600 Tone */
          width: 22px !important;
          border-radius: 6px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slider-carousel-swiper .swiper-pagination-bullet {
          margin: 0 4px !important;
        }
      `}</style>
    </div>
  );
};

export default SliderCarousel;
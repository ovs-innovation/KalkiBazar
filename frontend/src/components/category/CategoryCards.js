import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Internal imports
import useGetSetting from "@hooks/useGetSetting";

const CategoryCards = () => {
  const router = useRouter();
  const { storeCustomizationSetting } = useGetSetting();

  // Matched to the soft pastel color palette from the screenshot
  const categories = [
    {
      id: 1,
      title: "Masale",
      image: "/flags/cat7.webp",
      searchQuery: "Diabetes",
      bgColor: "bg-[#eefaf3]", // Soft Mint Green
    },
    {
      id: 2,
      title: "Sweets",
      image: "/flags/cat3.webp",
      searchQuery: "Orthopedic",
      bgColor: "bg-[#f5effa]", // Soft Lavender
    },
    {
      id: 3,
      title: "Oil & Shampu",
      image: "/flags/cat4.webp",
      searchQuery: "heart",
      bgColor: "bg-[#faf0ee]", // Soft Peach/Coral
    },
    {
      id: 4,
      title: "SoftDrinks",
      image: "/flags/drinks.webp",
      searchQuery: "Cold & Cough",
      bgColor: "bg-[#edf6fa]", // Soft Ice Blue
    },
    {
      id: 5,
      title: "Snacks",
      image: "/flags/cat8.webp",
      searchQuery: "kidney",
      bgColor: "bg-[#faf5eb]", // Soft Warm Cream
    },
    {
      id: 6,
      title: "Dairy Products",
      image: "/flags/cat9.webp",
      searchQuery: "respiratory",
      bgColor: "bg-[#faf0f4]", // Soft Blush Pink
    },
  ];

  return (
    <div className="w-full bg-transparent py-10 md:py-14 relative overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Centered Header Block */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <span className="text-[11px] md:text-xs font-bold text-yellow-400 tracking-widest uppercase mb-1">
            Our Categories
          </span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Shop by Health Concern
          </h2>
          <div className="w-10 h-[3px] bg-yellow-400 rounded-full mt-2.5"></div>
        </div>

        {/* Carousel Window */}
        <div className="relative group/swiper px-2">
          {/* Custom Floating Navigation Buttons on Left & Right */}
          <button
            aria-label="Previous Category"
            className="cat-prev absolute top-[40%] -left-2 sm:-left-4 md:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
          >
            <IoChevronBack className="text-xl" />
          </button>

          <button
            aria-label="Next Category"
            className="cat-next absolute top-[40%] -right-2 sm:-right-4 md:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
          >
            <IoChevronForward className="text-xl" />
          </button>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={14}
            slidesPerView={3}
            loop={categories.length >= 6}
            breakpoints={{
              320: { slidesPerView: 3, spaceBetween: 12 },
              480: { slidesPerView: 4, spaceBetween: 14 },
              640: { slidesPerView: 5, spaceBetween: 16 },
              1024: { slidesPerView: 6, spaceBetween: 20 },
              1280: { slidesPerView: 6, spaceBetween: 24 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: ".cat-prev", nextEl: ".cat-next" }}
            className="category-cards-swiper !pb-2"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div
                  className="flex flex-col items-center cursor-pointer select-none group"
                  onClick={() => router.push(`/search?q=${category.searchQuery}`)}
                >
                  {/* Outer Circle Container */}
                  <div className="flex items-center justify-center w-full mb-1">
                    {/* The Circle Card Itself */}
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 ${category.bgColor} rounded-full flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] shadow-md`}
                    >
                      {/* Image directly centered inside */}
                      <div className="relative w-[70%] h-[70%] transform transition-transform duration-300 ease-out group-hover:scale-110">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                          sizes="(max-width: 768px) 25vw, 12vw"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clean Category Label Title directly below box container */}
                  <h3 className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 text-center tracking-tight px-1 line-clamp-1 group-hover:text-yellow-400 transition-colors duration-300">
                    {category.title}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Centered View All Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-slate-700 text-sm font-semibold text-slate-200 hover:border-yellow-400 hover:text-yellow-400 hover:bg-slate-900 transition-all shadow-sm"
          >
            View All Categories
            <span className="text-base font-normal">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;
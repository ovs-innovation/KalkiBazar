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
    <div className="w-full bg-white py-12 md:py-16 relative overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Centered Header Block matching the screenshot UI */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <span className="text-xs md:text-sm font-bold text-yellow-500 tracking-widest uppercase mb-1">
            Our Categories
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Shop by Health Concern
          </h2>
          <div className="w-12 h-[3px] bg-yellow-500 rounded-full mt-3"></div>
        </div>

        {/* Carousel Window */}
        <div className="relative group/swiper">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={2.2}
            breakpoints={{
              480: { slidesPerView: 3, spaceBetween: 16 },
              640: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
              1280: { slidesPerView: 6, spaceBetween: 24 },
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: ".cat-prev", nextEl: ".cat-next" }}
            className="category-cards-swiper"
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
                      className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 ${category.bgColor} rounded-full flex items-center justify-center p-5 transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)]`}
                    >
                      {/* Image directly centered inside */}
                      <div className="relative w-[65%] h-[65%] transform transition-transform duration-300 ease-out group-hover:scale-110">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.06)]"
                          sizes="(max-width: 768px) 30vw, 15vw"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clean Category Label Title directly below box container */}
                  <h3 className="mt-4 text-sm md:text-base font-bold text-slate-300 text-center tracking-tight px-1 line-clamp-1 group-hover:text-yellow-500 transition-colors duration-300">
                    {category.title}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Minimal Hover Arrow Controllers */}
          <button className="cat-prev absolute left-[-16px] top-[40%] -translate-y-1/2 w-9 h-9 z-30 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-slate-50">
            <IoChevronBack size={16} />
          </button>
          <button className="cat-next absolute right-[-16px] top-[40%] -translate-y-1/2 w-9 h-9 z-30 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-slate-50">
            <IoChevronForward size={16} />
          </button>
        </div>

        {/* Centered View All Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300 shadow-sm"
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
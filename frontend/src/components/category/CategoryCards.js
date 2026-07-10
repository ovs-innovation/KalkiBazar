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

  // Matched exactly to your assets while adopting the color schemes from the screenshot
  const categories = [
    {
      id: 1,
      title: "Diabetes",
      image: "/flags/diabetic-health.webp",
      searchQuery: "Diabetes",
      bgGradient: "bg-gradient-to-br from-[#eafaf1] to-[#d4f4e2]", // Soft Mint Green
    },
    {
      id: 2,
      title: "Orthopedic",
      image: "/flags/pain-relief.png",
      searchQuery: "Orthopedic",
      bgGradient: "bg-gradient-to-br from-[#f0ebfa] to-[#e0d6f5]", // Soft Purple
    },
    {
      id: 3,
      title: "Cardiac & Heart Care",
      image: "/flags/heart-care.webp",
      searchQuery: "heart",
      bgGradient: "bg-gradient-to-br from-[#fdf0ed] to-[#fbdad2]", // Soft Coral Pink
    },
    {
      id: 4,
      title: "Cold & Cough",
      image: "/flags/cold-caugh.png",
      searchQuery: "Cold & Cough",
      bgGradient: "bg-gradient-to-br from-[#ebf5fa] to-[#d6ebf5]", // Soft Ice Blue
    },
    {
      id: 5,
      title: "Child Care",
      image: "/flags/babycare.png",
      searchQuery: "kidney",
      bgGradient: "bg-gradient-to-br from-[#fefaf0] to-[#fdf1d6]", // Soft Warm Yellow
    },
    {
      id: 6,
      title: "Respiratory Care",
      image: "/flags/women-health.jpg",
      searchQuery: "respiratory",
      bgGradient: "bg-gradient-to-br from-[#fdf0f5] to-[#fbdbe7]", // Soft Blush Pink
    },
  ];

  return (
    <div className="w-full bg-white py-12 md:py-16 relative overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Clean, Modern Header Block matching the screenshot structure */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] tracking-tight">
              {storeCustomizationSetting?.home?.hero_title ? "Shop by Health Concerns" : "Shop by Health Concerns"}
            </h2>
          </div>

          {/* View All Linked Button */}
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-all"
          >
            View All
            <span className="text-sm font-normal">→</span>
          </button>
        </div>

        {/* Carousel Window */}
        <div className="relative group">
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
                  className="flex flex-col items-center cursor-pointer transition-all duration-300 select-none"
                  onClick={() => router.push(`/search?q=${category.searchQuery}`)}
                >
                  {/* Outer Squared Card Canvas */}
                  <div className={`w-full aspect-square ${category.bgGradient} rounded-2xl flex items-center justify-center p-4 transition-transform duration-300 hover:scale-[1.02]`}>

                    {/* Inner Centralized Circular Frame */}
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/30 backdrop-blur-[4px] flex items-center justify-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.4)]">
                      <div className="relative w-14 h-14 md:w-16 md:h-16 transform transition-transform duration-300 hover:scale-110">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
                          sizes="(max-width: 768px) 30vw, 15vw"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Clean Category Label Title directly below box container */}
                  <h3 className="mt-4 text-sm md:text-base font-bold text-slate-800 text-center tracking-tight px-1 line-clamp-1">
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
      </div>
    </div>
  );
};

export default CategoryCards;
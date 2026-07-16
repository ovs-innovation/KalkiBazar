import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";
import { getPalette } from "@utils/themeColors";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

const TrustedBrandsSection = ({ brands = [] }) => {
  const { showingTranslateValue, showingImage } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  const safeBrands = Array.isArray(brands) ? brands : [];
  const activeBrands = safeBrands.filter(brand => brand?.status === 'show');

  if (!activeBrands.length) return null;

  return (
    <div className="bg-transparent py-12 border-t border-slate-900">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {storeCustomizationSetting?.home?.brand_title || "Top Brands You Can Trust"}
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              We source our products only from authorized manufacturers and certified partners.
            </p>
          </div>
        </div>

        <div className="w-full relative py-2">
          <Swiper
            modules={[Autoplay]}
            loop={activeBrands.length > 5}
            speed={5000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 15 },
              640: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 25 },
              1280: { slidesPerView: 6, spaceBetween: 30 },
            }}
            className="brandSwiper linear-swiper"
          >
            {activeBrands.map((brand) => {
              const isLegacy = brand.logo && (brand.logo.includes('res.cloudinary.com/ahossain/') || brand.logo.includes('res.cloudinary.com/dhqcwkpzp/'));
              const logoUrl = brand.logo && brand.logo.trim() !== '' && !isLegacy ? showingImage(brand.logo) : null;

              return (
                <SwiperSlide key={brand._id}>
                  <Link
                    href={`/search?brand=${brand._id}`}
                    className="block group cursor-pointer"
                  >
                    {logoUrl ? (
                      <div
                        className="rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 h-24 md:h-28 flex items-center justify-center border border-transparent relative overflow-hidden"
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <Image
                          src={logoUrl}
                          alt={showingTranslateValue(brand.name) || "Brand"}
                          fill
                          sizes="(max-width: 768px) 120px, 160px"
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-900/60 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 transition-all duration-300 h-24 md:h-28 flex flex-col items-center justify-center border border-slate-800 hover:border-yellow-500/30 relative overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-1 text-yellow-400 transition-colors group-hover:bg-slate-700">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span className="text-xs md:text-sm font-bold text-slate-300 group-hover:text-yellow-500 transition-colors text-center line-clamp-1 px-1">
                          {showingTranslateValue(brand.name) || "Brand"}
                        </span>
                        <span className="text-[7px] uppercase tracking-widest text-slate-400 font-extrabold mt-0.5">
                          PARTNER
                        </span>
                      </div>
                    )}
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TrustedBrandsSection;

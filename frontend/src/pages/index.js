import { useContext, useEffect } from "react";
import { UserContext } from "@context/UserContext";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward, IoSparkles } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

//internal import
import { SidebarContext } from "@context/SidebarContext";
import Layout from "@layout/Layout";
import Banner from "@components/banner/Banner";
import useGetSetting from "@hooks/useGetSetting";
import OfferCard from "@components/offer/OfferCard";
import Loading from "@components/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import PersonalCareProductCard from "@components/product/PersonalCareProductCard";
import HeroBanner from "@components/banner/HeroBanner";
import OrderOptions from "@components/cta-card/OrderOptions";
import FeatureCategory from "@components/category/FeatureCategory";
import HealthCheckupBanner from "@components/banner/HealthCheckupBanner";
import CategoryCards from "@components/category/CategoryCards";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import BrandSection from "@components/brand/BrandSection";
import TrustedBrandsSection from "@components/brand/TrustedBrandsSection";
import BrandServices from "@services/BrandServices";
import SectionHeader from "@components/common/SectionHeader";
import SliderCarousel from "@components/carousel/SliderCarousel";
import TestimonialsSection from "@components/testimonial/TestimonialsSection";
import DealsYouLove from "@components/carousel/DealsYouLove";
import Features from "@components/Features/Features";

const SuggestedProducts = dynamic(() => import("@components/product/SuggestedProducts"), {
  ssr: false,
});

const Home = ({ popularProducts, discountProducts, bestSellingProducts, attributes, brands, personalCareProducts }) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { state } = useContext(UserContext) || {};
  const isWholesaler = state?.userInfo?.role && state.userInfo.role.toString().toLowerCase() === "wholesaler";
  const { loading, error, storeCustomizationSetting } = useGetSetting();

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
            {/* Hero Banner — full bleed, outside max-width container */}
            <div className="w-full bg-transparent">
              <HeroBanner />
            </div>

            <div className="bg-transparent">
              <div className="mx-auto max-w-screen-2xl">
                <div className="flex w-full flex-col">
                  {/* Slider Carousel */}
                  <div className="md:hidden">
                    <SliderCarousel />
                  </div>
                  <div className="w-full">
                    <OrderOptions />
                  </div>
                  {/* Slider Carousel */}
                  <div className="hidden md:block">
                    <SliderCarousel />
                  </div>
                </div>

              </div>
            </div>
            {/* Category Cards Section */}
            <CategoryCards />


            {/* feature category's */}
            {storeCustomizationSetting?.home?.featured_status && (
              <div id="feature-category" className="lg:py-12 pt-6 pb-10">
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                  <div className="flex flex-row justify-between items-end mb-4">
                    {/* <div className="flex-1">
                      <SectionHeader
                        title={storeCustomizationSetting?.home?.feature_title || "Featured Categories"}
                        subtitle={storeCustomizationSetting?.home?.feature_description || "Explore our handpicked selection of featured categories"}
                        loading={loading}
                        error={error}
                        align="left"
                      />
                    </div> */}
                    {/* <Link
                      href="/categories"
                      className="border border-violet-600 text-violet-600 font-bold rounded-full px-4 md:px-6 py-1.5 md:py-2 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-violet-200 text-xs md:text-sm whitespace-nowrap flex-shrink-0 mb-1 ml-2"
                    >
                      View All <span className="ml-1 text-base">&gt;</span>
                    </Link> */}
                  </div>
                  <FeatureCategory attributes={attributes} />
                </div>
              </div>
            )}

            {/* best selling products */}
            {bestSellingProducts?.length > 0 && (
              <div className="relative lg:py-24 py-12 overflow-hidden">
                {/* Background Decorative Blobs - Creates the "Mesh" look */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                  <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-yellow-950/20 rounded-full blur-[120px]" />
                  <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-yellow-950/20 rounded-full blur-[100px]" />
                </div>

                <div className="mx-auto max-w-screen-2xl px-4 sm:px-12 relative z-10">
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 text-white text-[11px] font-extrabold uppercase tracking-widest">
                        <IoSparkles className="animate-pulse text-yellow-300" />
                        <span>Popular Choice</span>
                      </div>
                      <SectionHeader
                        title={storeCustomizationSetting?.home?.best_selling_title || "Best Selling Products"}
                        subtitle={storeCustomizationSetting?.home?.best_selling_description || "Explore our top-rated essentials, loved by thousands of customers."}
                        align="left"
                      />
                    </div>

                    <Link
                      href="/search?sort=best-selling"
                      className="group flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-yellow-800 transition-all"
                    >
                      Explore All
                      <div className="p-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover:bg-yellow-600 group-hover:text-white transition-all">
                        <IoChevronForward />
                      </div>
                    </Link>
                  </div>

                  {/* Slider Area */}
                  <div className="relative group/slider">
                    <div className="relative px-2">
                      {/* Custom Floating Navigation Buttons on Left & Right */}
                      <button
                        aria-label="Previous Slide"
                        className="prev-best-selling absolute top-1/2 -left-2 sm:-left-4 md:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                      >
                        <IoChevronBack className="text-xl" />
                      </button>

                      <button
                        aria-label="Next Slide"
                        className="next-best-selling absolute top-1/2 -right-2 sm:-right-4 md:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                      >
                        <IoChevronForward className="text-xl" />
                      </button>

                      <div className="w-full">
                        <Swiper
                          modules={[Navigation, Autoplay]}
                          spaceBetween={14}
                          slidesPerView={2}
                          loop={(bestSellingProducts?.length || 0) >= 5}
                          navigation={{
                            prevEl: ".prev-best-selling",
                            nextEl: ".next-best-selling",
                          }}
                          autoplay={{
                            delay: 4000,
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
                          className="mySwiper !pb-8 !pt-3"
                        >
                          {(isWholesaler
                            ? bestSellingProducts.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler)
                            : bestSellingProducts
                          )
                            ?.slice(0, 10)
                            .map((product) => (
                              <SwiperSlide key={product._id}>
                                <div className="h-full transform hover:-translate-y-2 transition-transform duration-500">
                                  <ProductCard
                                    product={product}
                                    attributes={attributes}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Suggested For You Section */}
            <div className="lg:py-12 py-10">
              <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                <SuggestedProducts />
              </div>
            </div>
            {/* Deals You'll Love Section */}
            {/* Do not render deals section for wholesalers */}
            {!isWholesaler && discountProducts?.length > 0 && (
              <DealsYouLove products={discountProducts} />
            )}

            {/* Personal Care Section */}
            {personalCareProducts && personalCareProducts.length > 0 && (
              <div className="relative lg:py-24 py-12 overflow-hidden bg-transparent">
                {/* Background Decorative Blobs */}
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-12 relative z-10">
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-700/80 to-amber-600/70 text-white text-[11px] font-extrabold uppercase tracking-widest">
                        <IoSparkles className="animate-pulse text-yellow-300" />
                        <span>Kitchen Needs</span>
                      </div>
                      <SectionHeader
                        title="Kitchen Essentials"
                        subtitle="Explore our range of premium essentials crafted for your daily routine."
                        align="left"
                      />
                    </div>

                    <Link
                      href="/search?category=Personal-Care"
                      className="group flex items-center gap-2 text-sm font-bold text-yellow-600 hover:text-yellow-800 transition-all"
                    >
                      Explore All
                      <div className="p-2 rounded-full bg-slate-900 shadow-sm border border-slate-800 group-hover:bg-yellow-700 group-hover:text-white transition-all text-white">
                        <IoChevronForward />
                      </div>
                    </Link>
                  </div>

                  {/* Slider Area */}
                  <div className="relative group/slider">
                    <div className="relative px-2">
                      {/* Navigation buttons */}
                      <button
                        aria-label="Previous Slide"
                        className="prev-personal-care absolute top-1/2 -left-2 sm:-left-4 md:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                      >
                        <IoChevronBack className="text-xl" />
                      </button>

                      <button
                        aria-label="Next Slide"
                        className="next-personal-care absolute top-1/2 -right-2 sm:-right-4 md:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                      >
                        <IoChevronForward className="text-xl" />
                      </button>

                      <div className="w-full">
                        <Swiper
                          modules={[Navigation, Autoplay]}
                          spaceBetween={14}
                          slidesPerView={2}
                          loop={personalCareProducts.length >= 5}
                          navigation={{
                            prevEl: ".prev-personal-care",
                            nextEl: ".next-personal-care",
                          }}
                          autoplay={{
                            delay: 4500,
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
                          className="mySwiper !pb-8 !pt-3"
                        >
                          {(isWholesaler
                            ? personalCareProducts.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler)
                            : personalCareProducts
                          )
                            ?.slice(0, 10)
                            .map((product) => (
                              <SwiperSlide key={product._id}>
                                <div className="h-full transform hover:-translate-y-2 transition-transform duration-500">
                                  <PersonalCareProductCard
                                    product={product}
                                    attributes={attributes}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* popular products */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div className="lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
                <SectionHeader
                  title={storeCustomizationSetting?.home?.popular_title || "Popular Products"}
                  subtitle={storeCustomizationSetting?.home?.popular_description || "Discover our most loved and trending products"}
                  loading={loading}
                  error={error}
                  align="left"
                />
                <div className="flex w-full relative group/slider px-2 py-4">
                  <div className="w-full relative">
                    <button
                      aria-label="Previous Slide"
                      className="prev-popular absolute top-1/2 -left-2 sm:-left-4 md:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                    >
                      <IoChevronBack className="text-xl" />
                    </button>
                    <button
                      aria-label="Next Slide"
                      className="next-popular absolute top-1/2 -right-2 sm:-right-4 md:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                    >
                      <IoChevronForward className="text-xl" />
                    </button>

                    <div className="w-full">
                      <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={14}
                        slidesPerView={2}
                        loop={(popularProducts?.length || 0) >= 5}
                        navigation={{
                          prevEl: ".prev-popular",
                          nextEl: ".next-popular",
                        }}
                        autoplay={{
                          delay: 3000,
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
                        className="mySwiper px-2 py-2"
                      >
                        {(isWholesaler ? popularProducts.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler) : popularProducts)
                          ?.slice(
                            0,
                            storeCustomizationSetting?.home
                              ?.popular_product_limit
                          )
                          .map((product) => (
                            <SwiperSlide key={product._id}>
                              <div className="h-full transform hover:-translate-y-1 transition-transform duration-300">
                                <ProductCard
                                  product={product}
                                  attributes={attributes}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                      </Swiper>
                    </div>

                      <div className="flex justify-end mt-4 px-2">
                        <Link href="/search?sort=newest" className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-400 border border-yellow-400/50 rounded-full px-4 py-1 hover:bg-yellow-400 hover:text-slate-950 transition-colors">
                          View All <IoChevronForward />
                        </Link>
                      </div>
                  </div>
                </div>
              </div>
            )}



            {/* <div className="w-full px-3 sm:px-10">
                    <HealthCheckupBanner />
                  </div> */}

            {/* //  promotional banner card */}
            {storeCustomizationSetting?.home?.delivery_status &&
              (storeCustomizationSetting?.home?.promotional_banner_image1 ||
                storeCustomizationSetting?.home?.promotional_banner_image2 ||
                storeCustomizationSetting?.home?.promotional_banner_image3) && (
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
                  <div className="shadow-sm border rounded-lg p-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {storeCustomizationSetting?.home?.promotional_banner_image1 && (
                        <div className="md:col-span-2">
                          <Link href={
                            storeCustomizationSetting?.home?.promotional_banner_productSlug1
                              ? `/product/${storeCustomizationSetting.home.promotional_banner_productSlug1}`
                              : storeCustomizationSetting?.home?.promotional_banner_categorySlug1
                                ? `/search?category=${storeCustomizationSetting.home.promotional_banner_categorySlug1}${storeCustomizationSetting.home.promotional_banner_categoryId1 ? `&_id=${storeCustomizationSetting.home.promotional_banner_categoryId1}` : ""}`
                                : (storeCustomizationSetting?.home?.promotional_banner_link1 || "#")
                          }>
                            <Image
                              width={500}
                              height={48}
                              alt="Offer Banner 1"
                              className="w-full h-[240px] sm:h-[320px] md:h-[550px] rounded object-cover"
                              src={storeCustomizationSetting?.home?.promotional_banner_image1}
                              priority={false}
                            />
                          </Link>
                        </div>
                      )}

                      <div className="md:col-span-1 flex flex-col gap-2">
                        {storeCustomizationSetting?.home?.promotional_banner_image2 && (
                          <Link href={
                            storeCustomizationSetting?.home?.promotional_banner_productSlug2
                              ? `/product/${storeCustomizationSetting.home.promotional_banner_productSlug2}`
                              : storeCustomizationSetting?.home?.promotional_banner_categorySlug2
                                ? `/search?category=${storeCustomizationSetting.home.promotional_banner_categorySlug2}${storeCustomizationSetting.home.promotional_banner_categoryId2 ? `&_id=${storeCustomizationSetting.home.promotional_banner_categoryId2}` : ""}`
                                : (storeCustomizationSetting?.home?.promotional_banner_link2 || "#")
                          }>
                            <Image
                              width={500}
                              height={100}
                              alt="Offer Banner 2"
                              className="w-full h-[160px] sm:h-[200px] md:h-[271px] rounded object-cover"
                              src={storeCustomizationSetting?.home?.promotional_banner_image2}
                              priority={false}
                            />
                          </Link>
                        )}
                        {storeCustomizationSetting?.home?.promotional_banner_image3 && (
                          <Link href={
                            storeCustomizationSetting?.home?.promotional_banner_productSlug3
                              ? `/product/${storeCustomizationSetting.home.promotional_banner_productSlug3}`
                              : storeCustomizationSetting?.home?.promotional_banner_categorySlug3
                                ? `/search?category=${storeCustomizationSetting.home.promotional_banner_categorySlug3}${storeCustomizationSetting.home.promotional_banner_categoryId3 ? `&_id=${storeCustomizationSetting.home.promotional_banner_categoryId3}` : ""}`
                                : (storeCustomizationSetting?.home?.promotional_banner_link3 || "#")
                          }>
                            <Image
                              width={600}
                              height={600}
                              alt="Offer Banner 3"
                              className="w-full h-[160px] sm:h-[200px] md:h-[271px] rounded object-cover"
                              src={storeCustomizationSetting?.home?.promotional_banner_image3}
                              priority={false}
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}



            {/* discounted products */}
            {storeCustomizationSetting?.home?.discount_product_status &&
              discountProducts?.length > 0 && (
                <div
                  id="discount"
                  className="lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
                >
                  <SectionHeader
                    title={storeCustomizationSetting?.home?.latest_discount_title || "Discounted Products"}
                    subtitle={storeCustomizationSetting?.home?.latest_discount_description || "Grab amazing deals on our discounted products"}
                    loading={loading}
                    error={error}
                    align="left"
                  />
                  <div className="flex w-full relative group/slider px-2 py-4">
                    <div className="w-full relative">
                      {/* Left & Right Slide Buttons */}
                      <button
                        aria-label="Previous Slide"
                        className="prev-discount absolute top-1/2 -left-2 sm:-left-4 md:-left-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                      >
                        <IoChevronBack className="text-xl" />
                      </button>

                      <button
                        aria-label="Next Slide"
                        className="next-discount absolute top-1/2 -right-2 sm:-right-4 md:-right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 text-white hover:bg-yellow-400 hover:text-slate-950 border border-slate-700/80 hover:border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transform -translate-y-1/2"
                      >
                        <IoChevronForward className="text-xl" />
                      </button>

                      <div className="w-full">
                        <Swiper
                          modules={[Navigation, Autoplay]}
                          spaceBetween={14}
                          slidesPerView={2}
                          loop={(discountProducts?.length || 0) >= 5}
                          navigation={{
                            prevEl: ".prev-discount",
                            nextEl: ".next-discount",
                          }}
                          autoplay={{
                            delay: 3000,
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
                          className="mySwiper px-2 py-2"
                        >
                          {(isWholesaler ? discountProducts.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler) : discountProducts)
                            ?.slice(
                              0,
                              storeCustomizationSetting?.home
                                ?.latest_discount_product_limit
                            )
                            .map((product) => (
                              <SwiperSlide key={product._id}>
                                <div className="h-full transform hover:-translate-y-1 transition-transform duration-300">
                                  <ProductCard
                                    product={product}
                                    attributes={attributes}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                        </Swiper>
                      </div>

                        <div className="flex justify-end mt-4 px-2">
                          <Link href={`/search?category=${storeCustomizationSetting?.home?.discount_categorySlug}${storeCustomizationSetting?.home?.discount_categoryId ? `&_id=${storeCustomizationSetting?.home?.discount_categoryId}` : ""}`} className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-400 border border-yellow-400/50 rounded-full px-4 py-1 hover:bg-yellow-400 hover:text-slate-950 transition-colors">
                            View All <IoChevronForward />
                          </Link>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            {/* Trusted Brands Section */}
            <TrustedBrandsSection brands={brands} />

            <Features />

            {/* Testimonials Section */}
            {/* <TestimonialsSection /> */}
          </div>
        </Layout>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  const [dataResult, attributesResult, brandsResult, personalCareResult] = await Promise.allSettled([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),
    AttributeServices.getShowingAttributes(),
    BrandServices.getShowingBrands(),
    ProductServices.getShowingStoreProducts({
      category: "Personal Care",
    }),
  ]);

  const data = dataResult.status === "fulfilled" ? dataResult.value : null;
  const attributes =
    attributesResult.status === "fulfilled" ? attributesResult.value : [];
  const brands = brandsResult.status === "fulfilled" ? brandsResult.value : [];
  const personalCareData = personalCareResult.status === "fulfilled" ? personalCareResult.value : null;
  const personalCareProducts = personalCareData?.products || [];

  if (dataResult.status === "rejected") {
    console.warn(
      "getServerSideProps: products fetch failed.",
      dataResult.reason?.message || dataResult.reason
    );
  }

  return {
    props: {
      attributes: attributes || [],
      cookies: cookies,
      popularProducts: data?.popularProducts || [],
      discountProducts: data?.discountedProducts || [],
      bestSellingProducts: data?.bestSellingProducts || [],
      brands: brands || [],
      personalCareProducts: personalCareProducts,
    },
  };
};

export default Home;


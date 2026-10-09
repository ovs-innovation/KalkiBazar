import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { useRef, useEffect, useState } from "react";

//internal import

import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import MobileBottomNavigation from "@layout/footer/MobileBottomNavigation";
import FeatureCard from "@components/feature-card/FeatureCard";
import useGetSetting from "@hooks/useGetSetting";
import { getPalette, DEFAULT_STORE_COLOR } from "@utils/themeColors";
import useCartSync from "@hooks/useCartSync";
import FloatingWhatsApp from "@components/common/FloatingWhatsApp";
import { pickBrandLogo } from "@utils/brandAssets";

const Layout = ({ title, description, children, hideMobileHeader }) => {
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const storeColor = "yellow";
  const palette = getPalette(storeColor);

  // Sync prescription medicines to cart
  useCartSync();

  // Get dynamic title and favicon from settings
  const siteTitle = "KalkiBazar";
  const favicon = pickBrandLogo(
    storeCustomizationSetting?.seo?.favicon,
    globalSetting?.logo,
    storeCustomizationSetting?.navbar?.logo
  );
  const defaultDescription =
    storeCustomizationSetting?.seo?.meta_description ||
    description ||
    "Discover personalized merchandise, branded giveaways, and advertising essentials. Ideal for businesses, events, and promotions";

  const hexToRgb = (hex) => {
    if (!hex) return "20, 184, 166";
    const cleaned = hex.replace("#", "");
    if (cleaned.length === 3) {
      const expanded = cleaned.split("").map(c => c + c).join("");
      const num = parseInt(expanded, 16);
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    }
    if (cleaned.length === 6) {
      const num = parseInt(cleaned, 16);
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    }
    return "20, 184, 166";
  };

  return (
    <>
      <div className="font-sans min-h-screen">
        <Head>
          <style>
            {`
              :root {
                --store-color-50: ${palette[50]};
                --store-color-100: ${palette[100]};
                --store-color-200: ${palette[200]};
                --store-color-300: ${palette[300]};
                --store-color-400: ${palette[400]};
                --store-color-500: ${palette[500]};
                --store-color-600: ${palette[600]};
                --store-color-700: ${palette[700]};
                --store-color-800: ${palette[800]};
                --store-color-900: ${palette[900]};
                --store-color-rgb: ${palette[500]?.startsWith("#") ? hexToRgb(palette[500]) : "20, 184, 166"};
              }
            `}
          </style>
          <title>
            {title ? `${siteTitle} | ${title}` : siteTitle}
          </title>
          <meta name="description" content={description || defaultDescription} />
          <link rel="icon" href="/favicon.png?v=2" />
          <link rel="shortcut icon" href="/favicon.png?v=2" />
          <link rel="apple-touch-icon" href="/favicon.png?v=2" />
        </Head>

        {/* Mobile header (fixed top, hidden on desktop) */}
        {!hideMobileHeader && <MobileFooter />}
        {!hideMobileHeader && <MobileBottomNavigation />}

        {/* Desktop unified header — clean, single-row, sticky at the top */}
        <div className="hidden lg:block sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl shadow-md">
          <Navbar />
        </div>

        {/* Page content */}
        <div className={`${hideMobileHeader ? "pt-0" : "pt-16"} lg:pt-0 pb-16 lg:pb-0`}>
          {children}
        </div>

        <div className="w-full">
          <div className="w-full">
            <Footer />
          </div>
        </div>

        <FloatingWhatsApp />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Layout;
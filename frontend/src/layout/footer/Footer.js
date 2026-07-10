import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { IoArrowForward } from "react-icons/io5";
import {
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FaInstagram } from "react-icons/fa";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronRight,
  FiChevronDown,
  FiFileText,
  FiShield,
  FiRefreshCw,
  FiTruck,
  FiUser,
  FiShoppingBag,
  FiPackage,
  FiSettings,
  FiMessageSquare,
} from "react-icons/fi";

//internal import
import { getUserSession } from "@lib/auth";
import useGetSetting from "@hooks/useGetSetting";
import { pickBrandLogo } from "@utils/brandAssets";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import FeatureCard from "@components/feature-card/FeatureCard";
import NewsletterServices from "@services/NewsletterServices";
import { notifySuccess, notifyError } from "@utils/toast";

const Footer = () => {
  const { t } = useTranslation();
  const userInfo = getUserSession();

  const { showingTranslateValue } = useUtilsFunction();
  const { loading, storeCustomizationSetting, globalSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  const [email, setEmail] = useState("");
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);

  // State for collapsible sections on mobile (only first 3 blocks)
  const [openSections, setOpenSections] = useState({
    block1: false,
    block2: false,
    block3: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // SafeLink: render a Next <Link> only when href is provided, otherwise render a span
  // This prevents Next Link prop-type errors when CMS settings don't include a URL
  const SafeLink = ({ href, children, ...props }) => {
    if (!href) {
      // remove props that are only valid on anchor elements
      const { target, rel, ...safeProps } = props;
      return <span {...safeProps}>{children}</span>;
    }

    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      notifyError("Please enter your email address!");
      return;
    }
    setLoadingSubscribe(true);
    try {
      await NewsletterServices.addNewsletter({ email });
      notifySuccess("Subscribed Successfully!");
      setEmail("");
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
    }
    setLoadingSubscribe(false);
  };

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-neutral-100 text-neutral-800 border-t border-neutral-200 relative overflow-hidden">
      {/* Modern Minimalist Gradient Header Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-store-400 via-store-500 to-teal-500"></div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* Feature Top Bar */}
        <div className="py-6 hidden md:block border-b border-store-500">
          <FeatureCard />
        </div>

        {/* Main Grid: Split Layout (1/3 Brand + 2/3 Navigation) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-16">

          {/* Brand & Contact Column (Takes 4/12 width on large screens) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group inline-flex" rel="noreferrer">
              <span className="kalki-logo-badge flex items-center justify-center w-11 h-11 rounded-2xl shadow-md shadow-store-500/10 transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-4H7v-2h4V5h2v4h4v2h-4v4z" fill="white" />
                </svg>
              </span>
              <span className="flex flex-col leading-none">
                <span className="kalki-logo-text font-black tracking-tight text-xl text-slate-900">
                  Kalki<span className="kalki-logo-accent text-store-600">Brand</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mt-1">Pharmacy</span>
              </span>
            </Link>

            {storeCustomizationSetting?.footer?.block4_status && (
              <div className="bg-white/80 backdrop-blur-md border border-neutral-200/60 p-5 rounded-2xl shadow-sm space-y-4 hover:border-store-200 hover:shadow-lg transition-all duration-300">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Registered Office</h4>
                  {loading ? (
                    <CMSkeleton count={1} height={20} loading={true} />
                  ) : globalSetting?.company_name ? (
                    <p className="text-base font-bold text-neutral-800">{globalSetting.company_name}</p>
                  ) : null}
                </div>

                <div className="space-y-2.5 text-sm text-neutral-600 font-sans">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-4 h-4 text-store-500 flex-shrink-0 mt-1" />
                    <div className="leading-relaxed">
                      <CMSkeleton
                        count={1}
                        height={40}
                        loading={loading}
                        data={storeCustomizationSetting?.footer?.block4_address}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group/item">
                    <FiPhone className="w-4 h-4 text-neutral-400 group-hover/item:text-store-500 transition-colors" />
                    <a href={`tel:${storeCustomizationSetting?.footer?.block4_phone}`} className="hover:text-store-600 hover:underline transition-colors">
                      {storeCustomizationSetting?.footer?.block4_phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 group/item">
                    <FiMail className="w-4 h-4 text-neutral-400 group-hover/item:text-store-500 transition-colors" />
                    <a href={`mailto:${storeCustomizationSetting?.footer?.block4_email}`} className="hover:text-store-600 hover:underline break-all transition-colors">
                      {storeCustomizationSetting?.footer?.block4_email}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Columns (Takes 8/12 width on large screens) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            {/* Block 1 */}
            {storeCustomizationSetting?.footer?.block1_status && (
              <div className="border-b border-neutral-200 md:border-0 pb-4 md:pb-0">
                <button
                  onClick={() => toggleSection("block1")}
                  className="w-full flex items-center justify-between py-2 md:py-0 md:pointer-events-none mb-2"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    <CMSkeleton count={1} height={20} loading={loading} data={storeCustomizationSetting?.footer?.block1_title} />
                  </h3>
                  <FiChevronDown className={`w-5 h-5 text-neutral-500 md:hidden transition-transform duration-300 ${openSections.block1 ? "rotate-180" : ""}`} />
                </button>
                <ul className={`text-sm flex flex-col space-y-3 overflow-hidden transition-all duration-300 ${openSections.block1 ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"} md:max-h-none md:opacity-100`}>
                  {['1', '2', '3', '4'].map((num) => (
                    <li key={num} className="group">
                      <SafeLink href={storeCustomizationSetting?.footer?.[`block1_sub_link${num}`]} className="text-neutral-600 hover:text-store-600 flex items-center transition-colors duration-200">
                        <span className="h-0.5 w-0 bg-store-500 rounded-full transition-all duration-200 group-hover:w-3 group-hover:mr-2"></span>
                        <CMSkeleton count={1} height={16} loading={loading} data={storeCustomizationSetting?.footer?.[`block1_sub_title${num}`]} />
                      </SafeLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Block 2 */}
            {storeCustomizationSetting?.footer?.block2_status && (
              <div className="border-b border-neutral-200 md:border-0 pb-4 md:pb-0">
                <button
                  onClick={() => toggleSection("block2")}
                  className="w-full flex items-center justify-between py-2 md:py-0 md:pointer-events-none mb-2"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    <CMSkeleton count={1} height={20} loading={loading} data={storeCustomizationSetting?.footer?.block2_title} />
                  </h3>
                  <FiChevronDown className={`w-5 h-5 text-neutral-500 md:hidden transition-transform duration-300 ${openSections.block2 ? "rotate-180" : ""}`} />
                </button>
                <ul className={`text-sm flex flex-col space-y-3 overflow-hidden transition-all duration-300 ${openSections.block2 ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"} md:max-h-none md:opacity-100`}>
                  {[
                    { n: '1', icon: FiFileText },
                    { n: '2', icon: FiShield },
                    { n: '3', icon: FiRefreshCw },
                    { n: '4', icon: FiTruck }
                  ].map((item) => (
                    <li key={item.n} className="group">
                      <Link href={`${storeCustomizationSetting?.footer?.[`block2_sub_link${item.n}`]}`} className="text-neutral-600 hover:text-store-600 flex items-center transition-colors duration-200">
                        <item.icon className="w-4 h-4 mr-2 text-neutral-400 group-hover:text-store-500 transition-colors" />
                        <CMSkeleton count={1} height={16} loading={loading} data={storeCustomizationSetting?.footer?.[`block2_sub_title${item.n}`]} />
                      </Link>
                    </li>
                  ))}
                  <li className="group">
                    <Link href="/faq" className="text-neutral-600 hover:text-store-600 flex items-center transition-colors duration-200">
                      <FiMessageSquare className="w-4 h-4 mr-2 text-neutral-400 group-hover:text-store-500 transition-colors" />
                      <span>FAQ</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Block 3 */}
            {storeCustomizationSetting?.footer?.block3_status && (
              <div className="pb-4 md:pb-0">
                <button
                  onClick={() => toggleSection("block3")}
                  className="w-full flex items-center justify-between py-2 md:py-0 md:pointer-events-none mb-2"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    <CMSkeleton count={1} height={20} loading={loading} data={storeCustomizationSetting?.footer?.block3_title} />
                  </h3>
                  <FiChevronDown className={`w-5 h-5 text-neutral-500 md:hidden transition-transform duration-300 ${openSections.block3 ? "rotate-180" : ""}`} />
                </button>
                <ul className={`text-sm flex flex-col space-y-3 overflow-hidden transition-all duration-300 ${openSections.block3 ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"} md:max-h-none md:opacity-100`}>
                  {[
                    { n: '1', icon: FiSettings },
                    { n: '2', icon: FiPackage },
                    { n: '3', icon: FiShoppingBag },
                    { n: '4', icon: FiUser }
                  ].map((item) => (
                    <li key={item.n} className="group">
                      <Link href={storeCustomizationSetting?.footer?.[`block3_sub_link${item.n}`]} className="text-neutral-600 hover:text-store-600 flex items-center transition-colors duration-200">
                        <item.icon className="w-4 h-4 mr-2 text-neutral-400 group-hover:text-store-500 transition-colors" />
                        <CMSkeleton count={1} height={16} loading={loading} data={storeCustomizationSetting?.footer?.[`block3_sub_title${item.n}`]} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Utilities & Media Sub-Footer Row */}
        <div className="py-8 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

            {/* Social Badges */}
            {storeCustomizationSetting?.footer?.social_links_status && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Connect With Us</h3>
                <ul className="flex flex-wrap gap-2.5">
                  {[
                    { key: 'social_facebook', Icon: FacebookIcon },
                    { key: 'social_twitter', Icon: TwitterIcon },
                    { key: 'social_linkedin', Icon: LinkedinIcon },
                    { key: 'social_whatsapp', Icon: WhatsappIcon }
                  ].map((item) => storeCustomizationSetting?.footer?.[item.key] && (
                    <li key={item.key}>
                      <Link href={`${storeCustomizationSetting?.footer?.[item.key]}`} aria-label="Social Link" rel="noreferrer" target="_blank" className="block transition-transform duration-200 hover:-translate-y-1">
                        <item.Icon size={36} round className="shadow-sm hover:shadow-md transition-shadow" />
                      </Link>
                    </li>
                  ))}
                  {storeCustomizationSetting?.footer?.social_instagram && (
                    <li>
                      <Link href={`${storeCustomizationSetting?.footer?.social_instagram}`} aria-label="Social Link" rel="noreferrer" target="_blank" className="block transition-transform duration-200 hover:-translate-y-1">
                        <div className="w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 hover:shadow-md">
                          <FaInstagram size={22} style={{ color: "#E4405F" }} />
                        </div>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Mobile App Downloads */}
            {(storeCustomizationSetting?.home?.daily_need_app_link || storeCustomizationSetting?.home?.daily_need_google_link) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Experience On Mobile</h3>
                <div className="flex gap-2.5 items-center">
                  <Link href={storeCustomizationSetting?.home?.daily_need_app_link || "#"}>
                    <div className="w-[135px] h-[40px] opacity-90 hover:opacity-100 transition-opacity">
                      <Image width={135} height={40} className="w-full h-full object-contain rounded-lg" src={storeCustomizationSetting?.home?.button1_img || "/app/app-store.svg"} alt="App Store" />
                    </div>
                  </Link>
                  <Link href={storeCustomizationSetting?.home?.daily_need_google_link || "#"}>
                    <div className="w-[135px] h-[40px] opacity-90 hover:opacity-100 transition-opacity">
                      <Image width={135} height={40} className="w-full h-full object-contain rounded-lg" src={storeCustomizationSetting?.home?.button2_img || "/app/play-store.svg"} alt="Play Store" />
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Payment Partner Secure Badge */}
            {storeCustomizationSetting?.footer?.payment_method_status && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">100% Secure Gateway</h3>
                <div className="bg-white border border-neutral-200/60 inline-flex items-center justify-center p-2 rounded-xl px-4 shadow-sm">
                  <Image
                    width={120}
                    height={32}
                    className="h-8 w-auto object-contain"
                    src={storeCustomizationSetting?.footer?.payment_method_img || "/payment-method/razorpay_logo.svg"}
                    alt="Payment system"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Elegant Copyright Row */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-neutral-200 text-xs text-neutral-500 gap-3">
          <p className="text-center md:text-left order-2 md:order-1">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="text-neutral-800 font-semibold hover:text-store-600 transition-colors">
              Kalki Brand
            </Link>
            . All rights reserved.
          </p>
          <p className="text-center md:text-right flex items-center gap-1 order-1 md:order-2">
            <span>Engineered gracefully by</span>
            <a href="https://vastoratech.com/" target="_blank" rel="noopener noreferrer" className="text-store-600 font-bold hover:underline">
              Vastora Tech
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Footer), { ssr: false });

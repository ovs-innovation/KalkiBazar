import Link from "next/link";
import Image from "next/image";
import useGetSetting from "@hooks/useGetSetting";
import { pickBrandLogo } from "@utils/brandAssets";
import { FiShield, FiTruck, FiClock } from "react-icons/fi";

const TRUST_ITEMS = [
  { icon: FiShield, text: "Secure OTP" },
  { icon: FiTruck, text: "Fast Delivery" },
  { icon: FiClock, text: "Under 1 Min" },
];

/**
 * Clean, lightweight, and ultra-minimal wrapper shell for authentication routes.
 */
const AuthPageShell = ({
  title,
  subtitle,
  children,
  footer,
  alternateLink,
  badge,
}) => {
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const shopName = globalSetting?.shop_name || "Kalki Brand";
  const logoSrc = pickBrandLogo(
    storeCustomizationSetting?.navbar?.logo,
    storeCustomizationSetting?.seo?.favicon,
    globalSetting?.logo
  );

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col items-center justify-center px-4 py-12 sm:px-6">

      {/* Central Card Wrapper */}
      <div className="w-full max-w-[460px] bg-white border border-slate-200/60 rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.02)] p-6 sm:p-8 space-y-6">

        {/* Header Block: Brand Logo & Strategic Minimal Trust Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <Link href="/" className="inline-flex flex-col">
              <span className="text-lg font-black tracking-tight text-teal-900">
                Kalki<span className="text-store-600 font-medium">Brand</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-slate-400 mt-0.5">
                Pharmacy
              </span>
            </Link>
          </div>

          {/* Inline Micro Badges */}
          <div className="flex items-center gap-3">
            {TRUST_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex items-center gap-1 text-slate-400" title={item.text}>
                  <IconComponent className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium text-slate-500 hidden xs:inline">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Title Context Group */}
        <div className="space-y-1">
          {badge && (
            <span className="inline-block rounded bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
              {badge}
            </span>
          )}
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 leading-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content Injection (The main Form parameters) */}
        <div className="py-1">
          {children}
        </div>

        {/* Clean Alternate Footnote Interface Block */}
        {(alternateLink || footer) && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            {alternateLink && (
              <p className="text-center text-xs text-slate-500">
                {alternateLink.text}{" "}
                <Link
                  href={alternateLink.href}
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {alternateLink.label}
                </Link>
              </p>
            )}
            {footer && <div className="text-[10px] text-slate-400 text-center leading-normal">{footer}</div>}
          </div>
        )}

      </div>

      {/* Global Minimal Copy Note */}
      <p className="text-[11px] text-slate-400 font-medium mt-6">
        &copy; {new Date().getFullYear()} {shopName}. Secure Gateway.
      </p>

    </div>
  );
};

export default AuthPageShell;
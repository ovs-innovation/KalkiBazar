import Link from "next/link";
import Image from "next/image";
import useGetSetting from "@hooks/useGetSetting";
import { pickBrandLogo } from "@utils/brandAssets";
import { FiShield, FiTruck, FiClock } from "react-icons/fi";
import kalkiBazar from "../../../public/logo/kalkiBazar.png";

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12 sm:px-6 relative overflow-hidden">
      {/* Background Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Central Card Wrapper */}
      <div className="w-full max-w-[460px] bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 sm:p-8 space-y-6 relative z-10">

        {/* Header Block: Brand Logo & Strategic Minimal Trust Badges */}
        <div className="flex flex-col items-center justify-center text-center gap-4 pb-6 border-b border-slate-850">
          <Link href="/" className="inline-flex items-center group">
            <Image
              src={kalkiBazar}
              alt="logo"
              width={160}
              height={150}
              priority
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ height: "110px", width: "auto" }}
            />
          </Link>

          {/* Inline Micro Badges */}
          <div className="flex items-center gap-4 mt-1 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800/85">
            {TRUST_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex items-center gap-1.5 text-slate-400" title={item.text}>
                  <IconComponent className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-semibold text-slate-400">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Title Context Group */}
        <div className="space-y-1 text-center">
          {badge && (
            <span className="inline-block rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
              {badge}
            </span>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 leading-normal max-w-[340px] mx-auto">
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
          <div className="pt-4 border-t border-slate-850 space-y-3">
            {alternateLink && (
              <p className="text-center text-xs text-slate-400">
                {alternateLink.text}{" "}
                <Link
                  href={alternateLink.href}
                  className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {alternateLink.label}
                </Link>
              </p>
            )}
            {footer && <div className="text-[10px] text-slate-500 text-center leading-normal">{footer}</div>}
          </div>
        )}

      </div>

      {/* Global Minimal Copy Note */}
      <p className="text-[11px] text-slate-500 font-medium mt-6 relative z-10">
        &copy; {new Date().getFullYear()} {shopName}. Secure Gateway.
      </p>

    </div>
  );
};

export default AuthPageShell;
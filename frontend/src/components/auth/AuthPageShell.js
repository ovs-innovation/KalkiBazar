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
 * Clean, modern wrapper shell for authentication routes with a deep black background theme.
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

  return (
    <div
      className="min-h-[calc(100vh-80px)] bg-black flex flex-col items-center justify-center px-4 py-10 sm:py-16 sm:px-6 relative overflow-hidden"
      style={{
        backgroundColor: "#000000",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(234, 179, 8, 0.08), transparent 70%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(217, 119, 6, 0.04), transparent 60%)",
      }}
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[380px] bg-yellow-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-yellow-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-600/[0.03] rounded-full blur-[130px]" />
      </div>

      {/* Central Card Wrapper */}
      <div className="w-full max-w-[460px] bg-[#0c0d12]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl sm:rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(234,179,8,0.05)] p-6 sm:p-9 space-y-6 relative z-10 overflow-hidden">
        {/* Subtle gold top rim light */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent pointer-events-none" />

        {/* Header Block: Brand Logo & Strategic Minimal Trust Badges */}
        <div className="flex flex-col items-center justify-center text-center gap-4 pb-6 border-b border-zinc-800/80">
          <Link href="/" className="relative group inline-flex items-center justify-center" aria-label="Kalki Bazar Home">
            <div className="absolute inset-0 bg-yellow-500/15 rounded-full blur-2xl group-hover:bg-yellow-500/25 transition-all duration-300 pointer-events-none" />
            <Image
              src={kalkiBazar}
              alt="Kalki Bazar"
              width={160}
              height={150}
              priority
              className="relative object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              style={{ height: "105px", width: "auto" }}
            />
          </Link>

          {/* Inline Micro Badges */}
          <div className="flex items-center gap-3 mt-1 bg-zinc-900/90 px-4 py-1.5 rounded-full border border-zinc-800 shadow-inner">
            {TRUST_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex items-center gap-1.5 text-zinc-400" title={item.text}>
                  <IconComponent className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="text-[10px] font-semibold text-zinc-300 tracking-wide">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Title Context Group */}
        <div className="space-y-1.5 text-center">
          {badge && (
            <span className="inline-block rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest mb-1 shadow-sm">
              {badge}
            </span>
          )}
          <h1 className="text-2xl font-black text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-[340px] mx-auto">
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
          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            {alternateLink && (
              <p className="text-center text-xs text-zinc-400">
                {alternateLink.text}{" "}
                <Link
                  href={alternateLink.href}
                  className="font-bold text-yellow-400 hover:text-yellow-300 transition-colors hover:underline"
                >
                  {alternateLink.label}
                </Link>
              </p>
            )}
            {footer && <div className="text-[10px] text-zinc-500 text-center leading-relaxed">{footer}</div>}
          </div>
        )}

      </div>

      {/* Global Minimal Copy Note */}
      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium mt-6 relative z-10">
        <FiShield className="w-3.5 h-3.5 text-yellow-500/80" />
        <span>&copy; {new Date().getFullYear()} {shopName}. 256-bit Encrypted Security.</span>
      </div>

    </div>
  );
};

export default AuthPageShell;
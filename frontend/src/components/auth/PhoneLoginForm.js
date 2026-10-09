import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiSmartphone, FiArrowLeft, FiAlertCircle, FiLock } from "react-icons/fi";
import usePhoneLogin from "@hooks/usePhoneLogin";
import useResendTimer from "@hooks/useResendTimer";
import { redirectLocalhostTo127 } from "@hooks/useFirebasePhoneOtp";
import { UserContext } from "@context/UserContext";
import { notifySuccess } from "@utils/toast";
import saveAuthSession from "@utils/saveAuthSession";
import { getPostAuthPath } from "@utils/profileAuth";

const Spinner = () => (
  <svg
    className="h-5 w-5 animate-spin text-slate-950"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const AuthAlert = ({ children, action }) => (
  <div
    className="flex gap-3 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200 backdrop-blur-sm"
    role="alert"
  >
    <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
    <div className="min-w-0 flex-1 space-y-2">
      <p className="leading-relaxed font-medium">{children}</p>
      {action}
    </div>
  </div>
);

const StepIndicator = ({ step }) => (
  <div className="mb-5 flex items-center justify-between rounded-xl bg-zinc-900/80 px-4 py-3 ring-1 ring-zinc-800">
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
          step === "phone" ? "bg-yellow-400 text-slate-950 shadow-sm" : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700"
        }`}
      >
        1
      </span>
      <span className={`text-sm font-semibold ${step === "phone" ? "text-white" : "text-zinc-500"}`}>
        Mobile
      </span>
    </div>
    <div className="h-px flex-1 mx-3 bg-zinc-800" />
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
          step === "otp" ? "bg-yellow-400 text-slate-950 shadow-sm" : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700"
        }`}
      >
        2
      </span>
      <span className={`text-sm font-semibold ${step === "otp" ? "text-white" : "text-zinc-500"}`}>
        OTP
      </span>
    </div>
  </div>
);

const PhoneLoginForm = ({ variant = "login" }) => {
  const isSignup = variant === "signup";
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const phoneLogin = usePhoneLogin(isSignup ? "signup" : "login");
  const { startTimer, resetTimer, canResend, formatted } = useResendTimer(60);

  const [step, setStep] = useState("phone");
  const [otpLength, setOtpLength] = useState(phoneLogin.otpLength);
  const [otp, setOtp] = useState(Array(phoneLogin.otpLength).fill(""));
  const otpInputRefs = useRef([]);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    redirectLocalhostTo127();
  }, []);

  useEffect(() => {
    return () => {
      phoneLogin.resetOtpSession?.();
    };
  }, [phoneLogin.resetOtpSession]);

  const resetOtpInputs = (len) => {
    setOtpLength(len);
    setOtp(Array(len).fill(""));
  };

  const maskedPhone =
    phoneNumber.length >= 4 ? `******${phoneNumber.slice(-4)}` : phoneNumber;

  const sendOtpRequest = async () => {
    if (phoneNumber.length !== 10) {
      phoneLogin.setError("Enter a valid 10-digit mobile number");
      throw new Error("Enter a valid 10-digit mobile number");
    }
    phoneLogin.setError("");
    const response = await phoneLogin.sendOtp(phoneNumber);
    const len = response?.otpLength || phoneLogin.otpLength;
    resetOtpInputs(len);
    setStep("otp");
    startTimer();
    notifySuccess(response?.message || "OTP sent to your mobile");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await sendOtpRequest();
    } catch {
      /* inline */
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || phoneLogin.loading) return;
    try {
      await sendOtpRequest();
    } catch {
      /* inline */
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== otpLength) {
      phoneLogin.setError(`Enter the ${otpLength}-digit OTP`);
      return;
    }
    phoneLogin.setError("");
    try {
      const response = await phoneLogin.verifyOtp(phoneNumber, otpCode);
      if (response?.token) {
        saveAuthSession(response, dispatch);
        notifySuccess(
          response.isNewUser || isSignup
            ? "Welcome! Your account is ready."
            : "Welcome back!"
        );
        router.push(getPostAuthPath(response, router.query));
      }
    } catch {
      /* inline */
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const digit = value.slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < otpLength - 1) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otpLength);
    if (!pasted) return;
    const digits = pasted.split("");
    setOtp((prev) => {
      const next = [...prev];
      digits.forEach((d, i) => {
        next[i] = d;
      });
      return next;
    });
    const focusIdx = Math.min(digits.length, otpLength - 1);
    otpInputRefs.current[focusIdx]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const goBackToPhone = () => {
    setStep("phone");
    resetOtpInputs(phoneLogin.otpLength);
    phoneLogin.setError("");
    resetTimer();
  };

  const otpError = phoneLogin.error;
  const showLoginLink =
    isSignup && phoneLogin.errorCode === "PHONE_ALREADY_REGISTERED";
  const showSignupLink =
    !isSignup && phoneLogin.errorCode === "PHONE_NOT_REGISTERED";

  const loginHref = { pathname: "/auth/login", query: { ...router.query } };
  const signupHref = { pathname: "/auth/signup", query: { ...router.query } };

  const errorAction =
    showLoginLink ? (
      <Link
        href={loginHref}
        className="inline-flex font-semibold text-yellow-400 hover:text-yellow-300 hover:underline"
      >
        Go to Login →
      </Link>
    ) : showSignupLink ? (
      <Link
        href={signupHref}
        className="inline-flex font-semibold text-yellow-400 hover:text-yellow-300 hover:underline"
      >
        Create an account →
      </Link>
    ) : null;

  const primaryBtnClass =
    "w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 py-3.5 sm:py-4 text-sm sm:text-base font-black text-slate-950 shadow-[0_4px_22px_rgba(234,179,8,0.35)] hover:shadow-[0_6px_28px_rgba(234,179,8,0.5)] active:scale-[0.99] transition-all duration-200 tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer";

  return (
    <div className="w-full">
      {phoneLogin.isFirebase && (
        <div
          id="recaptcha-container"
          className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
          aria-hidden
        />
      )}

      <StepIndicator step={step} />

      {step === "phone" ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="auth-phone"
              className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400"
            >
              Mobile number
            </label>
            <div className="flex overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20">
              <span className="flex items-center gap-1.5 bg-zinc-900 px-4 text-sm font-bold text-yellow-400 border-r border-zinc-800">
                <FiSmartphone className="h-4 w-4 text-yellow-400/80" />
                +91
              </span>
              <input
                id="auth-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="min-w-0 flex-1 px-4 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
                placeholder="10-digit number"
                maxLength={10}
                required
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              We’ll send an OTP to verify your number.
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-zinc-900/60 p-3 ring-1 ring-zinc-800/80">
            <FiLock className="mt-0.5 h-4 w-4 text-yellow-500/80 shrink-0" />
            <p className="text-[11px] leading-relaxed text-zinc-400">
              By continuing, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>

          {otpError && <AuthAlert action={errorAction}>{otpError}</AuthAlert>}

          <div className="pt-2">
            <button
              disabled={phoneLogin.loading || phoneNumber.length !== 10}
              type="submit"
              className={primaryBtnClass}
            >
              {phoneLogin.loading ? (
                <>
                  <Spinner />
                  <span>Sending OTP…</span>
                </>
              ) : isSignup ? (
                "Continue"
              ) : (
                "Get OTP"
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <button
            type="button"
            onClick={goBackToPhone}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-yellow-400"
          >
            <FiArrowLeft className="h-4 w-4" />
            Change number
          </button>

          <div className="rounded-xl bg-zinc-900/80 px-4 py-3.5 text-center ring-1 ring-zinc-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              OTP sent to
            </p>
            <p className="mt-0.5 text-base font-bold tracking-wide text-zinc-100">
              +91 {maskedPhone}
            </p>
          </div>

          <div
            className="flex justify-center gap-2 sm:gap-2.5"
            onPaste={handleOtpPaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpInputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="h-12 w-10 rounded-xl border border-zinc-800 bg-zinc-900/90 text-center text-xl font-black text-white shadow-inner outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 sm:h-14 sm:w-12"
                autoFocus={i === 0}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {otpError && (
            <AuthAlert action={errorAction}>{otpError}</AuthAlert>
          )}

          <div className="pt-2">
            <button
              disabled={phoneLogin.loading}
              type="submit"
              className={primaryBtnClass}
            >
              {phoneLogin.loading ? (
                <>
                  <Spinner />
                  <span>Verifying…</span>
                </>
              ) : isSignup ? (
                "Verify & create account"
              ) : (
                "Verify & login"
              )}
            </button>
          </div>

          <div className="text-center text-xs">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={phoneLogin.loading}
                className="font-bold text-yellow-400 hover:text-yellow-300 hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-zinc-500">
                Resend in{" "}
                <span className="font-bold tabular-nums text-yellow-400">
                  {formatted}
                </span>
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneLoginForm;

import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { notifySuccess } from "@utils/toast";
import CustomerServices from "@services/CustomerServices";

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

const AuthAlert = ({ children }) => (
  <div
    className="flex gap-3 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200 animate-fadeIn backdrop-blur-sm shadow-sm"
    role="alert"
  >
    <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
    <div className="min-w-0 flex-1">
      <p className="leading-relaxed font-medium">{children}</p>
    </div>
  </div>
);

const EmailRegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await CustomerServices.registerCustomerEmail({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response && response.success) {
        notifySuccess(response.message || "Registration successful! Please login.");
        // Redirect to login page, preserving redirect query params if any
        router.push({
          pathname: "/auth/login",
          query: { ...router.query },
        });
      } else {
        setError("Invalid response received from server");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-name"
            className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400"
          >
            Full Name
          </label>
          <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition-all duration-200 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 focus-within:bg-zinc-900 hover:border-zinc-700">
            <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
              <FiUser className="h-5 w-5" />
            </span>
            <input
              id="register-name"
              type="text"
              placeholder="e.g. John Doe"
              className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
          </div>
          {errors.name && (
            <p className="text-xs font-semibold text-rose-400 px-1 pt-0.5 flex items-center gap-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-email"
            className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400"
          >
            Email Address
          </label>
          <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition-all duration-200 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 focus-within:bg-zinc-900 hover:border-zinc-700">
            <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
              <FiMail className="h-5 w-5" />
            </span>
            <input
              id="register-email"
              type="email"
              placeholder="e.g. name@example.com"
              className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-semibold text-rose-400 px-1 pt-0.5 flex items-center gap-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-password"
            className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400"
          >
            Password
          </label>
          <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition-all duration-200 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 focus-within:bg-zinc-900 hover:border-zinc-700">
            <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
              <FiLock className="h-5 w-5" />
            </span>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              className="w-full pl-12 pr-12 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-zinc-500 hover:text-yellow-400 focus:outline-none transition-colors rounded"
              tabIndex="-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-rose-400 px-1 pt-0.5 flex items-center gap-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error Notification */}
        {error && <AuthAlert>{error}</AuthAlert>}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 py-3.5 sm:py-4 text-sm sm:text-base font-black text-slate-950 shadow-[0_4px_22px_rgba(234,179,8,0.35)] hover:shadow-[0_6px_28px_rgba(234,179,8,0.5)] active:scale-[0.99] transition-all duration-200 tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Creating account…</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EmailRegisterForm;

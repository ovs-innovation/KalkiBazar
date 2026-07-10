import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { UserContext } from "@context/UserContext";
import { notifySuccess } from "@utils/toast";
import saveAuthSession from "@utils/saveAuthSession";
import { getPostAuthPath } from "@utils/profileAuth";
import CustomerServices from "@services/CustomerServices";

const Spinner = () => (
  <svg
    className="h-5 w-5 animate-spin text-white"
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
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const AuthAlert = ({ children }) => (
  <div
    className="flex gap-3 rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-800 animate-fadeIn"
    role="alert"
  >
    <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
    <div className="min-w-0 flex-1">
      <p className="leading-relaxed font-medium">{children}</p>
    </div>
  </div>
);

const EmailLoginForm = () => {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await CustomerServices.loginCustomerEmail({
        email: data.email,
        password: data.password,
      });

      if (response && response.token) {
        // Save session in cookies & update user context
        saveAuthSession(response, dispatch);
        notifySuccess(response.message || "Login successful!");
        
        // Redirect to post-auth path or checkout
        const destination = getPostAuthPath(response.customer || response, router.query);
        router.push(destination);
      } else {
        setError("Invalid response received from server");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Email Address
          </label>
          <div className="relative flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
            <span className="absolute left-4 text-slate-400">
              <FiMail className="h-5 w-5" />
            </span>
            <input
              id="login-email"
              type="email"
              placeholder="e.g. name@example.com"
              className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
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
            <p className="text-xs font-semibold text-red-500 px-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Password
            </label>
          </div>
          <div className="relative flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
            <span className="absolute left-4 text-slate-400">
              <FiLock className="h-5 w-5" />
            </span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3.5 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
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
              className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
              tabIndex="-1"
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-red-500 px-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error Notification */}
        {error && <AuthAlert>{error}</AuthAlert>}

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-[0_10px_25px_rgba(16,185,129,0.25)] transition-all duration-200 hover:bg-emerald-700 hover:shadow-[0_12px_28px_rgba(16,185,129,0.35)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? (
            <>
              <Spinner />
              Signing you in…
            </>
          ) : (
            "Sign In"
          )}
        </button>

      </form>
    </div>
  );
};

export default EmailLoginForm;

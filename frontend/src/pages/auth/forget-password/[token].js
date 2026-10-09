import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail } from "react-icons/fi";

//internal import
import Layout from "@layout/Layout";
import AuthPageShell from "@components/auth/AuthPageShell";
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import { notifyError, notifySuccess } from "@utils/toast";

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

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const password = useRef("");
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  password.current = watch("newPassword");

  const submitHandler = async ({ registerEmail, password, newPassword }) => {
    setLoading(true);

    try {
      if (newPassword) {
        // Reset password logic
        const res = await CustomerServices.resetPassword({
          newPassword,
          token: router.query?.token,
        });

        setLoading(false);
        setShowLogin(true);
        notifySuccess(res.message);
        setValue("newPassword", "");
      }

      if (registerEmail && password) {
        const signInRes = await signIn("credentials", {
          redirect: false,
          email: registerEmail,
          password: password,
        });

        if (signInRes?.ok) {
          router.push("/");
          notifySuccess("Login Success!");
        } else {
          notifyError("Sign-in failed. Please try again!");
          router.push("/auth/login");
        }
      }
    } catch (err) {
      setLoading(false);
      notifyError(
        err?.response?.data?.message || err.message || "Something went wrong."
      );
    }
  };

  return (
    <Layout title={showLogin ? "Login" : "Reset Password"}>
      <AuthPageShell
        title={showLogin ? "Welcome Back" : "Reset Password"}
        subtitle={
          showLogin
            ? "Sign in with your email and new password."
            : "Enter a strong new password for your account."
        }
        alternateLink={{
          text: "Already done?",
          label: "Go to Login",
          href: { pathname: "/auth/login" },
        }}
      >
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {showLogin ? (
            <>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Email Address
                </label>
                <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20">
                  <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
                    <FiMail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
                    {...register("registerEmail", {
                      required: "Email is required",
                    })}
                  />
                </div>
                {errors.registerEmail && (
                  <p className="text-xs font-semibold text-rose-400 px-1 pt-0.5">
                    {errors.registerEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20">
                  <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
                    <FiLock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-semibold text-rose-400 px-1 pt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  New Password
                </label>
                <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20">
                  <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
                    <FiLock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-xs font-semibold text-rose-400 px-1 pt-0.5">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Confirm Password
                </label>
                <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20">
                  <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
                    <FiLock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-500 bg-transparent border-0 focus:ring-0"
                    {...register("confirm_password", {
                      validate: (value) =>
                        value === password.current ||
                        "The passwords do not match",
                    })}
                  />
                </div>
                {errors.confirm_password && (
                  <p className="text-xs font-semibold text-rose-400 px-1 pt-0.5">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 py-3.5 sm:py-4 text-sm sm:text-base font-black text-slate-950 shadow-[0_4px_22px_rgba(234,179,8,0.35)] hover:shadow-[0_6px_28px_rgba(234,179,8,0.5)] active:scale-[0.99] transition-all duration-200 tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Processing…</span>
                </>
              ) : showLogin ? (
                "Sign In"
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </AuthPageShell>
    </Layout>
  );
};

export default ForgetPassword;

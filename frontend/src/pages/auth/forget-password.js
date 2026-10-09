import React from "react";
import { useRouter } from "next/router";
import { FiMail } from "react-icons/fi";
import Layout from "@layout/Layout";
import AuthPageShell from "@components/auth/AuthPageShell";
import useLoginSubmit from "@hooks/useLoginSubmit";

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
  const router = useRouter();
  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit();

  return (
    <Layout title="Forget Password">
      <AuthPageShell
        title="Reset Password"
        subtitle="Enter your registered email address to receive password reset instructions."
        alternateLink={{
          text: "Remember your password?",
          label: "Login here",
          href: { pathname: "/auth/login", query: { ...router.query } },
        }}
      >
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="forget-email"
              className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400"
            >
              Registered Email
            </label>
            <div className="group relative flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-inner transition-all duration-200 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 focus-within:bg-zinc-900 hover:border-zinc-700">
              <span className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-yellow-400 pointer-events-none">
                <FiMail className="h-5 w-5" />
              </span>
              <input
                id="forget-email"
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

          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 py-3.5 sm:py-4 text-sm sm:text-base font-black text-slate-950 shadow-[0_4px_22px_rgba(234,179,8,0.35)] hover:shadow-[0_6px_28px_rgba(234,179,8,0.5)] active:scale-[0.99] transition-all duration-200 tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Sending reset link…</span>
                </>
              ) : (
                "Recover Password"
              )}
            </button>
          </div>
        </form>
      </AuthPageShell>
    </Layout>
  );
};

export default ForgetPassword;

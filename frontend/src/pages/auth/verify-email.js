import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { auth } from "@lib/firebase";
import { sendEmailVerification } from "firebase/auth";

//internal import
import Layout from "@layout/Layout";
import AuthPageShell from "@components/auth/AuthPageShell";
import CustomerServices from "@services/CustomerServices";
import { setToken } from "@services/httpServices";
import { UserContext } from "@context/UserContext";
import { notifySuccess, notifyError } from "@utils/toast";

const VerifyEmail = () => {
  const router = useRouter();
  const { email } = router.query;
  const { dispatch } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (router.isReady && !email) {
      router.push("/auth/login");
    }
  }, [router.isReady, email]);

  // Auto-check verification status every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth?.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          await handleContinue();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const user = auth?.currentUser;
      if (!user) {
        notifyError("Session expired. Please sign up again.");
        router.push("/auth/login");
        return;
      }

      await user.reload();

      if (!user.emailVerified) {
        notifyError("Email not verified yet. Please check your inbox and click the verification link.");
        setLoading(false);
        return;
      }

      // Email is verified — get fresh token and login via backend
      const idToken = await user.getIdToken(true);
      const res = await CustomerServices.loginCustomer({ idToken });

      if (res && res.token) {
        const userInfo = {
          _id: res._id,
          name: res.name,
          email: res.email,
          phone: res.phone || "",
          address: res.address || "",
          image: res.image || "",
          token: res.token,
          role: res.role || "customer",
        };

        setToken(res.token);
        Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 1 });
        dispatch({ type: "USER_LOGIN", payload: userInfo });
        notifySuccess("Email verified successfully!");
        router.push("/user/dashboard");
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const user = auth?.currentUser;
      if (!user) {
        notifyError("Session expired. Please sign up again.");
        router.push("/auth/login");
        return;
      }
      await sendEmailVerification(user);
      notifySuccess("Verification email sent! Please check your inbox.");
    } catch (err) {
      if (err.code === "auth/too-many-requests") {
        notifyError("Too many requests. Please wait a moment before trying again.");
      } else {
        notifyError(err?.message || "Failed to resend verification email.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <Layout title="Verify Email">
      <AuthPageShell
        title="Verify Your Email"
        subtitle="We've sent a verification link to your email address."
        alternateLink={{
          text: "Wrong account?",
          label: "Back to Login",
          href: { pathname: "/auth/login" },
        }}
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto w-14 h-14 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="rounded-xl bg-zinc-900/80 p-3 ring-1 ring-zinc-800">
            <p className="text-xs text-zinc-400">Verification link sent to:</p>
            <p className="text-sm font-bold text-white break-all mt-0.5">{email}</p>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            <span className="font-semibold text-yellow-400">Note:</span> Please check your Inbox, Spam, or Junk folder if you don&apos;t see the email in your primary inbox.
          </p>

          <p className="text-xs text-zinc-500">
            Open your email and click the verification link, then click below.
          </p>

          <div className="pt-2 space-y-3">
            <button
              onClick={handleContinue}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 py-3.5 sm:py-4 text-sm sm:text-base font-black text-slate-950 shadow-[0_4px_22px_rgba(234,179,8,0.35)] hover:shadow-[0_6px_28px_rgba(234,179,8,0.5)] active:scale-[0.99] transition-all duration-200 tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Checking..." : "I've Verified — Continue"}
            </button>

            <p className="text-xs text-zinc-400">
              Didn&apos;t receive the email?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-yellow-400 font-bold hover:text-yellow-300 hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend Email"}
              </button>
            </p>
          </div>
        </div>
      </AuthPageShell>
    </Layout>
  );
};

export default VerifyEmail;

import { useRouter } from "next/router";
import Layout from "@layout/Layout";
import AuthPageShell from "@components/auth/AuthPageShell";
import EmailLoginForm from "@components/auth/EmailLoginForm";

const Login = () => {
  const router = useRouter();
  const isCheckoutReturn =
    router.query.redirectUrl === "checkout" || router.query.next === "checkout";

  return (
    <Layout title="Login">
      <AuthPageShell
        title="Welcome back"
        subtitle={
          isCheckoutReturn
            ? "Sign in with your registered email and password to complete checkout."
            : "Sign in with your registered email address and password."
        }
        badge={isCheckoutReturn ? "Checkout" : null}
        alternateLink={{
          text: "New to Kalki Brand?",
          label: "Create an account",
          href: { pathname: "/auth/signup", query: { ...router.query } },
        }}
        footer={
          <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
            Browse as guest anytime. Delivery details are collected at checkout.
          </p>
        }
      >
        <EmailLoginForm />
      </AuthPageShell>
    </Layout>
  );
};

export default Login;

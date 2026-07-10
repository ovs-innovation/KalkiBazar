import { useRouter } from "next/router";
import Layout from "@layout/Layout";
import AuthPageShell from "@components/auth/AuthPageShell";
import EmailRegisterForm from "@components/auth/EmailRegisterForm";

const SignUp = () => {
  const router = useRouter();

  return (
    <Layout title="Sign up">
      <AuthPageShell
        title="Create your account"
        subtitle="Sign up for a new customer account to access member benefits and fast checkout."
        alternateLink={{
          text: "Already registered?",
          label: "Login here",
          href: { pathname: "/auth/login", query: { ...router.query } },
        }}
      >
        <EmailRegisterForm />
      </AuthPageShell>
    </Layout>
  );
};

export default SignUp;

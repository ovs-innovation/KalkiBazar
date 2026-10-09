import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const SignupRedirectContent = ({ onSuccess }) => (
  <div className="py-2 text-center">
    <p className="text-sm leading-relaxed text-zinc-400">
      Create your account with your email in under a minute.
    </p>
    <Link
      href="/auth/signup"
      onClick={() => onSuccess?.()}
      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 py-3.5 text-sm font-black text-slate-950 shadow-[0_4px_22px_rgba(234,179,8,0.35)] transition active:scale-[0.99]"
    >
      <span>Continue to sign up</span>
      <FiArrowRight className="text-lg" />
    </Link>
  </div>
);

export default SignupRedirectContent;

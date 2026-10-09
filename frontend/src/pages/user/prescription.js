import { useEffect } from "react";
import { useRouter } from "next/router";

const Prescription = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/dashboard");
  }, [router]);

  return null;
};

export default Prescription;

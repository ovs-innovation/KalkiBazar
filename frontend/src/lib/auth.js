import { useSession } from "next-auth/react";
import Cookies from "js-cookie";

const getUserSession = () => {
  const { data } = useSession();
  let user = null;

  if (data?.user) {
    user = data.user;
  } else if (typeof window !== "undefined") {
    const cookieUserInfo = Cookies.get("userInfo");
    if (cookieUserInfo) {
      try {
        user = JSON.parse(cookieUserInfo);
      } catch (e) {
        user = null;
      }
    }
  }

  if (user) {
    // Standardize IDs: ensure both id and _id are defined
    if (user.id && !user._id) user._id = user.id;
    if (user._id && !user.id) user.id = user._id;
  }

  return user;
};

export { getUserSession };

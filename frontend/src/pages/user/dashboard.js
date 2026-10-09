import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { IoLockOpenOutline } from "react-icons/io5";
import {
  FiBell,
  FiCheck,
  FiFileText,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiSettings,
  FiShoppingCart,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import Layout from "@layout/Layout";
import Card from "@components/order-card/Card";
import OrderServices from "@services/OrderServices";
import RecentOrder from "@pages/user/recent-order";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import Loading from "@components/preloader/Loading";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { setToken } from "@services/httpServices";

const Dashboard = ({ title, description, children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { state: userState, dispatch } = useContext(UserContext);
  const { isLoading, setIsLoading, currentPage } = useContext(SidebarContext);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const [isOpen, setIsOpen] = useState(false);

  const userInfo = userState?.userInfo || session?.user;
  const userId = userInfo?._id || userInfo?.id;
  const isAuthenticated = !!userInfo?.token || status === "authenticated";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["orders", { currentPage, user: userId }],
    queryFn: async () =>
      await OrderServices.getOrderCustomer({
        page: currentPage,
        limit: 10,
      }),
    enabled: isAuthenticated,
  });

  const handleLogOut = () => {
    signOut({ redirect: false });
    Cookies.remove("userInfo");
    Cookies.remove("couponInfo");
    setToken(null);
    dispatch({ type: "USER_LOGOUT" });
    router.push("/");
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const userSidebar = [
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.dashboard_title
        ) || "Dashboard",
      href: "/user/dashboard",
      icon: FiGrid,
    },
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.my_order
        ) || "My Orders",
      href: "/user/my-orders",
      icon: FiList,
    },
    {
      title: "Notifications",
      href: "/user/notifications",
      icon: FiBell,
    },
    {
      title: "My Account",
      href: "/user/my-account",
      icon: FiUser,
    },
    {
      title: "Track Order",
      href: "/user/track-order",
      icon: FiTruck,
    },
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.update_profile
        ) || "Update Profile",
      href: "/user/update-profile",
      icon: FiSettings,
    },
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.change_password
        ) || "Change Password",
      href: "/user/change-password",
      icon: IoLockOpenOutline,
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={title ? title : "Dashboard"}
          description={description ? description : "This is User Dashboard"}
        >
          <div className="bg-gray-50/50 min-h-screen">
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
              <div className="py-10 lg:py-12 flex flex-col lg:flex-row w-full">
                <div className="flex-shrink-0 w-full lg:w-80 mr-7 lg:mr-10 xl:mr-10">
                  {/* Mobile Header */}
                  <div className="bg-white p-4 rounded-xl mb-5 lg:hidden flex justify-between items-center shadow-sm">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-gray-800">
                        {userInfo?.name}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {userInfo?.email || userInfo?.phone || "—"}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="p-2 bg-store-500 rounded-lg text-white hover:bg-store-600 transition-all shadow-md"
                    >
                      <FiGrid className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Sidebar Menu */}
                  <div className={`${isOpen ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-xl shadow-sm border border-gray-50 sticky top-32`}>
                    {/* User Profile Header (Desktop) */}
                    <div className="hidden lg:flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
                      <div className="w-20 h-20 rounded-full bg-store-50 flex items-center justify-center text-store-600 text-3xl font-bold mb-4 shadow-inner">
                        {userInfo?.name?.charAt(0).toUpperCase()}
                      </div>
                      <h2 className="text-lg font-serif font-bold text-gray-800 text-center line-clamp-1">
                        {userInfo?.name}
                      </h2>
                      <p className="text-sm text-gray-500 text-center line-clamp-1">
                        {userInfo?.email || userInfo?.phone || "—"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {userSidebar?.map((item) => {
                        const isActive = router.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                              isActive
                                ? "user-sidebar-active bg-yellow-500 text-slate-950 font-bold shadow-md"
                                : "user-sidebar-link text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
                            }`}
                          >
                            <item.icon
                              className={`flex-shrink-0 h-5 w-5 mr-3 transition-colors ${
                                isActive ? "text-slate-950" : "text-zinc-400 group-hover:text-yellow-400"
                              }`}
                              aria-hidden="true"
                            />
                            <span>{item.title}</span>
                          </Link>
                        );
                      })}

                      <button
                        onClick={handleLogOut}
                        className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 mt-4 border-t border-zinc-800/80 pt-6"
                      >
                        <IoLockOpenOutline className="flex-shrink-0 h-5 w-5 mr-3 text-rose-400" />
                        <span>{showingTranslateValue(storeCustomizationSetting?.navbar?.logout) || "Logout"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-4 lg:mt-0 lg:ml-4 overflow-hidden">
                  {!children && (
                    <div className="overflow-hidden">
                      <div className="mb-8">
                        <h2 className="text-2xl font-serif font-bold text-gray-800">
                          Welcome back, {userInfo?.name}!
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Here's what's happening with your account today.
                        </p>
                      </div>
                      <div className="grid gap-6 mb-10 grid-cols-2 xl:grid-cols-4">
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.total_order
                            ) || "Total Orders"
                          }
                          Icon={FiShoppingCart}
                          quantity={data?.totalDoc}
                          className="text-red-600  bg-red-200"
                        />
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.pending_order
                            ) || "Pending Orders"
                          }
                          Icon={FiRefreshCw}
                          quantity={data?.pending}
                          className="text-orange-600 bg-orange-200"
                        />
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.processing_order
                            ) || "Processing Orders"
                          }
                          Icon={FiTruck}
                          quantity={data?.processing}
                          className="text-indigo-600 bg-indigo-200"
                        />
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.complete_order
                            ) || "Complete Orders"
                          }
                          Icon={FiCheck}
                          quantity={data?.delivered}
                          className={`text-store-600 bg-store-200`}
                        />
                      </div>
                      <RecentOrder data={data} loading={loading} error={error} />
                    </div>
                  )}
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });

import React from "react";
import { FiCreditCard, FiGift, FiPhoneCall, FiTruck } from "react-icons/fi";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const FeatureCard = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  const featurePromo = [
    {
      id: 1,
      title: showingTranslateValue(
        storeCustomizationSetting?.footer?.shipping_card
      ) || "Free Shipping",

      icon: FiTruck,
    },
    {
      id: 2,
      title: showingTranslateValue(
        storeCustomizationSetting?.footer?.support_card
      ) || "24/7 Support",

      icon: FiPhoneCall,
    },
    {
      id: 3,
      title: showingTranslateValue(
        storeCustomizationSetting?.footer?.payment_card
      ) || "Secure Payment",
      icon: FiCreditCard,
    },
    {
      id: 4,
      title: showingTranslateValue(
        storeCustomizationSetting?.footer?.offer_card
      ) || "Daily Offers",
      icon: FiGift,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-0 mx-auto border border-slate-800 bg-slate-950/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
      {featurePromo.map((promo) => (
        <div
          key={promo.id}
          className="group flex items-center gap-3 px-5 py-4 border-r border-slate-800 last:border-r-0 hover:bg-slate-900/40 transition-all duration-200 cursor-default"
        >
          <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-200 border border-yellow-500/20">
            <promo.icon
              className="h-4 w-4 text-yellow-500"
              aria-hidden="true"
            />
          </div>
          <div>
            <span className="block font-bold text-sm text-slate-100 group-hover:text-yellow-400 transition-colors duration-200 leading-tight">
              {promo?.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCard;


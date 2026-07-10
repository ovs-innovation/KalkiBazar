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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-0 mx-auto">
      {featurePromo.map((promo) => (
        <div
          key={promo.id}
          className="group flex items-center gap-3 px-4 py-3 border-r border-store-100 last:border-r-0 hover:bg-store-50 transition-colors duration-200 cursor-default"
        >
          <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-store-100 group-hover:bg-store-200 transition-colors duration-200">
            <promo.icon
              className="h-4 w-4 text-store-600"
              aria-hidden="true"
            />
          </div>
          <div>
            <span className="block font-semibold text-sm text-gray-800 leading-tight">
              {promo?.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCard;


import Link from "next/link";
import React from "react";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Banner = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  console.log(storeCustomizationSetting?.home?.promotion_button_link)

  return (
    <>
      <div className="flex flex-col md:first:flex-row  justify-center md:justify-between items-center">
        <div>
          <h1 className="font-serif text-xl text-justify ">
            <span className={`text-store-600 font-bold text-justify text-lg lg:text-xl`}>
              {showingTranslateValue(
                storeCustomizationSetting?.home?.promotion_title
              )}
            </span>{" "}
          </h1>

          <p className="text-gray-500 text-justify">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.promotion_description
            )}
          </p>
        </div>
        <Link
          href={`${storeCustomizationSetting?.home?.promotion_button_link}`}
          className={`text-sm font-serif font-medium px-6 py-2 bg-store-500 text-center rounded-full text-white hover:bg-store-700`}
        >
          {showingTranslateValue(
            storeCustomizationSetting?.home?.promotion_button_name
          )}
        </Link>
      </div>
    </>
  );
};

export default Banner;


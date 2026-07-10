import React from "react";
import useGetSetting from "@hooks/useGetSetting";

const InputPayment = ({ register, Icon, name, value, setShowCard }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  return (
    <div className="px-3 py-4 card border border-gray-200 bg-white rounded-md">
      <label className="cursor-pointer label">
        <div className="flex item-center justify-between">
          <div className="flex items-center">
            <span className="text-xl mr-3 text-gray-400">
              <Icon />
            </span>
            <h6 className="font-serif font-medium text-sm text-gray-600">
              {name}
            </h6>
          </div>
          <input
            onClick={() => setShowCard(value === "Card" ? true : false)}
            {...register("paymentMethod", {
              required: "Payment Method is required!",
            })}
            type="radio"
            value={value}
            name="paymentMethod"
            className={`form-radio outline-none focus:ring-0 text-store-500`}
          />
        </div>
      </label>
    </div>
  );
};

export default InputPayment;


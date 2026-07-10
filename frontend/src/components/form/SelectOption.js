import React from "react";
import Label from "@components/form/Label";
import useGetSetting from "@hooks/useGetSetting";

const SelectOption = ({ name, label, options, onChange, value, register }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  return (
    <>
      <Label label={label} />
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          // {...register(`${name}`, {
          //   required: `${label} is required!`,
          // })}
          className={`py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-xl placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-neutral-200 focus:outline-none focus:border-store-500 focus:ring-2 focus:ring-store-100 h-11 md:h-12 shadow-sm focus:shadow-md cursor-pointer`}
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={option + index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SelectOption;


import React from "react";

const Label = ({ label, required }) => {
  return (
    <label className="block text-neutral-600 font-semibold text-sm leading-none mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
};

export default Label;

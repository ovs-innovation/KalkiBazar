import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import useGetSetting from "@hooks/useGetSetting";


const Loading = ({ loading }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  return (
    <div className="text-lg text-center py-6">
      <ScaleLoader
        color={storeColor}
        loading={loading}
        height={30}
        width={3}
        radius={3}
        margin={2}
      />
    </div>
  );
};

export default Loading;

import React from "react";
import { useTimer } from "react-timer-hook";
import useGetSetting from "@hooks/useGetSetting";

const OfferTimer = ({ expiryTimestamp, darkGreen }) => {
  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp });
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  return (
    <>
      <span
        className={`flex items-center justify-center ${
          darkGreen ? `bg-store-500 text-white` : `bg-store-100`
        }  text-sm font-serif font-semibold px-2 py-1 rounded mx-1`}
      >
        {days}
      </span>
      :
      <span
        className={`flex items-center justify-center ${
          darkGreen ? `bg-store-500 text-white` : `bg-store-100`
        }  text-sm font-serif font-semibold px-2 py-1 rounded mx-1`}
      >
        {hours}
      </span>
      :
      <span
        className={`flex items-center justify-center ${
          darkGreen ? `bg-store-500 text-white` : `bg-store-100`
        }  text-sm font-serif font-semibold px-2 py-1 rounded mx-1`}
      >
        {minutes}
      </span>
      :
      <span
        className={`flex items-center justify-center ${
          darkGreen ? `bg-store-500 text-white` : `bg-store-100`
        }  text-sm font-serif font-semibold px-2 py-1 rounded mx-1`}
      >
        {seconds}
      </span>
    </>
  );
};

export default React.memo(OfferTimer);


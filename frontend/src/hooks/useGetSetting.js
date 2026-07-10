import Cookies from "js-cookie";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// internal import
import SettingServices from "@services/SettingServices";
import { storeCustomization } from "@utils/storeCustomizationSetting";

// Stateless hook: derive settings directly from react-query results
const useGetSetting = () => {
  const lang = Cookies.get("_lang");

  const {
    data: globalSetting,
    error: globalError,
    isLoading: loadingGlobal,
  } = useQuery({
    queryKey: ["globalSetting"],
    queryFn: async () => await SettingServices.getGlobalSetting(),
    staleTime: 10 * 60 * 1000, // cache for 10 minutes
    gcTime: 15 * 60 * 1000,
  });

  const {
    data: customizationData,
    error: customizationError,
    isFetched,
    isLoading: loadingCustomization,
  } = useQuery({
    queryKey: ["storeCustomization"],
    queryFn: async () => await SettingServices.getStoreCustomizationSetting(),
    staleTime: 20 * 60 * 1000, // cache for 20 minutes
    gcTime: 25 * 60 * 1000,
  });

  // Ensure language cookie
  useEffect(() => {
    if (!lang) {
      Cookies.set("_lang", "en", {
        sameSite: "None",
        secure: true,
      });
    }
  }, [lang]);

  // derive without local setState to avoid render loops
  const storeCustomizationSetting =
    isFetched && customizationData ? customizationData : storeCustomization;

  const sanitizedGlobalSetting = globalSetting ? {
    ...globalSetting,
    shop_name: (!globalSetting.shop_name || globalSetting.shop_name === "Ayurvedha Aaushdi" || globalSetting.shop_name === "Farmacykart" || globalSetting.shop_name.trim() === "")
      ? "Kalki Brand"
      : globalSetting.shop_name
  } : globalSetting;

  const sanitizedStoreCustomizationSetting = storeCustomizationSetting ? {
    ...storeCustomizationSetting,
    seo: storeCustomizationSetting.seo ? {
      ...storeCustomizationSetting.seo,
      meta_title: (!storeCustomizationSetting.seo.meta_title || storeCustomizationSetting.seo.meta_title === "Ayurvedha Aaushdi" || storeCustomizationSetting.seo.meta_title === "Farmacykart" || storeCustomizationSetting.seo.meta_title.trim() === "")
        ? "Kalki Brand"
        : storeCustomizationSetting.seo.meta_title
    } : { meta_title: "Kalki Brand" }
  } : storeCustomizationSetting;

  return {
    lang,
    error: customizationError || globalError,
    loading: loadingGlobal || loadingCustomization,
    globalSetting: sanitizedGlobalSetting,
    storeCustomizationSetting: sanitizedStoreCustomizationSetting,
  };
};

export default useGetSetting;

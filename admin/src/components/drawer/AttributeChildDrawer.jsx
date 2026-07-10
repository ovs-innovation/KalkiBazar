import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Scrollbars } from "react-custom-scrollbars-2";

//internal import
import AttributeServices from "@/services/AttributeServices";
import useAttributeSubmit from "@/hooks/useAttributeSubmit";
import { SidebarContext } from "@/context/SidebarContext";
import LabelArea from "@/components/form/selectOption/LabelArea";
import InputArea from "@/components/form/input/InputArea";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import DrawerButton from "@/components/form/button/DrawerButton";

const AttributeChildDrawer = ({ id }) => {
  const { lang } = useContext(SidebarContext);
  const { t } = useTranslation();
  const [isColorAttribute, setIsColorAttribute] = useState(false);

  const {
    handleSubmit,
    onSubmits,
    register,
    errors,
    isSubmitting,
    published,
    setPublished,
    handleSelectLanguage,
    hexColor,
    setHexColor,
    setValue,
  } = useAttributeSubmit(id);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          // Get the parent attribute to check if it's a color attribute
          const parentAttributeId = window.location.pathname.split("/")[2];
          const parentAttribute = await AttributeServices.getAttributeById(parentAttributeId);
          
          if (parentAttribute) {
            const isColor = parentAttribute.title?.en?.toLowerCase() === "color" || 
                           parentAttribute.name?.en?.toLowerCase() === "color";
            setIsColorAttribute(isColor);
          }
        } catch (err) {
          console.error("Error fetching parent attribute:", err);
        }
      })();
    }
  }, [id]);

  // Sync hexColor with form field
  useEffect(() => {
    if (isColorAttribute) {
      setValue("hexColor", hexColor || "");
    }
  }, [hexColor, isColorAttribute, setValue]);

  const onSubmit = (data) => {
    onSubmits(data);
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("UpdateAttributeValue") : t("AddAttributeValue")}
          description={id ? t("UpdateAttributeValueDesc") : t("AddAttributeValueDesc")}
        />
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("DisplayName")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label={t("DisplayName")}
                  name="name"
                  type="text"
                  placeholder="Color or Size or Dimension or Material or Fabric"
                />
                <Error errorName={errors?.name} />
              </div>
            </div>

            {/* Color Picker - Only show for Color attributes */}
            {isColorAttribute && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("HexColor")} />
                <div className="col-span-8 sm:col-span-4">
                  {/* Hidden input to register hexColor with the form */}
                  <input
                    type="hidden"
                    {...register("hexColor")}
                    value={hexColor || ""}
                  />
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={hexColor || "#000000"}
                      onChange={(e) => setHexColor(e.target.value)}
                      className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={hexColor || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Validate hex color format
                        if (value === "" || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                          setHexColor(value);
                        }
                      }}
                      placeholder="#FF0000"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Error errorName={errors?.hexColor} />
                  {hexColor && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid hex color code (e.g., #FF0000)
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Status" />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  handleProcess={setPublished}
                  processOption={published}
                />
              </div>
            </div>
          </div>

          <DrawerButton
            id={id}
            title="Attribute Value"
            isSubmitting={isSubmitting}
          />
        </form>
      </Scrollbars>
    </>
  );
};

export default AttributeChildDrawer;
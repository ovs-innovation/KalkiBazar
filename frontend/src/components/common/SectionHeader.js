import React from "react";
import useGetSetting from "@hooks/useGetSetting";
import { DEFAULT_STORE_COLOR, getPalette } from "@utils/themeColors";
import useUtilsFunction from "@hooks/useUtilsFunction";

const SectionHeader = ({ title, subtitle, loading = false, error = null, align = "left", badge }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const storeColor = storeCustomizationSetting?.theme?.color || DEFAULT_STORE_COLOR;
  const palette = getPalette(storeColor);

  const getDisplayValue = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return showingTranslateValue(value);
    return String(value);
  };

  const alignmentClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const displayTitle = getDisplayValue(title);
  const displaySubtitle = subtitle ? getDisplayValue(subtitle) : "";

  return (
    <div className={`flex flex-col ${alignmentClass} mb-8 md:mb-10`}>
      {badge && (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3"
          style={{
            background: `linear-gradient(135deg, ${palette[50]}, ${palette[100]})`,
            color: palette[700],
            border: `1px solid ${palette[200]}`,
          }}
        >
          {badge}
        </span>
      )}
      <h2 className="kalki-section-title text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3">
        {displayTitle}
      </h2>
      {displaySubtitle && (
        <p
          className={`text-neutral-500 text-sm md:text-base leading-relaxed max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {displaySubtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;

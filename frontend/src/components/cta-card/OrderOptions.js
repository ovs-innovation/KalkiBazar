import React, { useState } from "react";
import { FaPhoneVolume, FaFilePrescription, FaWhatsapp } from "react-icons/fa";
import PrescriptionUploadModal from "@components/prescription/PrescriptionUploadModal";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { DEFAULT_STORE_COLOR, getPalette } from "@utils/themeColors";

const OrderOptions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const storeColor = storeCustomizationSetting?.theme?.color || DEFAULT_STORE_COLOR;
  const palette = getPalette(storeColor);

  const contactNumber = 
    storeCustomizationSetting?.navbar?.phone || 
    showingTranslateValue(storeCustomizationSetting?.contact_us?.call_box_phone) ||
    globalSetting?.contact ||
    "09240250346";

  const cardBase =
    "flex items-center p-4 md:p-5 rounded-2xl transition-all duration-300 cursor-pointer group border overflow-hidden relative premium-shadow hover-scale bg-white/90 backdrop-blur-sm";

  return (
    <>
      <div className="w-full max-w-5xl mx-auto mt-4 md:mt-6 px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-store-200" />
          <span className="px-4 text-store-600 text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Place Your Order Via
          </span>
          <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-store-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <a
            href={`tel:${contactNumber.replace(/\s+/g, '')}`}
            aria-label="Call to place order"
            className={cardBase}
            style={{ borderColor: palette[200] }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, ${palette[50]}, transparent)` }}
            />
            <div className="relative mr-4">
              <div
                className="p-3.5 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${palette[500]}, ${palette[700]})` }}
              >
                <FaPhoneVolume className="text-white text-xl" />
              </div>
            </div>
            <div className="relative flex flex-col">
              <span className="text-[11px] font-bold tracking-wide uppercase mb-0.5" style={{ color: palette[600] }}>
                Order via Call
              </span>
              <span className="text-neutral-900 font-bold text-base md:text-lg leading-tight group-hover:text-store-700 transition-colors">
                {contactNumber}
              </span>
            </div>
          </a>

          {contactNumber && (
            <a
              href={`https://wa.me/${contactNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I want to buy Medicine.")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact via WhatsApp"
              className={cardBase}
              style={{ borderColor: "#bbf7d0" }}
            >
              <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative mr-4">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3.5 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
              </div>
              <div className="relative flex flex-col">
                <span className="text-[11px] text-emerald-700 font-bold tracking-wide uppercase mb-0.5">
                  Order via WhatsApp
                </span>
                <span className="text-neutral-900 font-bold text-base md:text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                  WhatsApp
                </span>
              </div>
            </a>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className={`${cardBase} w-full text-left`}
            style={{ borderColor: "#bfdbfe" }}
          >
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative mr-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3.5 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                <FaFilePrescription className="text-white text-xl" />
              </div>
            </div>
            <div className="relative flex flex-col">
              <span className="text-[11px] text-blue-700 font-bold tracking-wide uppercase mb-0.5">
                Quick Upload
              </span>
              <span className="text-neutral-900 font-bold text-base md:text-lg leading-tight group-hover:text-blue-700 transition-colors">
                Upload Prescription
              </span>
            </div>
          </button>
        </div>
      </div>

      <PrescriptionUploadModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default OrderOptions;

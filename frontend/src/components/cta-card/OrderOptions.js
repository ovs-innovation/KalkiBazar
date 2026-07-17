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
    "flex items-center p-4 md:p-5 rounded-2xl transition-all duration-350 cursor-pointer group border overflow-hidden relative hover:scale-[1.02] bg-slate-950/30 border-slate-800 backdrop-blur-sm shadow-md";

  return (
    <>
      <div className="w-full max-w-5xl mx-auto mt-4 md:mt-6 px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-yellow-500/40" />
          <span className="px-4 text-yellow-500 text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Place Your Order Via
          </span>
          <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-yellow-500/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <a
            href={`tel:${contactNumber.replace(/\s+/g, '')}`}
            aria-label="Call to place order"
            className={cardBase}
          >
            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative mr-4">
              <div className="p-3.5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-yellow-500/20">
                <FaPhoneVolume className="text-yellow-500 text-xl" />
              </div>
            </div>
            <div className="relative flex flex-col">
              <span className="text-[11px] font-extrabold tracking-wide uppercase mb-0.5 text-yellow-500/80">
                Order via Call
              </span>
              <span className="text-slate-100 font-bold text-base md:text-lg leading-tight group-hover:text-yellow-400 transition-colors">
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
            >
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative mr-4">
                <div className="bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-500/20">
                  <FaWhatsapp className="text-emerald-500 text-xl" />
                </div>
              </div>
              <div className="relative flex flex-col">
                <span className="text-[11px] text-emerald-500/80 font-extrabold tracking-wide uppercase mb-0.5">
                  Order via WhatsApp
                </span>
                <span className="text-slate-100 font-bold text-base md:text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                  WhatsApp
                </span>
              </div>
            </a>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className={`${cardBase} w-full text-left`}
          >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative mr-4">
              <div className="bg-blue-500/10 p-3.5 rounded-2xl border border-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-500/20">
                <FaFilePrescription className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="relative flex flex-col">
              <span className="text-[11px] text-blue-500/80 font-extrabold tracking-wide uppercase mb-0.5">
                Quick Upload
              </span>
              <span className="text-slate-100 font-bold text-base md:text-lg leading-tight group-hover:text-blue-400 transition-colors">
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

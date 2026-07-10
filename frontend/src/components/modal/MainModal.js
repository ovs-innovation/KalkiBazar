import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

const MainModal = ({ modalOpen, setModalOpen, children }) => {
  const cancelButtonRef = useRef();

  return (
    <>
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[100] overflow-y-auto text-center"
          onClose={() => setModalOpen(false)}
          initialFocus={cancelButtonRef}
        >
          <div className="min-h-screen px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 "
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </Transition.Child>
            <div className="absolute right-5 top-5">
              <button
                onClick={() => setModalOpen(false)}
                type="button"
                className="inline-flex justify-center px-3 py-3 text-base font-medium text-neutral-500 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-full hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-store-500 shadow-sm transition-all duration-200"
              >
                <IoClose />
              </button>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default React.memo(MainModal);

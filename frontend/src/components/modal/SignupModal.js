import MainModal from "@components/modal/MainModal";
import { IoClose } from "react-icons/io5";
import SignupRedirectContent from "@components/auth/SignupRedirectContent";

export const SignupContent = SignupRedirectContent;

const SignupModal = ({ modalOpen, setModalOpen }) => {
  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block w-full max-w-md p-0 overflow-hidden text-left align-middle transition-all transform bg-[#0c0d12] border border-zinc-800/90 shadow-2xl rounded-3xl relative">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black text-white">Login or Sign up</h2>
              <p className="text-zinc-400 text-sm mt-1">Access member benefits and fast checkout</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
              aria-label="Close"
            >
              <IoClose size={22} />
            </button>
          </div>
          <SignupContent onSuccess={() => setModalOpen(false)} />
        </div>
      </div>
    </MainModal>
  );
};

export default SignupModal;

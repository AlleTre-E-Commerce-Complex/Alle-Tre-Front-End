import React from "react";
import { Modal } from "semantic-ui-react";

const LogoutModal = ({ open, setOpen, onLogout }) => {
  return (
    <Modal
      className="sm:w-[400px] w-full h-auto bg-transparent scale-in"
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="sm:w-[400px] w-full h-auto  rounded-2xl bg-background pb-6 pt-4">
        <h1 className="text-black font-semibold text-lg text-center">
          Confirm Logout
        </h1>
        <p className="text-gray-dark text-center mx-8 text-base font-normal pt-4">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-x-6 pt-6">
          <button
            onClick={() => setOpen(false)}
            className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-red-600 hover:text-red-600"
          >
            Cancel
          </button>
          <button
            onClick={onLogout}
            className="bg-primary text-white w-[120px] h-[40px] rounded-lg text-base font-normal"
          >
            Log Out
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;

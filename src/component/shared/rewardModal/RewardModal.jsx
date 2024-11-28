import React from "react";
import { Modal } from "semantic-ui-react";
import { IoClose } from "react-icons/io5";
import rewardImage from "../../../assets/images/rewardPage.jpg";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";

const RewardModal = ({ open, setOpen, user }) => {

  const dispatch = useDispatch();

  const handelRegister = () => {
    if (!user) {
      dispatch(Open());
      setOpen(false);
    }
  };

  return (
    <Modal
      className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-500 hover:text-primary"
        >
          <IoClose size={20} />
        </button>
        <img
          src={rewardImage}
          alt="Reward"
          className="w-full h-auto cursor-pointer"
          onClick={handelRegister}
        />
      </div>
    </Modal>
  );
};

export default RewardModal;

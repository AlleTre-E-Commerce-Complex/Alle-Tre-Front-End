import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { setBlockedUser } from "redux-store/blocked-user-slice";
import routes from "routes";

const BlockedModal = () => {
  const dispatch = useDispatch();
  const isBlocked = useSelector((state) => state.blockedUser.isBlocked);
  const history = useHistory()

  if (!isBlocked) return null;

  const handleClose = () => {
    dispatch(setBlockedUser(false)); // Close the modal
    history.push(routes.app.home)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[99999]">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-red-500">Access Blocked</h2>
        <p className="mt-4">Your account is blocked by admin. Please contact support.</p>
        <button
          onClick={handleClose}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded "
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BlockedModal;

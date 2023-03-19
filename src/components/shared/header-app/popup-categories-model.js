import { motion } from "framer-motion";

const PopupCategoriesModel = ({ isOpen, onClose, children }) => {
  const arrowSize = 15;

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={onClose}
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          />
          <motion.div
            className="fixed top-40 right-48 z-50"
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 fixed top-40 right-60 "
              style={{ zIndex: 50 }}
            >
              {children}
              <span
                className="absolute bg-white border-b border-r border-l rounded-md transform -rotate-45 -top-3.5 right-10"
                style={{
                  width: arrowSize * 2,
                  height: arrowSize * 2,
                  top: -arrowSize,
                  borderColor: "transparent",
                  borderTopColor: "white",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default PopupCategoriesModel;

import { motion } from "framer-motion";

import ElectronicsImg from "../../../../src/assets/img/Electronics-img.png";
import PropertiesImg from "../../../../src/assets/img/Properties-img.png";
import VehiclesImg from "../../../../src/assets/img/vehicles-img.png";
import JewerlyImg from "../../../../src/assets/img/Jewerly-img.png";
import useGetGatogry from "../../../hooks/use-get-category";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";
import { useState } from "react";

const PopupCategoriesModel = ({ isOpen, onClose, children }) => {
  const arrowSize = 15;

  const [activeSidebar, setActiveSidebar] = useState("Electronic Devices");

  const [categoryId, setCategoryId] = useState();

  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(
    categoryId || GatogryOptions[0]?.value
  );

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
            <div className="max-w-6xl">
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 fixed md:w-auto w-4/5 top-40 right-28 md:right-60 h-auto"
                style={{ zIndex: 50 }}
              >
                <>
                  <div className="flex ">
                    {/* sidebare-catigory */}
                    <div className="w-48">
                      {GatogryOptions?.map((e) => (
                        <NavLink
                          id={e?.value}
                          title={e?.text}
                          activeSidebar={activeSidebar}
                          setActiveSidebar={setActiveSidebar}
                          setCategoryId={setCategoryId}
                        />
                      ))}
                    </div>
                    {/* sub-catigory */}
                    <div className="pt-4 w-60">
                      {SubGatogryOptions.map((e) => (
                        <p className="mx-6 text-gray-med text-base font-normal py-1 cursor-pointer">
                          {e?.text}
                        </p>
                      ))}
                    </div>
                    {/* imges */}
                    <div>
                      {activeSidebar === "Electronic Devices" && (
                        <img
                          className="object-cover w-[613px] md:h-[600px] rounded-2xl animate-in"
                          src={ElectronicsImg}
                          alt=""
                        />
                      )}
                      {activeSidebar === "Properties" && (
                        <img
                          className="object-cover w-[613px] h-[600px] rounded-2xl animate-in"
                          src={PropertiesImg}
                          alt=""
                        />
                      )}
                      {activeSidebar === "Cars" && (
                        <img
                          className="object-cover w-[613px] h-[600px] rounded-2xl animate-in"
                          src={VehiclesImg}
                          alt=""
                        />
                      )}
                      {activeSidebar === "Jewelry" && (
                        <img
                          className="object-cover w-[613px] h-[600px] rounded-2xl animate-in"
                          src={JewerlyImg}
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                </>

                <span
                  className="absolute bg-white border-b border-r border-l rounded-md transform -rotate-45 -top-3.5 md:right-10 right-28"
                  style={{
                    width: arrowSize * 2,
                    height: arrowSize * 2,
                    top: -arrowSize,
                    borderColor: "transparent",
                    borderTopColor: "white",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export const NavLink = ({
  activeSidebar,
  setActiveSidebar,
  title,
  id,
  setCategoryId,
}) => {
  return (
    <div>
      <p
        onClick={() => {
          setActiveSidebar(title);
          setCategoryId(id);
        }}
        className={`${
          activeSidebar === title
            ? " text-primary  border-b-gray-veryLight border-b-[1px] "
            : " border-b-gray-veryLight border-b-[1px] "
        } text-base text-black font-medium py-5 cursor-pointer flex`}
      >
        <p
          className={`${
            activeSidebar === title
              ? "bg-primary w-2 h-2 rounded-full mt-1.5 mx-4"
              : ""
          } translate delay-100 duration-100 `}
        ></p>
        <p>{title}</p>
      </p>
    </div>
  );
};

export default PopupCategoriesModel;

import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import useGetGatogry from "../../../hooks/use-get-category";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";

const PopupCategoriesModel = ({ isOpen, onClose, children }) => {
  const arrowSize = 15;

  const [categoryId, setCategoryId] = useState();

  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(
    categoryId || GatogryOptions[0]?.value
  );
  const [activeSidebar, setActiveSidebar] = useState(GatogryOptions[0]?.text);

  const bannerLinks = GatogryOptions.map((category) => ({
    id: category.value,
    bannerLink: category.bannerLink,
  }));
  useEffect(() => {
    setCategoryId(GatogryOptions[0]?.value);
    setActiveSidebar(GatogryOptions[0]?.text);
  }, [GatogryOptions]);
  const findSliderLinkById = (id) => {
    const foundObject = bannerLinks.find((obj) => obj.id === id);
    if (foundObject) {
      return foundObject.bannerLink;
    }
    return null;
  };
  const bannerLink = findSliderLinkById(categoryId || GatogryOptions[0]?.value);

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
            className="fixed top-0 left-0 w-full h-screen bg-black opacity-50 z-50"
          />
          <motion.div
            className="fixed w-[1000px] top-40 left-1/2 transform -translate-x-1/2 z-50"
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 h-auto"
              style={{ zIndex: 60 }}
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
                  <div className="relative">
                    <Dimmer
                      className=" bg-white/50"
                      active={loadingGatogry || loadingSubGatogry}
                      inverted
                    >
                      <Loader active />
                    </Dimmer>
                    <img
                      className="object-cover w-[613px] md:h-[500px] rounded-2xl animate-in"
                      src={bannerLink}
                      alt="bannerLink"
                    />
                  </div>
                </div>
              </>
              <span
                className="absolute bg-white border-b border-r border-l rounded-md transform -rotate-45 -top-3.5 ltr:md:right-10 rtl:md:left-10 ltr:right-28 rtl:left-28 z-10"
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

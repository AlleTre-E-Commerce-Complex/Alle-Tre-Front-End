import React from "react";

import { FileUploader } from "react-drag-drop-files";

import addImage from "../../../src/assets/icons/add-image.svg";
import TrashIcon from "../../../src/assets/icons/trash-Icon.png";

const fileTypes = ["JPEG", "PNG", "GIF", "JPG", "MOV", "mp4"];

const EditImgeMedia = ({
  imgOne,
  fileOne,
  setFileOne,
  imgTwo,
  fileTwo,
  setFileTwo,
  imgThree,
  fileThree,
  setFileThree,
  imgFour,
  fileFour,
  setFileFour,
  imgFive,
  fileFive,
  setFileFive,
}) => {
  const handleChangeOne = (fileOne) => {
    setFileOne(fileOne);
  };
  const handleChangeTwo = (fileTwo) => {
    setFileTwo(fileTwo);
  };
  const handleChangeThree = (fileThree) => {
    setFileThree(fileThree);
  };
  const handleChangeFour = (fileFour) => {
    setFileFour(fileFour);
  };
  const handleChangeFive = (fileFive) => {
    setFileFive(fileFive);
  };
  console.log("====================================");
  console.log(imgFive);
  console.log(fileFive);
  console.log(fileFour);
  console.log(imgOne);
  console.log("====================================");

  return (
    <div className="">
      <div
        className={
          imgOne || fileOne ? "flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4" : ""
        }
      >
        <div className={imgTwo || fileTwo ? " gap-x-4 flex" : ""}>
          <div className="flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4 ">
            {imgOne || fileOne ? (
              <div className="relative">
                <div className="sm:w-[299px] w-full h-[189px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-30 group">
                  <div className="flex justify-center mt-36 ">
                    <button
                      className="w-10 h-10 rounded-full backdrop-blur-md bg-white/50  group-hover:flex  hidden "
                      onClick={() => setFileOne(null)}
                    >
                      <img className="p-3" src={TrashIcon} alt="TrashIcon" />
                    </button>
                  </div>
                </div>
                <FileUploader handleChange={handleChangeOne} name="file">
                  {imgOne ? (
                    <img
                      className="border-primary border-[1px] border-solid rounded-lg w-[299px] h-[189px] object-cover p-[1px]"
                      src={imgOne}
                      alt="img two"
                    />
                  ) : (
                    <img
                      className="border-primary border-[1px] border-solid rounded-lg w-[299px] h-[189px] object-cover p-[1px]"
                      src={URL?.createObjectURL(fileOne)}
                      alt="img two"
                    />
                  )}
                </FileUploader>
              </div>
            ) : (
              <div className={imgOne || fileOne ? "hidden" : ""}>
                <div className="cursor-pointer ">
                  <FileUploader
                    handleChange={handleChangeOne}
                    name="file"
                    types={fileTypes}
                  >
                    <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[299px] h-[189px] flex justify-between cursor-pointer ">
                      <img
                        className="my-auto mx-auto"
                        src={addImage}
                        alt="imgIcon"
                      />
                    </div>
                  </FileUploader>
                </div>
              </div>
            )}
            {imgTwo || fileTwo ? (
              <div className="">
                <div className="relative">
                  <div className=" sm:w-[154px] w-full h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <button
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
                        onClick={() => setFileTwo(null)}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </button>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeTwo} name="file">
                    {imgTwo ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgTwo}
                        alt="img two"
                      />
                    ) : (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={URL?.createObjectURL(fileTwo)}
                        alt="img two"
                      />
                    )}
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${imgOne || fileOne ? "" : "hidden"} ${
                  imgTwo || fileTwo ? "hidden" : ""
                }`}
              >
                <div className="cursor-pointer">
                  <FileUploader
                    handleChange={handleChangeTwo}
                    name="file"
                    types={fileTypes}
                  >
                    <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
                      <img
                        className="my-auto mx-auto"
                        src={addImage}
                        alt="imgIcon"
                      />
                    </div>
                  </FileUploader>
                </div>
              </div>
            )}
            {imgThree || fileThree ? (
              <div>
                <div className="relative">
                  <div className="w-[154px] h-[139px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <button
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
                        onClick={() => setFileThree(null)}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </button>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeThree} name="file">
                    {imgThree ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgThree}
                        alt="img two"
                      />
                    ) : (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                        src={URL?.createObjectURL(fileThree)}
                        alt="img two"
                      />
                    )}
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${imgTwo || fileTwo ? "" : "hidden"} ${
                  imgThree || fileThree ? "hidden" : ""
                }`}
              >
                <div className="cursor-pointer">
                  <FileUploader
                    className="hidden"
                    handleChange={handleChangeThree}
                    name="file"
                    types={fileTypes}
                  >
                    <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
                      <img
                        className="my-auto mx-auto"
                        src={addImage}
                        alt="imgIcon"
                      />
                    </div>
                  </FileUploader>
                </div>
              </div>
            )}
            {imgFour || fileFour ? (
              <div>
                <div className="relative">
                  <div className="w-[154px] h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <button
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
                        onClick={() => setFileFour(null)}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </button>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeFour} name="file">
                    {imgFour ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgFour}
                        alt="img two"
                      />
                    ) : (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                        src={URL?.createObjectURL(fileFour)}
                        alt="img two"
                      />
                    )}
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${imgThree || fileThree ? "" : "hidden"} ${
                  imgFour || fileFour ? "hidden" : ""
                }`}
              >
                <div className="cursor-pointer">
                  <FileUploader
                    className="hidden"
                    handleChange={handleChangeFour}
                    name="file"
                    types={fileTypes}
                  >
                    <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
                      <img
                        className="my-auto mx-auto"
                        src={addImage}
                        alt="imgIcon"
                      />
                    </div>
                  </FileUploader>
                </div>
              </div>
            )}
            {imgFive || fileFive ? (
              <div>
                <div className="relative">
                  <div className="w-[154px] h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <button
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden "
                        onClick={() => setFileFive(null)}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </button>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeFour} name="file">
                    {imgFive ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgFive}
                        alt="img two"
                      />
                    ) : (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                        src={URL?.createObjectURL(fileFive)}
                        alt="img two"
                      />
                    )}
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div className={fileFour || imgFour ? "" : "hidden"}>
                <div className="cursor-pointer">
                  <FileUploader
                    className="hidden"
                    handleChange={handleChangeFive}
                    name="file"
                    types={fileTypes}
                  >
                    <div className="border-gray-med border-[1px] border-dashed rounded-lg w-[154px] h-[139px] flex justify-between cursor-pointer ">
                      <img
                        className="my-auto mx-auto"
                        src={addImage}
                        alt="imgIcon"
                      />
                    </div>
                  </FileUploader>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditImgeMedia;

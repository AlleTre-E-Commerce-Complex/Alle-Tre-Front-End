import React from "react";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

import addImage from "../../../src/assets/icons/add-image.svg";
import TrashIcon from "../../../src/assets/icons/trash-Icon.png";

const fileTypes = ["JPEG", "PNG", "GIF"];

const AddImgMedia = () => {
  const [fileOne, setFileOne] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [fileThree, setFileThree] = useState(null);
  const [fileFour, setFileFour] = useState(null);
  const [fileFive, setFileFive] = useState(null);

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
  // console.log(fileOne);
  // console.log(fileTwo);
  // console.log(fileThree);
  // console.log(fileFour);
  // console.log(fileFive);
  console.log("====================================");
  return (
    <div className="">
      <div className={fileOne && "flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4"}>
        <div className={fileTwo && " gap-x-4 flex"}>
          <div className="flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4 ">
            {fileOne ? (
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
                  <img
                    className="border-primary border-[1px] border-solid rounded-lg w-[299px] h-[189px] object-cover p-[1px]"
                    src={URL?.createObjectURL(fileOne)}
                    alt="img two"
                  />
                </FileUploader>
              </div>
            ) : (
              <div className={fileOne && "hidden"}>
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
            {fileTwo ? (
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
                    <img
                      className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                      src={URL?.createObjectURL(fileTwo)}
                      alt="img two"
                    />
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${fileOne ? "" : "hidden"} ${fileTwo && "hidden"}`}
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
            {fileThree ? (
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
                    <img
                      className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                      src={URL?.createObjectURL(fileThree)}
                      alt="img two"
                    />
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${fileTwo ? "" : "hidden"} ${
                  fileThree && "hidden"
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
            {fileFour ? (
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
                    <img
                      className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                      src={URL?.createObjectURL(fileFour)}
                      alt="img two"
                    />
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${fileThree ? "" : "hidden"} ${
                  fileFour && "hidden"
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
            {fileFive ? (
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
                    <img
                      className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                      src={URL?.createObjectURL(fileFive)}
                      alt="img two"
                    />
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div className={fileFour ? "" : "hidden"}>
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

export default AddImgMedia;

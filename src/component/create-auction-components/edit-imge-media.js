import React from "react";

import { FileUploader } from "react-drag-drop-files";

import addImage from "../../../src/assets/icons/add-image.svg";
import TrashIcon from "../../../src/assets/icons/trash-Icon.png";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { toast } from "react-hot-toast";

const fileTypes = ["JPEG", "PNG", "GIF", "JPG", "MOV", "mp4"];

const EditImgeMedia = ({
  auctionId,
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
  onReload,
  setLoadingImg,
}) => {
  const { run: runDelete, isLoading: isloadingDelete } = useAxios([]);
  const handelDeleteImg = (imgId) => {
    runDelete(
      authAxios.delete(api.app.Imagees.delete(auctionId, imgId)).then((res) => {
        toast.success("img delete success");
        onReload();
      })
    );
  };
  const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);

  const handleChangeOne = (fileOne) => {
    const formData = new FormData();
    formData.append("image", fileOne);
    runUpload(
      authAxios
        .patch(api.app.Imagees.upload(auctionId), formData)
        .then((res) => {
          onReload();
        })
    );
    setLoadingImg(isloadingUpload);
    setFileOne(fileOne);
  };
  const handleChangeTwo = (fileTwo) => {
    const formData = new FormData();
    formData.append("image", fileTwo);
    runUpload(
      authAxios
        .patch(api.app.Imagees.upload(auctionId), formData)
        .then((res) => {
          onReload();
        })
    );
    setLoadingImg(isloadingUpload);
    setFileTwo(fileTwo);
  };
  const handleChangeThree = (fileThree) => {
    const formData = new FormData();
    formData.append("image", fileThree);
    runUpload(
      authAxios
        .patch(api.app.Imagees.upload(auctionId), formData)
        .then((res) => {
          onReload();
        })
    );
    setLoadingImg(isloadingUpload);
    setFileThree(fileThree);
  };
  const handleChangeFour = (fileFour) => {
    const formData = new FormData();
    formData.append("image", fileFour);
    runUpload(
      authAxios
        .patch(api.app.Imagees.upload(auctionId), formData)
        .then((res) => {
          onReload();
        })
    );
    setLoadingImg(isloadingUpload);
    setFileFour(fileFour);
  };
  const handleChangeFive = (fileFive) => {
    const formData = new FormData();
    formData.append("image", fileFive);
    runUpload(
      authAxios
        .patch(api.app.Imagees.upload(auctionId), formData)
        .then((res) => {
          onReload();
        })
    );
    setLoadingImg(isloadingUpload);
    setFileFive(fileFive);
  };

  return (
    <div className="">
      <div
        className={
          imgOne?.imageLink || fileOne
            ? "flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4"
            : ""
        }
      >
        <div className={imgTwo?.imageLink || fileTwo ? " gap-x-4 flex" : ""}>
          <div className="flex flex-wrap gap-y-4 md:gap-y-0 gap-x-4 ">
            {imgOne || fileOne ? (
              <div className="relative">
                <div className="sm:w-[299px] w-full h-[189px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-30 group">
                  <div className="flex justify-center mt-36 ">
                    <div
                      className="w-10 h-10 rounded-full backdrop-blur-md bg-white/50  group-hover:flex  hidden  cursor-pointer"
                      onClick={() => {
                        handelDeleteImg(imgOne?.id);
                        setFileOne(null);
                      }}
                    >
                      <img className="p-3" src={TrashIcon} alt="TrashIcon" />
                    </div>
                  </div>
                </div>
                <FileUploader handleChange={handleChangeOne} name="file">
                  {imgOne?.imageLink ? (
                    <img
                      className="border-primary border-[1px] border-solid rounded-lg w-[299px] h-[189px] object-cover p-[1px]"
                      src={imgOne?.imageLink}
                      alt="img one"
                    />
                  ) : (
                    <img
                      className="border-primary border-[1px] border-solid rounded-lg w-[299px] h-[189px] object-cover p-[1px]"
                      src={URL?.createObjectURL(fileOne)}
                      alt="img one"
                    />
                  )}
                </FileUploader>
              </div>
            ) : (
              <div className={imgOne?.imageLink || fileOne ? "hidden" : ""}>
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
            {imgTwo?.imageLink || fileTwo ? (
              <div className="">
                <div className="relative">
                  <div className=" sm:w-[154px] w-full h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <div
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden cursor-pointer "
                        onClick={() => {
                          handelDeleteImg(imgTwo?.id);
                          setFileTwo(null);
                        }}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </div>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeTwo} name="file">
                    {imgTwo?.imageLink ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgTwo?.imageLink}
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
                className={`${imgOne?.imageLink || fileOne ? "" : "hidden"} ${
                  imgTwo?.imageLink || fileTwo ? "hidden" : ""
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
            {imgThree?.imageLink || fileThree ? (
              <div>
                <div className="relative">
                  <div className="w-[154px] h-[139px] hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <div
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden cursor-pointer "
                        onClick={() => {
                          handelDeleteImg(imgThree?.id);
                          setFileThree(null);
                        }}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </div>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeThree} name="file">
                    {imgThree?.imageLink ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgThree?.imageLink}
                        alt="img Three"
                      />
                    ) : (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                        src={URL?.createObjectURL(fileThree)}
                        alt="img Three"
                      />
                    )}
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${imgTwo?.imageLink || fileTwo ? "" : "hidden"} ${
                  imgThree?.imageLink || fileThree ? "hidden" : ""
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
            {imgFour?.imageLink || fileFour ? (
              <div>
                <div className="relative">
                  <div className="w-[154px] h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <div
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden cursor-pointer"
                        onClick={() => {
                          handelDeleteImg(imgFour?.id);
                          setFileFour(null);
                        }}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </div>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeFour} name="file">
                    {imgFour?.imageLink ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgFour?.imageLink}
                        alt="img Four"
                      />
                    ) : (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                        src={URL?.createObjectURL(fileFour)}
                        alt="img Four"
                      />
                    )}
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div
                className={`${
                  imgThree?.imageLink || fileThree ? "" : "hidden"
                } ${imgFour?.imageLink || fileFour ? "hidden" : ""}`}
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
            {imgFive?.imageLink || fileFive ? (
              <div>
                <div className="relative">
                  <div className="w-[154px] h-[139px]  hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 group ">
                    <div className="flex justify-center mt-24 ">
                      <div
                        className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5 group-hover:block hidden cursor-pointer"
                        onClick={() => {
                          handelDeleteImg(imgFive?.id);
                          setFileFive(null);
                        }}
                      >
                        <img
                          className="p-[9px]"
                          src={TrashIcon}
                          alt="TrashIcon"
                        />
                      </div>
                    </div>
                  </div>
                  <FileUploader handleChange={handleChangeFour} name="file">
                    {imgFive?.imageLink ? (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px] "
                        src={imgFive?.imageLink}
                        alt="img five"
                      />
                    ) : (
                      <img
                        className=" border-primary border-[1px] border-solid rounded-lg w-[154px] h-[139px] object-cover p-[1px]"
                        src={URL?.createObjectURL(fileFive)}
                        alt="img five"
                      />
                    )}
                  </FileUploader>
                </div>
              </div>
            ) : (
              <div className={fileFour || imgFour?.imageLink ? "" : "hidden"}>
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

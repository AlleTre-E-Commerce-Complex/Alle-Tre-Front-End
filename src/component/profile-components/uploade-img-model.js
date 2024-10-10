import { useState, useCallback } from "react";
import { Button, Divider, Modal } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import addImageIcon from "../../../src/assets/icons/add-image-icon.png";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import { toast } from "react-hot-toast";
import api from "../../api";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const UploadeImgModel = ({
  onReload,
  oldimg,
  IsImgModelOpen,
  setImgModelOpen,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [editor, setEditor] = useState(null);
  const [dropzoneActive, setDropzoneActive] = useState(true);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setDropzoneActive(false);
  };

  const { run, isLoading } = useAxios([]);
  const handleSave = () => {
    const formData = new FormData();
    formData.append("image", file);
    if (editor && file) {
      run(
        authAxios
          .put(api.app.profile.editPersonalInfo, formData)
          .then((res) => {
            toast.success(
              selectedContent[localizationKeys.uploadImageHasbeenSuccessfully]
            );
            setDropzoneActive(true);
            setOpen(false);
            setFile(null);
            onReload();
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message?.[lang] ||
                selectedContent[localizationKeys.oops]
            );
          })
      );
    }
  };

  return (
    <Modal
      className="sm:w-[368px] w-full h-auto bg-transparent scale-in shadow-none "
      onClose={() => {
        setFile(null);
        setDropzoneActive(true);
        setOpen(false);
        setImgModelOpen(false);
      }}
      onOpen={() => setOpen(true)}
      open={IsImgModelOpen || open}
      trigger={
        <Button className="bg-secondary-veryLight text-secondary opacity-100 w-[132px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2 ltr:font-serifEN rtl:font-serifAR">
          {oldimg
            ? selectedContent[localizationKeys.editPhoto]
            : selectedContent[localizationKeys.uploadPhoto]}
        </Button>
      }
    >
      <div className="sm:w-[368px] w-full h-auto border-2 border-primary rounded-2xl bg-background p-9">
        <Dropzone
          onDrop={handleDrop}
          disabled={!dropzoneActive}
          accept={{ 'image/*': [] }} // Accepts all image types
        >

          {({ getRootProps, getInputProps, open }) => (
            <div>
              <h1 className="text-start text-gray-dark text-base font-medium ">
                {selectedContent[localizationKeys.uploadPhoto]}
              </h1>
              <div
                dir="ltr"
                className="relative  cursor-pointer w-[299px] h-[203px] rounded-lg border-dashed border-gray-dark border-[1px] mx-auto overflow-hidden mt-4"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {file ? (
                  <>
                    <AvatarEditor
                      className="relative -top-14 "
                      ref={setEditor}
                      image={URL.createObjectURL(file)}
                      border={50}
                      borderRadius={100}
                      color={[255, 255, 255, 0.6]}
                      scale={1}
                    />
                  </>
                ) : (
                  <span className="absolute text-gray-med font-normal text-sm px-9 pt-20 ltr:left-0 rtl:left-8 cursor-pointer">
                    <img
                      className="w-8 h-8 mx-auto mb-3"
                      src={addImageIcon}
                      alt="addImageIcon"
                    />
                    {
                      selectedContent[
                        localizationKeys.dropYourPhotoHereToInstantlyUploadIt
                      ]
                    }
                  </span>
                )}
              </div>

              <Divider className="text-gray-dark text-base mx-10" horizontal>
                <div className="text-gray-dark text-base font-normal">
                  {selectedContent[localizationKeys.or]}
                </div>
              </Divider>
              <div className="flex justify-center mx-6 sm:mx-0 ">
                <div className="">
                  <Button
                    loading={isLoading}
                    className="bg-primary hover:bg-primary-dark text-white text-base font-normal w-[304px] h-[48px] rounded-lg opacity-100 ltr:font-serifEN rtl:font-serifAR mx-auto"
                    onClick={file ? () => handleSave() : () => open()}
                  >
                    {file
                      ? selectedContent[localizationKeys.save]
                      : selectedContent[localizationKeys.selectAfile]}
                  </Button>
                  <button
                    className="border-primary border-[1px] text-primary w-[304px] h-[48px] rounded-lg mt-4"
                    onClick={() => {
                      setOpen(false);
                      setFile(null);
                      setDropzoneActive(true);
                    }}
                  >
                    {selectedContent[localizationKeys.cancel]}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    </Modal>
  );
};

export default UploadeImgModel;

import { useState, useCallback } from "react";
import { Modal } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import { toast } from "react-hot-toast";
import api from "../../api";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { MdCloudUpload, MdClose, MdPhotoCamera } from "react-icons/md";

const UploadeImgModel = ({
  onReload,
  oldimg,
  IsImgModelOpen,
  setImgModelOpen,
  customTrigger,
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
    if (editor && file) {
      const formData = new FormData();
      formData.append("image", file);
      run(
        authAxios
          .put(api.app.profile.editPersonalInfo, formData)
          .then((res) => {
            toast.success(
              selectedContent[localizationKeys.imageUpdatedSuccessfully] || "Image updated successfully"
            );
            setDropzoneActive(true);
            setOpen(false);
            if(setImgModelOpen) setImgModelOpen(false);
            setFile(null);
            onReload();
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message?.[lang] ||
                selectedContent[localizationKeys.oops] || "Oops! Something went wrong."
            );
          })
      );
    }
  };

  const closeModal = () => {
      setOpen(false);
      setFile(null);
      setDropzoneActive(true);
      if(setImgModelOpen) setImgModelOpen(false);
  };

  return (
    <Modal
      className="sm:w-[420px] w-[95%] h-auto bg-transparent scale-in shadow-none"
      onClose={closeModal}
      onOpen={() => setOpen(true)}
      open={IsImgModelOpen || open}
      trigger={
        customTrigger ? customTrigger : (
          <button className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-[#34415C] dark:text-gray-200 border border-gray-200 dark:border-gray-700 w-full px-4 py-2 text-sm font-medium rounded-xl transition-all">
            <MdPhotoCamera size={18} />
            {oldimg
              ? selectedContent[localizationKeys.editPhoto]
              : selectedContent[localizationKeys.uploadPhoto]}
          </button>
        )
      }
    >
      <div className="w-full h-auto border border-gray-100 dark:border-gray-800/60 rounded-3xl bg-white dark:bg-primary-dark shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800/50">
          <h1 className="text-[#34415C] dark:text-white text-lg font-bold">
            {selectedContent[localizationKeys.uploadPhoto] || "Upload Photo"}
          </h1>
          <button 
            onClick={(e) => { e.stopPropagation(); closeModal(); }}
            className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-6">
          <Dropzone
            onDrop={handleDrop}
            disabled={!dropzoneActive}
            accept={{ 'image/*': [] }}
          >
            {({ getRootProps, getInputProps, open }) => (
              <div className="flex flex-col items-center">
                <div
                  className={`relative cursor-pointer w-full h-[240px] rounded-2xl border-2 border-dashed ${file ? 'border-transparent bg-gray-50 dark:bg-gray-800/50' : 'border-gray-300 dark:border-gray-600 hover:border-[#d6a536] dark:hover:border-[#d6a536] hover:bg-gray-50 dark:hover:bg-gray-800/50'} flex flex-col items-center justify-center transition-all overflow-hidden mx-auto`}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="w-full h-full flex flex-col items-center justify-center pt-8">
                      <AvatarEditor
                        className="rounded-full shadow-lg"
                        ref={setEditor}
                        image={URL.createObjectURL(file)}
                        width={160}
                        height={160}
                        border={0}
                        borderRadius={100}
                        color={[0, 0, 0, 0.4]}
                        scale={1}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center px-6">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                        <MdCloudUpload size={32} />
                      </div>
                      <p className="text-[#34415C] dark:text-gray-200 font-semibold mb-1">
                        {selectedContent[localizationKeys.dropYourPhotoHereToInstantlyUploadIt] || "Drop your photo here"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full mt-6 space-y-3">
                  <button
                    disabled={isLoading}
                    className="w-full bg-[#34415C] dark:bg-primary hover:bg-[#2a3449] dark:hover:bg-primary-dark text-white text-base font-medium py-3.5 rounded-xl transition-all shadow-sm flex justify-center items-center"
                    onClick={file ? (e) => { e.stopPropagation(); handleSave(); } : (e) => { e.stopPropagation(); open(); }}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : file ? (
                      selectedContent[localizationKeys.save] || "Save"
                    ) : (
                      selectedContent[localizationKeys.selectAfile] || "Select File"
                    )}
                  </button>
                  
                  {file && (
                    <button
                      disabled={isLoading}
                      className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-base font-medium py-3.5 rounded-xl transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setDropzoneActive(true);
                      }}
                    >
                      {selectedContent[localizationKeys.cancel]}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </Modal>
  );
};

export default UploadeImgModel;

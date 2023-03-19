import { useState, useCallback } from "react";
import { Button, Divider, Modal } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import addImageIcon from "../../../src/assets/icons/add-image-icon.png";

const UploadeImgModel = ({ onReload }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [editor, setEditor] = useState(null);
  const [dropzoneActive, setDropzoneActive] = useState(true);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setDropzoneActive(false);
  };

  const handleSave = () => {
    if (editor && file) {
      console.log(file);
    }
  };

  return (
    <Modal
      className="sm:w-[368px] w-full h-auto bg-transparent scale-in shadow-none "
      onClose={() => {
        setFile(null);
        setDropzoneActive(true);
        setOpen(false);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button className="bg-secondary-veryLight text-secondary opacity-100 w-[132px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2">
          Upload Photo
        </Button>
      }
    >
      <div className="sm:w-[368px] w-full h-auto border-2 border-primary rounded-2xl bg-background p-9">
        <Dropzone
          onDrop={handleDrop}
          disabled={!dropzoneActive}
          accept="image/*"
        >
          {({ getRootProps, getInputProps, open }) => (
            <div>
              <h1 className="text-gray-dark text-base font-medium ">
                Upload Photo
              </h1>
              <div
                className="relative  w-[299px] h-[203px] rounded-lg border-dashed border-gray-dark border-[1px] mx-auto overflow-hidden mt-4"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {file ? (
                  <>
                    <AvatarEditor
                      className="relative -top-14 object-cover"
                      ref={setEditor}
                      image={URL.createObjectURL(file)}
                      border={50}
                      borderRadius={100}
                      color={[255, 255, 255, 0.6]}
                      scale={1}
                    />
                  </>
                ) : (
                  <span className="absolute text-gray-med font-normal text-sm px-9 pt-20">
                    <img
                      className="w-8 h-8 mx-auto mb-3"
                      src={addImageIcon}
                      alt="addImageIcon"
                    />
                    Drop your photo here to instantly upload it
                  </span>
                )}
              </div>

              <Divider className="text-gray-dark text-base mx-10" horizontal>
                <div className="text-gray-dark text-base font-normal">OR</div>
              </Divider>
              <button
                className="bg-primary hover:bg-primary-dark text-white w-[304px] h-[48px] rounded-lg"
                onClick={file ? () => handleSave() : () => open()}
              >
                {file ? "Save" : " Select a file"}
              </button>
              <button
                className="border-primary border-[1px] text-primary w-[304px] h-[48px] rounded-lg mt-4"
                onClick={() => {
                  setOpen(false);
                  setFile(null);
                  setDropzoneActive(true);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </Dropzone>
      </div>
    </Modal>
  );
};

export default UploadeImgModel;

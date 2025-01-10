import React, { useState } from "react";
import { Modal } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";

const DeliveryIssueModal = ({ open, setOpen, auctionId }) => {
  const [lang] = useLanguage("");
  const [isOther, setIsOther] = useState(false);
  const [showSelecImageInput, setShowSelecImageInput] = useState(true);
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const selectedContent = content[lang];
  const isArabic = lang === "ar";

  const inputData = [
    {
      id: "issue1",
      value: "the product does not delivered yet",
      labelValue: `${selectedContent[localizationKeys.NotDeliveredYet]}`,
    },
    {
      id: "issue2",
      value: "Product is not same like picture",
      labelValue:
        selectedContent[localizationKeys.ProductIsNotAsShownInPicture],
    },
    {
      id: "issue3",
      value: "product has issues which is not mention in the description",
      labelValue:
        selectedContent[
          localizationKeys
            .DoesProductHaveAnyIssueWhichIsNotMentionedInTheDescription
        ],
    },
    {
      id: "issue4",
      value: "other",
      labelValue: selectedContent[localizationKeys.Others],
    },
  ];

  const { run: runDeleveryIssue } = useAxios([]);

  const submitDeleveryIssueHandler = () => {
    if (issue === "" || description === "") {
      toast.error(
        issue === ""
          ? selectedContent[localizationKeys.PleaseSelectAnyOption]
          : selectedContent[localizationKeys.PleaseGiveTheDescription]
      );
    } else {
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));
      formData.append("message", `${issue} - Description: ${description}`);
      formData.append("auctionId", auctionId);
      formData.append("auctionStatus", "WAITING_FOR_DELIVERY");

      runDeleveryIssue(
        authAxios.post(api.app.auctions.deliveryIssue, formData).then((res) => {
          if (res?.data?.success) {
            toast.success(
              selectedContent[localizationKeys.ThankYouForYourSubmission]
            );
            onCancelHandler();
          } else {
            toast.error(
              selectedContent[
                localizationKeys.SorryYourSubmissionHasFailedPleaseTryAgainLater
              ]
            );
          }
        })
      );
    }
  };

  const onCancelHandler = () => {
    setShowSelecImageInput(true);
    setImages([]);
    setIsOther(false);
    setIssue("");
    setDescription("");
    setOpen(false);
  };

  const onInputSelect = (e) => {
    const { value } = e.target;
    setIsOther(value === "other");
    setIssue(value);
    setShowSelecImageInput(value !== "other");
  };

  const handleSelectImage = (e) => {
    try {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 5) {
        toast.error("You can upload a maximum of 5 images.");
      } else {
        setImages((prevImages) => [...prevImages, ...files]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleTextareaChange = (e) => {
    setDescription(e.target.value);
  };
  return (
    <Modal
      className="sm:w-[90%] w-full h-auto bg-transparent scale-in"
      onClose={onCancelHandler}
      open={open}
    >
      <div className="w-full max-w-[500px] h-auto mx-auto rounded-2xl bg-white border-2 border-primary p-4">
        <div
          className={`text-black font-semibold text-xl mb-4 ${
            isArabic ? " text-right" : "text-left"
          }`}
        >
          <h1>{selectedContent[localizationKeys.tellUsYourProblem]}</h1>
        </div>
        <div className="px-2 py-2 leading-7">
          {inputData.map((data, index) => (
            <div key={index} className="flex flex-wrap items-baseline gap-2">
              <div className="flex items-start">
                <input
                  type="radio"
                  id={data.id}
                  onChange={onInputSelect}
                  name="deliveryIssues"
                  value={data.value}
                  className="accent-primary cursor-pointer align-middle mt-1 mr-2"
                />
                <label htmlFor={data.id} className="cursor-pointer">
                  {data.labelValue}
                </label>
              </div>
            </div>
          ))}
          <div>
            <textarea
              className={`w-full border-primary-light border h-[200px] rounded-md px-2 outline-primary text-primary-dark `}
              placeholder={`${selectedContent[localizationKeys.Description]} ${
                isOther ? "*" : ""
              }`}
              name="otherIssues"
              id="OtherIssue"
              onChange={handleTextareaChange}
            />
          </div>
          <div className="relative flex gap-4 mt-4">
            <input
              type="file"
              multiple
              name="IssueImages"
              id="uploadIssueImages"
              className="hidden"
              onChange={handleSelectImage}
            />
            <label
              htmlFor="uploadIssueImages"
              className="cursor-pointer flex items-center justify-center w-full border border-dashed border-gray-400 rounded-md p-4 text-sm text-gray-600 hover:border-primary hover:text-primary"
            >
              <span className="mr-2">📂</span>
              {selectedContent[localizationKeys.uploadImages]}
              <span className="text-xs block ml-2">
                (
                {
                  selectedContent[
                    localizationKeys.youCanOnlySelectUpToFiveImages
                  ]
                }
                )
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              id="captureImage"
              className="hidden"
              onChange={handleSelectImage}
            />
            <label
              htmlFor="captureImage"
              className="cursor-pointer flex items-center justify-center w-auto p-4  md:hidden"
            >
              <IoCameraOutline className="w-7 h-7 text-primary" />
            </label>
          </div>
          <div className="showImages flex flex-wrap mt-4">
            {images.map((file, index) => (
              <div
                key={index}
                className="relative group w-auto h-auto max-w-[150px] max-h-[150px]"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 bg-gray-200 text-red-600 p-2 rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="gap-3 flex justify-center">
          <button
            className="bg-primary hover:bg-primary-dark border border-primary-light text-white py-2 px-3 rounded-md my-2 w-32 h-[40px]"
            onClick={submitDeleveryIssueHandler}
          >
            {selectedContent[localizationKeys.Submit]}
          </button>
          <button
            className="bg-white hover:bg-primary-med hover:bg-gray-med text-primary border border-primary py-2 px-3 rounded-md my-2 w-32 h-[40px]"
            onClick={onCancelHandler}
          >
            {selectedContent[localizationKeys.cancel]}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(DeliveryIssueModal);

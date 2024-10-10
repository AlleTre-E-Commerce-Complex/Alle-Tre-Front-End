import React, {  useState } from "react";
import { Modal } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";

const DeliveryIssueModal = ({ open, setOpen,auctionId }) => {
  const [lang] = useLanguage("");
  const [isOther, setIsOther] = useState(false);
  const [showSelecImageInput, setShowSelecImageInput] = useState(true);
  const [issue, setIssue] = useState("");
  const [Description,setDescription]= useState('')
  const [images, setImages] = useState([]);
  const selectedContent = content[lang];
  const inputData = [
    {
      id: "issue1",
      value: "the product does not delivered yet",
      labelValue: `${selectedContent[localizationKeys.NotDeliveredYet]}`
    },
    {
      id: "issue2",
      value: "Product is not same like picture",
      labelValue: selectedContent[localizationKeys.ProductIsNotAsShownInPicture]
    },
    {
      id: "issue3",
      value: "product has issues which is not mention in the description",
      labelValue:selectedContent[localizationKeys.DoesProductHaveAnyIssueWhichIsNotMentionedInTheDescription]
    },
    {
      id: "issue4",
      value: "other",
      labelValue: selectedContent[localizationKeys.Others],
    },
  ];
  const {
    run: runDeleveryIssue,
    // isLoading: isLoadingDeleveryIssueAuction,
    // error: errorDeleveryIssueAuction,
    // isError: isErrorDeleveryIssueAuction,
  } = useAxios([]);


  const submitDeleveryIssueHandler = () => {
    if (issue === "" || Description === '') {
         
        issue ===  '' ?  
        toast.error(selectedContent[localizationKeys.PleaseSelectAnyOption]) 
        :
        toast.error(selectedContent[localizationKeys.PleaseGiveTheDescription])
    } else {
      const formData = new FormData()
      images.forEach((image) => {
        formData.append(`images`, image); 
      });
      formData.append("message",issue + ' - Description : ' + Description)
      formData.append('auctionId',auctionId)
      formData.append('auctionStatus','WAITING_FOR_DELIVERY')

      runDeleveryIssue(
        authAxios
        .post(api.app.auctions.deliveryIssue,formData)
        .then(res=>{
            console.log('response from backnend of complaints : ',res)
            if(res?.data?.success){
                toast.success(selectedContent[localizationKeys.ThankYouForYourSubmission]);
            }else{
                 toast.error(selectedContent[localizationKeys.SorryYourSubmissionHasFailedPleaseTryAgainLater])   
            }
        })
      )
      onCancelHandler();
    }
  };

  const onCancelHandler = () => {
    setShowSelecImageInput(true);
    setImages([])
    setIsOther(false);
    setIssue("");
    setDescription('')
    setOpen(false);
    
  };

  const onInputSelect = (e) => {
    if (e.target.value === "other") {
      setIsOther(true);
      setIssue(e.target.value);
      setShowSelecImageInput(false);
    } else if (e.target.id === "issue1") {
      setIssue(e.target.value);
      setShowSelecImageInput(true);
      setImages([])
    } else {
      setIsOther(false);
      setIssue(e.target.value);
      setShowSelecImageInput(false);
    }
  };

  const handleSelectImage = (e) => {
    try {
      const files = e.target.files;
      if (files.length > 0) {
        setImages(Array.from(files));
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleTextareaChange = (e) => {
    setDescription(e.target.value)
  };
  return (
    <Modal
      className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
      onClose={onCancelHandler}
    //   onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="w-[500px] h-auto rounded-2xl bg-white border-2 border-primary">
        <div className="bg-primary text-white text-center font-semibold py-2">
          <h1>{selectedContent[localizationKeys.tellUsYourProblem]}</h1>
        </div>
        <div className="px-3 py-2 leading-10">
          {inputData.map((data, index) => {
            return (
              <div key={index} className="flex gap-1 ">
                <input
                  type="radio"
                  id={data.id}
                  onChange={onInputSelect}
                  name="deleveryIssues"
                  value={data.value}
                  className="accent-primary cursor-pointer"
                />
                <label htmlFor={data.id} className="cursor-pointer">
                  {data.labelValue}
                </label>
              </div>
            );
          })}

          <div>
            <textarea
              className={`w-full border-primary-light border h-[200px] rounded-md px-2 outline-primary text-primary-dark `}
              placeholder={`${selectedContent[localizationKeys.Description]} ${isOther ?'*' : ''}`}
              name="otherIssues"
              id="OtherIssue"
              onChange={handleTextareaChange}
            />
          </div>
          <div
            className={`transition-all overflow-hidden duration-300 ${
              !showSelecImageInput ? "max-h-[300px] mt-2" : "max-h-0 mt-0"
            }`}
          >
            <input
              className={`w-full hidden rounded-md px-2 outline-primary text-primary-dark transition-opacity duration-300 ${
                !showSelecImageInput ? "opacity-100" : "opacity-0"
              }`}
              type="file"
              multiple
              name="IssueImages"
              id="uploadIssueImages"
              onChange={handleSelectImage}
            />
            <label
              className="cursor-pointer border border-primary-dark block rounded-md px-2 text-primary hover:bg-primary hover:text-white"
              htmlFor="uploadIssueImages"
            >
              {selectedContent[localizationKeys.UploadYourImageshere]}
              <span className="text-xs">
                {" "}
                ( {selectedContent[localizationKeys.YouCanSelectMultipleImagestogether]} )
              </span>
            </label>
          </div>

          <div className="showImages flex flex-wrap  mt-4">
            {images.map((file, index) => (
              <div key={index} className="relative group w-auto h-auto max-w-[150px] max-h-[150px]">
                <img
                  src={URL.createObjectURL(file)}
                  alt='sorry'
                  className="w-full h-full"
                />
                <button onClick={() => handleDeleteImage(index)} className="absolute top-1/2 right-1/3 text-lg bg-gray-200 text-red p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="gap-3 flex justify-center">
          <button
            className="bg-primary hover:bg-primary-light border border-primary-light text-white py-2 px-3 rounded-md my-2"
            onClick={submitDeleveryIssueHandler}
          >
            {selectedContent[localizationKeys.Submit]}
          </button>

          <button
            className="bg-white hover:bg-primary-veryLight hover:text-primary-dark text-primary border border-primary py-2 px-3 rounded-md my-2"
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

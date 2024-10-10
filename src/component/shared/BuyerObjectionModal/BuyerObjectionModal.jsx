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
const BuyerObjectionModal = ({open, setOpen,auctionId}) => {
    const [lang] = useLanguage(""); 
    const [issue, setIssue] = useState("");
    const [images, setImages] = useState([]);
    const selectedContent = content[lang];
    const {
      run: runDeleveryIssue,
      // isLoading: isLoadingDeleveryIssueAuction,
      // error: errorDeleveryIssueAuction,
      // isError: isErrorDeleveryIssueAuction,
    } = useAxios([]);
  
    const HandleSubmitBuyerObjection = () => {
      if (issue === "") {
        toast.error(selectedContent[localizationKeys.PleaseGiveTheDescription])
      } else {
        const formData = new FormData()
        images.forEach((image) => {
          formData.append(`images`, image); 
        });
        formData.append("message",'Description : ' + issue)
        formData.append('auctionId',auctionId)
        formData.append('auctionStatus','COMPLETED')
  
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
      setImages([])
      setIssue("");
      setOpen(false);
      
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
    
  
    return (
      <Modal
        className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
        onClose={onCancelHandler}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <div className=" sm:w-[500px] h-auto rounded-2xl bg-white border-2 border-primary">
          <div className="bg-primary text-white text-center font-semibold py-2">
            <h1>{selectedContent[localizationKeys.tellUsYourProblem]}</h1>
          </div>
          <div className="px-3 py-2 leading-6">
  
            <div>
              <textarea
                className={`w-full border-primary-light border h-[200px] rounded-md px-2 outline-primary text-primary-dark `}
                placeholder={`${selectedContent[localizationKeys.Description]} `}
                name="otherIssues"
                id="OtherIssue"
                onChange={(e) => setIssue(e.target.value)}
              />
            </div>
            <div>
              <input
                className={`w-full hidden rounded-md px-2 outline-primary text-primary-dark`}
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
              onClick={HandleSubmitBuyerObjection}
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
}

export default BuyerObjectionModal

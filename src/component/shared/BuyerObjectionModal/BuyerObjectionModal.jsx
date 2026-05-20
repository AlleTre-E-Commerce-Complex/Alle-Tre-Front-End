import React, {  useState } from "react";
import { Modal, Dimmer } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";
import LoadingTest3arbon from "../lotties-file/loading-test-3arbon";

const BuyerObjectionModal = ({open, setOpen,auctionId}) => {
    const [lang] = useLanguage(""); 
    const [issue, setIssue] = useState("");
    const [images, setImages] = useState([]);
    const selectedContent = content[lang];
    const {
      run: runDeleveryIssue,
      isLoading: isLoadingDeleveryIssueAuction,
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
        <Dimmer active={isLoadingDeleveryIssueAuction} inverted className="fixed w-full h-full top-0 bg-white/50 z-[100]">
          <LoadingTest3arbon />
        </Dimmer>
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
                {selectedContent[localizationKeys.uploadImages]}
                <span className="text-xs">
                  {" "}
                  ( {selectedContent[localizationKeys.YouCanSelectMultipleImagestogether]} )
                </span>
              </label>
            </div>
  
            <div className="showImages flex flex-wrap  mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative group w-auto h-auto max-w-[150px] max-h-[150px]">
                  {file.type.startsWith("video/") ? (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover rounded-md"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(file)}
                      alt='sorry'
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                  <button onClick={() => handleDeleteImage(index)} className="absolute top-1/2 right-1/3 text-lg bg-gray-200 text-red p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="px-3">
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3">
              <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                {selectedContent[localizationKeys.objectionWarning]}
              </p>
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

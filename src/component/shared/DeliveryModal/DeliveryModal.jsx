import { useLanguage } from 'context/language-context';
import content from 'localization/content';
import localizationKeys from 'localization/localization-keys';
import React, { useState } from 'react'
import { Dimmer, Modal } from 'semantic-ui-react'
import { authAxios } from 'config/axios-config.js';
import api from 'api.js';
import useAxios from 'hooks/use-axios.js';
import toast from 'react-hot-toast';
import LodingTestAllatre from '../lotties-file/loding-test-allatre.js';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.js';
import routes from 'routes.js';
const DeliveryModal = ({open,setOpen,auctionId,setSuccessModal}) => {
    const [message,setMessage]= useState('')
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    const history = useHistory()
    const {
        run,
        isLoading,
        // error: errorDeleveryIssueAuction,
        // isError: isErrorDeleveryIssueAuction,
      } = useAxios([]);
    const HandleCancel =()=>{
        setOpen(false)
    }
    const HandleSubmit = ()=>{
        run(
            authAxios
            .put(api.app.auctions.send_item_forDelivery(auctionId),{message})
            .then(res=>{
                if(res?.data?.success){
                    // setSuccessModal(true) 
                    toast.success(selectedContent[localizationKeys.YouHaveSuccessfullyNotifiedTheWinner]);
                    history.push(routes.app.profile.myAuctions.sold)
                    HandleCancel()
                }else{
                     toast.error(selectedContent[localizationKeys.SorryYourSubmissionHasFailedPleaseTryAgainLater])   
                }
            })
          )
    }
    return (
        <Modal
        className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        >
    
        <div className='sm:w-[500px] h-auto rounded-2xl bg-white border-2 border-primary'>
        <Dimmer
              className="fixed w-full h-full top-0 bg-white/50"
              active={isLoading}
              inverted
            >
              {/* <Loader active /> */}
              <LodingTestAllatre />
            </Dimmer>
            <div className="bg-primary text-white text-center font-semibold py-2 text-lg">
                <h1>{selectedContent[localizationKeys.didYouSendTheItemForDelivery]}</h1>
            </div> 
            <div className='px-3 py-2 mt-2 ' >
                <p>{selectedContent[localizationKeys.sendMessageToBuyer]}
                    {/* {selectedContent[localizationKeys.optional]} */}
                    </p>
                <textarea
                 className='border p-2 outline-none border-primary rounded w-full min-h-[100px]' name="" id=""
                 placeholder={`${selectedContent[localizationKeys.Message]}`}
                 onChange={(e)=>setMessage(e.target.value)}
                 >
                 </textarea>
            </div>
            <div className='text-center my-5 font-semibold'>
                <button
                    onClick={HandleCancel} 
                    className='bg-white hover:bg-slate-100  text-primary border border-primary-dark mx-5 p-2 rounded-md'>
                    {selectedContent[localizationKeys.cancel]}
                </button>
                <button 
                    onClick={HandleSubmit} 
                    className='bg-primary hover:bg-primary-dark text-white p-2 rounded-md'>
                    {selectedContent[localizationKeys.Submit]}
                </button>
            </div>
    
        </div>
        </Modal>
      )
}

export default React.memo(DeliveryModal)

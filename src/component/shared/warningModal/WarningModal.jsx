import { useLanguage } from 'context/language-context';
import content from 'localization/content';
import localizationKeys from 'localization/localization-keys';
import React from 'react'
import { Dimmer, Modal } from 'semantic-ui-react'
import Warning from '../lotties-file/Warning.jsx';
import { authAxios } from 'config/axios-config.js';
import api from 'api.js';
import useAxios from 'hooks/use-axios.js';
import toast from 'react-hot-toast';
import LodingTestAllatre from '../lotties-file/loding-test-allatre.js';

const WarningModal = ({open,setOpen,auctionId,message,setSuccessModal}) => {
    console.log('auctoin Id in warning Modal:',auctionId);
    
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    const {
        run,
        isLoading,
        // error: errorDeleveryIssueAuction,
        // isError: isErrorDeleveryIssueAuction,
      } = useAxios([]);
    const HandleDiscontinue =()=>{
        setOpen(false)
    }
    const HandleContinue = ()=>{
        run(
            authAxios
            .put(api.app.auctions.cancell_auction(auctionId))
            .then(res=>{
                console.log('response from backnend of complaints : ',res)
                if(res?.data?.success){
                    setSuccessModal(true) 
                    HandleDiscontinue()
                    // toast.success(selectedContent[localizationKeys.YouSuccessfullyCancelledTheAuction]);
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
        <div className="bg-primary text-white text-center font-semibold py-2 text-xl">
            <h1>{selectedContent[localizationKeys.Warning]}</h1>
        </div> 
        <Warning />
        <div className='px-3 py-2 mt-5 text-center font-semibold text-lg' >
            <h1>{message}</h1>
        </div>
        <div className='text-center my-5 font-semibold'>
            <button 
                onClick={HandleDiscontinue} 
                className='bg-primary hover:bg-primary-dark text-white p-2 rounded-md'>
                {selectedContent[localizationKeys.discontinue]}
            </button>
            <button
                onClick={HandleContinue} 
                className='bg-white hover:bg-slate-100  text-primary border border-primary-dark mx-5 p-2 rounded-md'>
                {selectedContent[localizationKeys.ContinueToCancel]}
            </button>
        </div>

    </div>
    </Modal>
  )
}

export default React.memo(WarningModal)

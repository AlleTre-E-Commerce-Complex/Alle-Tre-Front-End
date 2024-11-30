import React from 'react'
import { Dimmer, Modal } from 'semantic-ui-react'
import LodingTestAllatre from '../lotties-file/loding-test-allatre'
import useAxios from 'hooks/use-axios';

import { useLanguage } from 'context/language-context';
import content from 'localization/content';

const WelcomeBonusModal = ({open,setOpen}) => {
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    const {
        run,
        isLoading,
        // error: errorDeleveryIssueAuction,
        // isError: isErrorDeleveryIssueAuction,
      } = useAxios([]);
  return (
    <div>
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
           
        </div> 
        
        <div className='px-3 py-2 mt-5 text-center font-semibold text-lg' >
            <h1>Congratulations! You have received a welcome bonus of 100 AED.</h1>
            <h1>Click on the button below to see your account balance.</h1>
        </div>
        

    </div>
    </Modal>
    </div>
  )
}

export default WelcomeBonusModal

import React, { useState } from 'react'
import { Dimmer, Modal } from 'semantic-ui-react'
import LodingTestAllatre from '../lotties-file/loding-test-allatre'
import localizationKeys from 'localization/localization-keys'
import useAxios from 'hooks/use-axios'
import axios from 'axios'
import { useLanguage } from 'context/language-context'
import content from 'localization/content'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import routes from 'routes'
import api from 'api'
import toast from 'react-hot-toast'

const UnSubscribeModal = ({open,onClose}) => {
const history = useHistory()
const {run, isLoading} = useAxios([])
const [email,setEmail] = useState('')
const [lang] = useLanguage("");
const selectedContent = content[lang];

  const handleUnsubscribe =()=>{
    try {
        run(    
            axios.put(api.app.subscribers.unsubscribeUser,{email})
            .then((res)=>{
                if(res.data.success){
                    toast.success(selectedContent[localizationKeys.unsubscribedSuccessfully])
                }
                onClose()
            })
            .catch((error)=>{
                toast.error(selectedContent[localizationKeys.unsubscriptionFailed])
                onClose()
            })
        )
    } catch (error) {
        console.log(error)
    }
  }
  const handleClose = () =>{
    onClose()
    history.push(routes.app.home)
  }

  return (
    <div>
       <Modal
    className="sm:w-[400px] w-full h-auto bg-transparent scale-in"
    onClose={onClose}
    open={open}
  >
  <Dimmer
  className="fixed w-full h-full top-0 bg-white/50"
  active={isLoading}
  inverted
>
  {/* <Loader active /> */}
  <LodingTestAllatre />
</Dimmer>

    <div className="sm:w-[400px] w-full h-auto rounded-2xl bg-background pb-6 ">
      <div className="bg-primary rounded-t-2xl text-white text-center font-semibold py-2">
         <h1>{selectedContent[localizationKeys.unSubscribe]}</h1>
      </div>
     <div className='mx-2 my-3' >
        <input 
        onChange={(e)=>setEmail(e.target.value)}
        type="email" placeholder={selectedContent[localizationKeys.email]} 
        className='border p-2 border-primary w-full rounded-lg ' name="unsubscribe" id="unsubscribe" />
     </div>
     
      <div className="flex justify-center gap-x-6 pt-6">
        <button
          onClick={handleClose}
          className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-red-600 hover:text-red-600"
        >
          Cancel
        </button>
        <input 
          className="border-gray-400 text-white bg-primary border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:bg-red-600"
         type="button" value={selectedContent[localizationKeys.unSubscribe]} 
         onClick={handleUnsubscribe}/>
      </div>
    </div>
  </Modal>
    </div>
  )
}

export default React.memo(UnSubscribeModal)

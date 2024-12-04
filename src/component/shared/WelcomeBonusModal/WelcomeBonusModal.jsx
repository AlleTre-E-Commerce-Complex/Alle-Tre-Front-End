import React from 'react'
import { Dimmer, Modal } from 'semantic-ui-react'
import LodingTestAllatre from '../lotties-file/loding-test-allatre'
import useAxios from 'hooks/use-axios';

import { useLanguage } from 'context/language-context';
import content from 'localization/content';
import { useDispatch } from 'react-redux';
import { welcomeBonus } from 'redux-store/welcom-bonus-slice';
import { useHistory } from 'react-router-dom';
import routes from 'routes';

const WelcomeBonusModal = ({open,setOpen,isLoading}) => {
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    const dispatch = useDispatch()
    const history = useHistory()
    const handleClick = () => {
      dispatch(welcomeBonus(false))
      setOpen(false)
      history.push(routes.app.profile.wallet)
    }
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
        
        <div onClick={handleClick} className='cursor-pointer px-3 py-2 mt-5 text-center font-semibold text-lg' >
            <h1>Congratulations! You have received a welcome bonus of 100 AED.</h1>
            <h1>Click on the here to see your account balance.</h1>
        </div>
        

    </div>
    </Modal>
    </div>
  )
}

export default WelcomeBonusModal

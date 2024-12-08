import React from 'react'
import { Dimmer, Modal } from 'semantic-ui-react'
import LodingTestAllatre from '../lotties-file/loding-test-allatre'
import welcomeBonusImage from '../../../assets/images/welcomeBonusImage.png'
// import { useLanguage } from 'context/language-context';
// import content from 'localization/content';
import { useDispatch } from 'react-redux';
import { welcomeBonus } from 'redux-store/welcom-bonus-slice';
import { useHistory } from 'react-router-dom';
import routes from 'routes';
import { IoClose } from 'react-icons/io5';

const WelcomeBonusModal = ({open,setOpen,isLoading}) => {
    // const [lang] = useLanguage(""); 
    // const selectedContent = content[lang];
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
    className="sm:w-[400px] w-full rounded-2xl h-auto bg-transparent scale-in"
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={open}
    >

    <div className='sm:w-[400px] h-auto rounded-2xl '>
    <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          {/* <Loader active /> */}
          <LodingTestAllatre />
        </Dimmer>
        
        <div className="relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-500 hover:text-primary"
        >
          <IoClose size={20} />
        </button>
        <img
          src={welcomeBonusImage}
          alt="Reward"
          className="w-full h-auto cursor-pointer rounded-2xl"
          onClick={handleClick}
        />
      </div>
        

    </div>
    </Modal>
    </div>
  )
}

export default WelcomeBonusModal

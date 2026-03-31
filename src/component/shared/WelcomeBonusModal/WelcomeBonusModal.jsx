import React from 'react'
import { Dimmer, Modal } from 'semantic-ui-react'
import LoadingTest3arbon from '../lotties-file/loading-test-3arbon'
import welcomeModal from '../../../assets/images/welcomeModal.png'
// import { useLanguage } from 'context/language-context';
// import content from 'localization/content';
import { useDispatch } from 'react-redux';
import { welcomeBonus } from 'redux-store/welcom-bonus-slice';
import { IoClose } from 'react-icons/io5';

const WelcomeModal = ({open,setOpen,isLoading}) => {
    const dispatch = useDispatch()

    const handleClick = () => {
      setOpen(false)
      dispatch(welcomeBonus(false))
    }
  return (
    <div>
       <Modal
    className="sm:w-[600px] w-full rounded-2xl h-auto bg-transparent scale-in"
    onClose={() => {
      setOpen(false)
      dispatch(welcomeBonus(false))
    }}
    onOpen={() => setOpen(true)}
    open={open}
    >

    <div className='sm:w-[600px] h-auto rounded-2xl '>
    <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          {/* <Loader active /> */}
          <LoadingTest3arbon />
        </Dimmer>
        
        <div className="relative">
        <button
          onClick={() => {
            setOpen(false)
            dispatch(welcomeBonus(false))
          }}
          className="absolute top-2 right-2 flex items-center justify-center text-primary-veryLight hover:text-primary-light z-50"
        >
          <IoClose size={20} />
        </button>
        <img
          src={welcomeModal}
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

export default WelcomeModal


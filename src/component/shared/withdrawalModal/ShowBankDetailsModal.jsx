import { useLanguage } from 'context/language-context';
import useAxios from 'hooks/use-axios';
import content from 'localization/content';
import React, { useEffect, useState } from 'react';
import { Dimmer, Modal } from 'semantic-ui-react';
import LodingTestAllatre from '../lotties-file/loding-test-allatre';
import { authAxios } from 'config/axios-config';
import EmtyWatchlist from "../../../../src/assets/icons/emty-watchlist.png";
import localizationKeys from "../../../localization/localization-keys";
import toast from 'react-hot-toast';

import api from 'api';
import AddNewBankModal from './AddNewBankModal';
import { useAuthState } from 'context/auth-context';


const ShowBankDetailsModal = ({open,setOpen,setSuccessModal,accountBalance}) => {
  const { user } = useAuthState();
  console.log('user***>',user)
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    const {run,isLoading,} = useAxios([]);
  const [amount, setAmount] = useState(0);
  const [selectedBankAccountId,setBankAccountId] = useState('')
  const [accountData,setAccountData] = useState([])
  const [openAddNewBank,setOpenAddNewBank] = useState(false)

  useEffect(()=>{
    run(
        authAxios.get(api.app.Wallet.getAccountData)
        .then((response)=>{
            if(response.data.success){
                setAccountData(response.data.accountData)
            }else {
                toast.error('Please add new bank account.')
            }
        }).catch((error)=>{
            toast.error('Sorry, There are some internal issue, please try again later.')
        })
    )
  },[openAddNewBank,run])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(user.id <= 100 && (Number(accountBalance) - Number(amount) ) < 100 ){
      if (Number(accountBalance) <= 100) {
        toast.error(`Sorry. You can't withdraw the amount of ${amount} AED. AED 100 is reserved as a welcome bonus.`);
      } else {
        toast.error(`You can only withdraw up to ${accountBalance - 100} AED. AED 100 is reserved as a welcome bonus.`);
      }
      return
    }
    if(selectedBankAccountId === ''){
      toast.error('Please Select an account')
    }else if (amount === ''){
        toast.error('The withdrawal amount must not be empty')
    }else if(amount === 0){
      toast.error('The withdrawal amount must be greater than zero')
    }
    
    try {
        run(
            authAxios.post(api.app.Wallet.withdrawalRequest,{
                amount: Number(amount),
                selectedBankAccountId,                
              }).then((response)=>{
                console.log('response of withdrawal request :',response)
                if (response.data.success) {
                    setOpen(false);
                    setSuccessModal(true)
                  } else {
                    // Handle error
                    toast.error(response.data.message);
                  }
              })
        )

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process withdrawal');
    }
  };
  const HandleSelectBankAccount = (id)=>{
    setBankAccountId(id)
  }
  const handleAddNewBanck = ()=>{
    setOpenAddNewBank(true)
  }
 
  if (!open) return null;

return (
    <Modal
    className="md:w-[950px] w-full h-auto bg-transparent scale-in"
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={open}
    >
 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          {/* <Loader active /> */}
          <LodingTestAllatre />
        </Dimmer>
      <div className="bg-white  rounded shadow-md w-full">
        <h2 className="text-lg font-semibold mb-8 bg-primary text-white text-center  ">{selectedContent[localizationKeys.YourBankDetails]}</h2>
        <div className='flex flex-wrap p-6 gap-2'>
        {accountData.map((data) =>
            <div
                key={data.id}
                className={`${selectedBankAccountId === data.id ? 'shadow-md shadow-primary' : ''} 
                            cursor-pointer border p-2 rounded-md text-gray-500 transform 
                            transition-transform duration-300 hover:scale-95`}
                onClick={() => HandleSelectBankAccount(data.id)}
            >
                <h1>{selectedContent[localizationKeys.accountHolderName]} <span>{data.accountHolderName}</span></h1>
                <h1>{selectedContent[localizationKeys.bankName]} <span>{data.bankName}</span></h1>
                <h1>{selectedContent[localizationKeys.bankAccountNumber]} <span>{data.accountNumber}</span></h1>
                <h1>{selectedContent[localizationKeys.IBANnumber]} <span>{data.routingNumber}</span></h1>
            </div>
        )}

            
         
           {!accountData.length &&  
           <div className=" ifNoBankAccount flex justify-center items-center pt-36 w-full ">
            <div>
              <img
                className="w-28 mx-auto"
                src={EmtyWatchlist}
                alt="EmtyWatchlist"
              />
              <h1 className="text-gray-dark pt-10">
                {selectedContent[localizationKeys.ThereAreNoBankAccountAddedYet]}
              </h1>
            </div>
          </div>}
  
         <button onClick={handleAddNewBanck} className="mt-4 hover:bg-primary-dark w-full bg-primary rounded-md text-white px-3 py-2  ">
            {selectedContent[localizationKeys.AddNewBankAccount]}
         </button>
         <div className='w-full my-5'>
            <label htmlFor="">{selectedContent[localizationKeys.EnterTheAmount]} :</label>
            <input
              onChange={(e)=>setAmount(e.target.value)}
              className='border w-full rounded-md p-3 mt-2 outline-none ' 
              placeholder={selectedContent[localizationKeys.Amount]} 
              type="number" min={1} 
              name="withdrawalAmount" 
              id="withdrawalAmount" 
            />
            <span className='text-gray-400 text-xs m-1'>{selectedContent[localizationKeys.AmountMustBeMoreThan1AED]}</span>
         </div>
        </div>
        <div className='flex justify-evenly'>
            <button onClick={handleSubmit} className="mb-7 hover:bg-primary-dark  bg-primary rounded-md text-white px-3 py-2  ">
            {selectedContent[localizationKeys.SubmitWithdrawalRequest]}
            </button>
            <button onClick={()=>setOpen(false)} className="mb-7 hover:bg-primary-dark  bg-primary rounded-md text-white px-3 py-2  ">
            {selectedContent[localizationKeys.GoBack]}
            </button>
        </div>
      </div>
      {openAddNewBank &&
          <AddNewBankModal
          open={openAddNewBank} 
          setOpen={setOpenAddNewBank} 
          />
        }
    </div>


    </Modal>
  )
};

export default React.memo(ShowBankDetailsModal);

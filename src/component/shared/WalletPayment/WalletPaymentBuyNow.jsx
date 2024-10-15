import api from 'api';
import { authAxios } from 'config/axios-config';
import useAxios from 'hooks/use-axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import routes from 'routes';
import { Button } from 'semantic-ui-react'

const WalletPaymentBuyNow = ({amount,walletBalance,auctionId,paymentAPI}) => {
  const history = useHistory()
  const [isWalletPaymentSuccess,setIsWalletPaymentSuccess] = useState(null)
  const { run, isLoading } = useAxios([]);
  const submitWalletPayment = ()=>{
    const body = {
      auctionId,
    };
    run(
      authAxios.post(paymentAPI,body)
      .then((res)=>{
        setIsWalletPaymentSuccess(res?.data?.success)
        if(res?.data?.success){
          toast.success('Payment successful',{
            position: 'top-center', // Position of the toast
          });
          history.push(routes.app.profile.myBids.waitingForDelivery)
        }
      })
      .catch((error)=>{
        toast.error('Payment Failed', {
          position: 'top-center',
        });
      })
    )
  }
  return (
    <div className='flex flex-col justify-center bg-gray-100  h-4/5 rounded-xl p-4 border'>
        <h1 className='text-center text-xl font-bold mb-20'>
            Your Wallet Balance is AED {walletBalance}/-
        </h1>
        <Button
        className="bg-primary hover:bg-primary-dark opacity-100 font-normal text-base ltr:font-serifEN rtl:font-serifAR text-white w-full h-[48px] rounded-lg mt-6"
        loading={isLoading}
        id="submit"
        onClick={submitWalletPayment}
      >
        Pay AED {amount} From Wallet 
      </Button>
    </div>
  )
}

export default WalletPaymentBuyNow

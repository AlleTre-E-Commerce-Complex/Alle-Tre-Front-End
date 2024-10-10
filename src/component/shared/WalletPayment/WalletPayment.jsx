import React from 'react'
import { Button } from 'semantic-ui-react'

const WalletPayment = () => {
  return (
    <div className='flex flex-col justify-center bg-gray-100  h-4/5 rounded-xl p-4 border'>
        <h1 className='text-center text-xl font-bold mb-20'>
            Your Wallet Balance is AED 82500/-
        </h1>
        <Button
        className="bg-primary hover:bg-primary-dark opacity-100 font-normal text-base ltr:font-serifEN rtl:font-serifAR text-white w-full h-[48px] rounded-lg mt-6"
        // loading={isLoading}
        // disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        Pay AED 1000 From Wallet 
      </Button>
    </div>
  )
}

export default WalletPayment

import useAxios from 'hooks/use-axios';
import React, { useEffect, useState } from 'react'
import { Dimmer, Modal } from 'semantic-ui-react';
import { authAxios } from 'config/axios-config';
import api from 'api';
import { useAuthState } from 'context/auth-context';
import LodingTestAllatre from '../lotties-file/loding-test-allatre';
import content from 'localization/content';
import { useLanguage } from 'context/language-context';
import localizationKeys from 'localization/localization-keys';

const ContactDetails = ({ open, onClose, userType,auctionId }) => {
  const {run, isLoading} = useAxios([])
  const { user } = useAuthState();
  const [location,setLocation] = useState('')
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
   

    useEffect(()=>{
        console.log('contact detailst test : ',userType,auctionId,user?.id)
        function fetchUserContact(){
          try {
            console.log('userType : ',userType)
              if(userType === 'SELLER'){
                  run(
                      authAxios
                        .get(`${api.app.auctions.getSellerLocation(auctionId)}`)
                        .then((res) => {
                          console.log('seller location detail :',res.data.data)
                          setLocation(res?.data?.data)
                        })
                    );
              }else if(userType === 'BUYER'){
                  run(
                      authAxios
                        .get(`${api.app.auctions.getBuyerLocation(auctionId)}`)
                        .then((res) => {
                          console.log('buyer location detail :',res.data.data)
                          setLocation(res?.data?.data)
                        })
                    );
              }
          } catch (error) {
              console.log(error)
          }
      }
        fetchUserContact()
    },[run,userType,auctionId,user?.id])
    return (
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
               <h1>{selectedContent[userType === 'SELLER' ? localizationKeys.sellerContactDetails : localizationKeys.buyerContactDetails]}</h1>
            </div>
            <p className="text-gray-dark  mx-8 text-base font-normal pt-4">  
               {selectedContent[localizationKeys.userName]} : {selectedContent[localizationKeys.userName]} : {location.userName}
            </p>
            <p className="text-gray-dark  mx-8 text-base font-normal pt-4">  
                {selectedContent[localizationKeys.email]} : {location.email}
            </p>
            <p className="text-gray-dark  mx-8 text-base font-normal pt-4">  
                {selectedContent[localizationKeys.address]} : {location.address}
            </p>
            <p className="text-gray-dark  mx-8 text-base font-normal pt-4">  
                {selectedContent[localizationKeys.addressLabel]} : {location.addressLabel}
            </p>
            <p className="text-gray-dark  mx-8 text-base font-normal pt-4">  
                {selectedContent[localizationKeys.country]} : {location?.country?.nameEn}
            </p>
            <p className="text-gray-dark  mx-8 text-base font-normal pt-4">  
                {selectedContent[localizationKeys.city]} : {location?.city?.nameEn}
            </p>
            <p className="text-gray-dark  mx-8 text-base font-normal pt-4">  
                {selectedContent[localizationKeys.phoneNumber]} : {location.phone}
            </p>
            <div className="flex justify-center gap-x-6 pt-6">
              <button
                onClick={onClose}
                className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-red-600 hover:text-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      );
}

export default React.memo(ContactDetails)

import React, { useEffect, useState } from 'react';
import { Modal, Button, Dropdown } from 'semantic-ui-react';
import { Dimmer } from 'semantic-ui-react';
import LodingTestAllatre from '../lotties-file/loding-test-allatre';
import useAxios from 'hooks/use-axios';
import { authAxios } from 'config/axios-config';
import api from 'api';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { completePaymentData } from 'redux-store/complete-payment-slice';
import routes from 'routes';
const DeliverySelectingModal = ({ open, setOpen, auctionId, paymentType,lastPrice, sellerLocation }) => {
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const { run, isLoading } = useAxios([]);
  const dispatch = useDispatch();
  const history = useHistory();
  // Options for the dropdown
  const deliveryOptions = [
    { key: 'PICKUP', value: 'PICKUP', text: 'Pick up yourself' },
    { key: 'DELIVERY', value: 'DELIVERY', text: 'Delivery by company' },
  ];

 

  // Descriptions for each delivery type
  const deliveryDescriptions = {
    PICKUP: 'The customer is responsible for the delivery, and there is no fee for delivery.',
    DELIVERY: 'The company will handle the delivery, and the buyer needs to pay the delivery fee.',
  };

  const handleDropdownChange = (e, { value }) => {
    setSelectedOption(value); // Update selected option
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast.error('Please select a delivery type before proceeding.');
      return;
    }
    try {
     
    run(authAxios.put(`${api.app.auctions.setDeliveryType(auctionId)}`,{
      deliveryType:selectedOption
    }))
    .then((res)=>{
      console.log('DeliverySelectingModal',res)
      if(res.data.success){ 
        toast.success('Delivery type updated successfully')
        setOpen(false); // Close modal on success
        if(paymentType === 'PENDING_BIDDING'){
           history.push(routes.app.profile.myBids.completePayment);
           dispatch(
            completePaymentData({
              auctionsId:auctionId,
              lastPrice:lastPrice,
            })
          );
        }else if(paymentType === 'BUY_NOW'){
          history.push(routes.app.buyNow(auctionId));
        }
       
      }
    })
    .catch((err)=>{
      console.log(err)
    })
    } catch (error) {
      console.error('Error submitting delivery type:', error);
    } 
  };

  return (
    <div>
      <Modal
        className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <LodingTestAllatre />
        </Dimmer>

        <div className="sm:w-[500px] h-auto rounded-2xl bg-white border-2 border-primary">
          {/* Heading */}
          <div className="bg-primary text-white text-center font-semibold py-2 text-xl">
            Select the Delivery Type
          </div>

          {/* Dropdown */}
          <div className="px-3 py-4">
            <Dropdown
              placeholder="Select a payment method"
              fluid
              selection
              options={deliveryOptions}
              onChange={handleDropdownChange}
              value={selectedOption}
            />
          </div>
        {/* Seller Address */}
            <div className="px-3 py-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
                <h4 className="text-lg font-semibold text-primary mb-2 flex items-center">
                  <span className="mr-2">📍</span> Seller Address
                </h4>
                <ul className="space-y-2">
                <li className="flex items-center">
                    <span className="font-medium mr-2">Adress Lable:</span>
                    <span>{sellerLocation?.addressLabel}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Adress:</span>
                    <span>{sellerLocation?.address}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">City:</span>
                    <span>{sellerLocation?.city?.nameEn}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Country:</span>
                    <span>{sellerLocation?.country?.nameEn}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Mobile 📞:</span>
                    {/* <span className="text-blue-500 hover:underline">{sellerLocation.phone}</span> */}
                  </li>
                </ul>
              </div>
            </div>

          {/* Description */}
          {selectedOption && (
            <div className="px-3 py-2 mt-2 text-center text-red-700 font-semibold">
              <p>{deliveryDescriptions[selectedOption]}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="px-3 py-2 text-center">
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading || !selectedOption}
              className="bg-primary text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeliverySelectingModal;

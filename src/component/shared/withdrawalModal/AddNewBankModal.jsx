import { useLanguage } from 'context/language-context';
import useAxios from 'hooks/use-axios';
import content from 'localization/content';
import React, { useState } from 'react';
import { Dimmer, Modal } from 'semantic-ui-react';
import LodingTestAllatre from '../lotties-file/loding-test-allatre';
import { authAxios } from 'config/axios-config';
import localizationKeys from "../../../localization/localization-keys";
import api from 'api';
import SuccessModal from '../successModal/SuccessModal';
import toast from 'react-hot-toast';
import routes from 'routes';

const AddNewBankModal = ({open, setOpen}) => {
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    const {run, isLoading} = useAxios([]);
  
    const [accountHolderName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [successModal, setSuccessModal] = useState(false);

    // Error states
    const [errors, setErrors] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
    });

    const validateFields = () => {
        const newErrors = {};

        // Validate accountHolderName: only letters allowed
        if (!accountHolderName) {
            newErrors.accountHolderName = 'Account holder name is required';
        } else if (!/^[A-Za-z\s]+$/.test(accountHolderName)) {
            newErrors.accountHolderName = 'Account holder name should contain only letters';
        }

        // Validate bankName: cannot be empty
        if (!bankName) newErrors.bankName = 'Bank name is required';

        // Validate accountNumber: must be exactly 16 digits
        if (!accountNumber) {
            newErrors.accountNumber = 'Account number is required';
        } else if (!/^\d{16}$/.test(accountNumber)) {
            newErrors.accountNumber = 'Account number must be exactly 16 digits';
        }

        // Validate routingNumber: must start with "AE" and be 21 characters
        if (!routingNumber) {
          newErrors.routingNumber = 'Routing number is required';
      } else if (!/^AE[A-Za-z0-9]{21}$/.test(routingNumber)) {
          newErrors.routingNumber = 'Routing number must start with "AE" followed by 21 alphanumeric characters ';
      }
      

        setErrors(newErrors);
        
        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate before submitting
        if (!validateFields()) return;

        try {
            run(
                authAxios.post(api.app.Wallet.addBankAccount, {
                    accountHolderName,
                    bankName,
                    accountNumber,
                    routingNumber,
                }).then((response) => {
                    if (response.data.success) {
                        setSuccessModal(true);
                    } else {
                        toast.error(response.data.message);
                    }
                })
            );
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to process withdrawal');
        }
    };

    if (!open) return null;

    return (
        <Modal
            className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
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
                    <LodingTestAllatre />
                </Dimmer>
                <div className="bg-white  rounded shadow-md w-96">
                    <h2 className="text-lg font-semibold mb-8 bg-primary text-white text-center  ">
                        {selectedContent[localizationKeys.AddNewBankAccount]}
                    </h2>
                    <form id="withdrawal-form" className='p-6' onSubmit={handleSubmit}>
                        <div className='mb-5 leading-7'>
                        <label htmlFor="accountHolderName">{selectedContent[localizationKeys.accountHolderName]}</label>
                        <input
                            
                            type="text"
                            id="accountHolderName"
                            name="accountHolderName"
                            value={accountHolderName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="outline-none border rounded w-full  p-2"
                        />
                        {errors.accountHolderName && <span className="text-red-500">{errors.accountHolderName}</span>}
                        </div>

                        <div className='mb-5 leading-7'>
                        <label htmlFor="bankName">{selectedContent[localizationKeys.bankName]}</label>
                        <input
                            
                            type="text"
                            id="bankName"
                            name="bankName"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="outline-none border rounded w-full  p-2"
                        />
                        {errors.bankName && <span className="text-red-500">{errors.bankName}</span>}
                        </div>

                        <div className='mb-5 leading-7'>
                        <label htmlFor="accountNumber">{selectedContent[localizationKeys.bankAccountNumber]}</label>
                        <input
                            
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="outline-none border rounded w-full  p-2"
                        />
                        {errors.accountNumber && <span className="text-red-500">{errors.accountNumber}</span>}
                        </div>

                        <div className='mb-5 leading-7'>
                        <label htmlFor="routingNumber">{selectedContent[localizationKeys.IBANnumber]}</label>
                        <input
                            
                            type="text"
                            id="routingNumber"
                            name="routingNumber"
                            value={routingNumber}
                            onChange={(e) => setRoutingNumber(e.target.value)}
                            className="outline-none border rounded w-full  p-2"
                        />
                        {errors.routingNumber && <span className="text-red-500">{errors.routingNumber}</span>}
                        </div>

                        <div className="flex justify-evenly ">
                            <button type="submit" className="bg-primary text-white rounded p-2">
                                {selectedContent[localizationKeys.AddAccount]}
                            </button>
                            <button onClick={() => setOpen(false)} className="mt-4 text-red-500">
                            {selectedContent[localizationKeys.cancel]}
                            </button>
                        </div>
                    </form>
                </div>
                {successModal && <SuccessModal
                    open={successModal}
                    setOpen={setSuccessModal}
                    message={'Success! You have successfully added your bank account!'}
                    returnUrl={routes.app.profile.wallet}
                    isAddAccount={true}
                    closeAddNewBankAccountModal={setOpen}
                />}
            </div>
        </Modal>
    );
};

export default React.memo(AddNewBankModal);

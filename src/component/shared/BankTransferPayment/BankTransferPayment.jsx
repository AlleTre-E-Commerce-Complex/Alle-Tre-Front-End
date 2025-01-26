import React, { useState } from "react";
import { Tab, Button } from "semantic-ui-react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import localizationKeys from "localization/localization-keys";
import { useLanguage } from "context/language-context";
import content from "localization/content";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";

const BankTransferPayment = ({setShowBankDetails, setShwoPaymentSelection, auctionId, amount}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [Preview, setPreview] = useState(null)
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const {run, isLoading} = useAxios([])

  const accounts = [
    {
      accountName: "Account 1",
      bankDetails: [
        { label: "Bank Name", value: "Mashreq Bank PSC" },
        { label: "Account Holder Name", value: "ALLE TRE E-COMMERCE COMPLEX LLC OPC" },
        { label: "Account Number", value: "019101580249" },
        { label: "IBAN", value: "AE640330000019101580249" },
        { label: "BIC/SWIFT", value: "BOMLAEAD" },
      ],
    },
    {
      accountName: "Account 2",
      bankDetails: [
        { label: "Bank Name", value: "Wio Bank PJSC" },
        { label: "Account Holder Name", value: "ALLE TRE E-COMMERCE COMPLEX LLC OPC" },
        { label: "Account Number", value: "9755033725" },
        { label: "IBAN", value: "AE740860000009755033725" },
        { label: "BIC/SWIFT", value: "WIOBAEADXXX" },
      ],
    },
    // {
    //   accountName: "Account 3",
    //   bankDetails: [
    //     { label: "Bank Name", value: "Abu Dhabi Commercial Bank" },
    //     { label: "Account Holder Name", value: "TRE SUPPLY CHAIN LLC" },
    //     { label: "Account Number", value: "034563453245" },
    //     { label: "IBAN", value: "AE560330000034563453245" },
    //     { label: "BIC/SWIFT", value: "ADCBAEAA" },
    //   ],
    // },
  ];



  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!", { position: "top-right" });
    });
  };

  const handleCopyAll = () => {
    const allDetails = accounts
      .map((account) =>
        account.bankDetails.map((detail) => `${detail.label}: ${detail.value}`).join("\n")
      )
      .join("\n\n");
    navigator.clipboard.writeText(allDetails).then(() => {
      toast.success("All bank details copied to clipboard!", {
        position: "top-right",
      });
    });
  };

  const handleGoBack = () => {
    setShowBankDetails()
    setShwoPaymentSelection()
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreview(URL.createObjectURL(file));
      toast.success("File uploaded successfully", { position: "top-right" });
    }
  };

  const handleSubmit = () => {
  
    if (!uploadedFile) {
      toast.error("Please upload a document before submitting", {
        position: "top-right",
      });
      return;
    }
   
    const formData = new FormData();
    formData.append("auctionId", auctionId);
    formData.append("amount", amount);
    formData.append("statement", uploadedFile);

    run(
      authAxios.post(api.app.auctions.payByBank_uploadBankStatement, formData,{
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res)=>{
        if(res.data.success){
          toast.success("Bank transfer details submitted successfully", {
            position: "top-right",
          });
        }
      })
      .catch((err) => {
        toast.error("Error submitting bank transfer details", {
          position: "top-right",
        });
      })
    )
  };

  const panes = accounts.map((account, index) => ({
    menuItem: account.accountName,
    render: () => (
      <Tab.Pane>
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="text-md mb-8 space-y-2"
        >
          {account.bankDetails.map((detail, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white shadow-sm p-1 rounded-lg"
            >
              <span>
                <strong>{detail.label}:</strong> {detail.value}
              </span>
              <button
                className="bg-zinc-200 hover:bg-zinc-300 text-gray-500 py-1 px-1 rounded text-sm"
                onClick={() => handleCopy(detail.value)}
              >
                <FaRegCopy />
              </button>
            </div>
          ))}
             <div className="flex justify-between items-center bg-white shadow-sm p-1 rounded-lg">
              <span className=" text-green">
                <strong>Amount To Be Paid :</strong> {amount}
              </span>
              <button
                className="bg-zinc-200 hover:bg-zinc-300 text-gray-500 py-1 px-1 rounded text-sm"
                onClick={() => handleCopy(amount)}
              >
                <FaRegCopy />
              </button>
            </div>
        </motion.div>
      </Tab.Pane>
    ),
  }));

  return (
    <div className="flex flex-col justify-center bg-gray-100 h-auto rounded-xl p-4 border relative">
      <h1 className="text-center text-xl font-bold mb-8">
        {selectedContent[localizationKeys.BankTransferDetails]}
      </h1>

      <Tab panes={panes} className="mb-8" />

      <div className="flex items-center justify-center mb-8">
      <div className="w-24 h-24 border rounded-lg mr-4 flex justify-center items-center bg-gray-200">
  {uploadedFile ? (
    uploadedFile.type.startsWith("image/") ? (
      <img
        src={Preview}
        alt="Preview"
        className="w-full h-full object-cover rounded-lg"
      />
    ) : uploadedFile.type === "application/pdf" ? (
      <iframe
        src={Preview}
        title="PDF Preview"
        className="w-full h-full rounded-lg"
      />
    ) : (
      <span className="text-gray-500 text-6xl">
        <IoDocumentOutline />
      </span>
    )
  ) : (
    <span className="text-gray-500 text-6xl">
      <IoDocumentOutline />
    </span>
  )}
</div>


        <div className="flex flex-col items-start">
          <label
            htmlFor="upload"
            className="bg-secondary-light hover:bg-secondary-veryLight text-white py-2 px-4 rounded cursor-pointer"
          >
            Upload Transaction Document
          </label>
          <input
            id="upload"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
          {uploadedFile && (
            <p className="mt-4 text-green-600">
              {uploadedFile.name || "File uploaded"}
            </p>
          )}
        </div>
      </div>

      <div className="flex">
        <Button
          className="bg-white hover:bg-slate-200 border border-primary opacity-100 font-normal text-base text-primary w-full h-[48px] rounded-lg mt-6"
          loading={isLoading}
          onClick={handleGoBack}
          >
          {selectedContent[localizationKeys.GoBack]}
        </Button>
        <Button
          className="bg-primary hover:bg-primary-dark opacity-100 font-normal text-base text-white w-full h-[48px] rounded-lg mt-6"
          loading={isLoading}
          onClick={handleSubmit}
        >
          {selectedContent[localizationKeys.Submit]}
        </Button>
      </div>
    </div>
  );
};

export default BankTransferPayment;

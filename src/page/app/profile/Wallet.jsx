import React, { useEffect, useState } from "react";
import EmtyWatchlist from "../../../../src/assets/icons/emty-watchlist.png";
import { useLanguage } from "context/language-context";
import content from "localization/content";
import localizationKeys from "localization/localization-keys";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import toast from 'react-hot-toast';
import api from "api";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import AddNewBankModal from "component/shared/withdrawalModal/AddNewBankModal";
import SuccessModal from "component/shared/successModal/SuccessModal";
import ShowBankDetailsModal from "component/shared/withdrawalModal/ShowBankDetailsModal";
import routes from "routes";
const Wallet = () => {
  
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const {run : runWallet, isLoading: isLoadingWallet} = useAxios([])
  const [walletBalance, setWalletBalance] = useState(10000);
  const [walletHistory, setWalletHistory] = useState([]);
  const [withdrawalOpen,setWithdrawalOpen] = useState(false)
  const [successModalOpen,setSuccessModalOpen] = useState(false)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [historyResponse, balanceResponse] = await Promise.all([
          authAxios.get(`${api.app.Wallet.get}`),
          authAxios.get(`${api.app.Wallet.getBalance}`)
        ]);
  
        setWalletHistory(historyResponse.data);
        setWalletBalance(balanceResponse.data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };
  
    fetchWalletData();
  }, [runWallet]); 
  

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  async function handleWithdrawClick() {
    setWithdrawalOpen(true)

  
  }


  return (
   <div>
    <Dimmer className=" bg-white/50" active={isLoadingWallet} inverted>
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      {walletHistory.length > 0 ?  
         <div className="">
         <div className="walletBalance  font-bold md:text-5xl text-xl px-2 fixed md:top-[130px] top-[110px] py-5 bg-[#FEFEFE] w-full md:w-4/5 z-10">
           <div className="flex gap-10">
                   <h1 className="text-gray-500">
                     {selectedContent[localizationKeys.WalletBalance]}: AED<span> {walletBalance}</span>{" "}
                   </h1>
                   <button  
                    className="bg-primary text-white text-lg my-2 font-normal px-5 rounded-lg "
                    onClick={handleWithdrawClick}>{selectedContent[localizationKeys.Withdraw]}</button>
           </div>
         </div>
         <div className="transactions ">
           <div className="relative overflow-x-auto ">
             <table className="w-full mt-20 text-left rtl:text-right text-gray-500 dark:text-gray-400">
               <thead className="text-md  w-full text-white uppercase bg-primary dark:bg-gray-700 dark:text-gray-400">
                 <tr className=" ">
                   <th scope="col" className="px-6 py-3">
                   {selectedContent[localizationKeys.Date]}
                   </th>
                   <th scope="col" className="px-6 py-3">
                   {selectedContent[localizationKeys.Description]}
                   </th>
                   <th scope="col" className="px-6 py-3">
                   {selectedContent[localizationKeys.Withdrawals]}
                   </th>
                   <th scope="col" className="px-6 py-3">
                   {selectedContent[localizationKeys.Deposits]}
                   </th>
                   <th scope="col" className="px-6 py-3">
                   {selectedContent[localizationKeys.Balance]}
                   </th>
                 </tr>
               </thead>
               <tbody className="">
                 {[...walletHistory].reverse().map((data, index) => (
                   <tr
                     key={index}
                     className={`bg-white border-b ${
                       index % 2 !== 0 ? "bg-gray-200" : ""
                     } `}
                   >
                     <th scope="row" className="px-6 py-4 ">{formatDate(data.date)}</th>
                     <td className="px-6 py-4">{data.description}</td>
                     <td className="px-6 py-4 ">{data.status === "WITHDRAWAL" ? 'AED '+ data.amount:"--------------------------"}</td>
                     <td className="px-6 py-4">{data.status === "DEPOSIT" ? 'AED ' + data.amount:"-------------------"}</td>
                     <td className="px-6 py-4">AED {data.balance}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>
      :
      <div className="flex justify-center items-center pt-56 ">
            <div>
              <img
                className="w-28 mx-auto"
                src={EmtyWatchlist}
                alt="EmtyWatchlist"
              />
              <h1 className="text-gray-dark pt-10">
                {selectedContent[localizationKeys.ThereAreNoTransactionYet]}
              </h1>
            </div>
          </div>}
        
          { withdrawalOpen &&
           <ShowBankDetailsModal
           open={withdrawalOpen}
           setOpen={setWithdrawalOpen}
           setSuccessModal={setSuccessModalOpen}
           accountBalance={walletBalance}
          />
           
          }

         
          {successModalOpen && <SuccessModal
          open={successModalOpen}
          setOpen={setSuccessModalOpen}
          returnUrl={routes.app.profile.wallet}
          message={'Success! Your withdrawal request has been processed successfully. Your funds are on their way, and you’ll receive them shortly. Thank you for using our service!'}
          isWithdrawal={true}
          />
          
          }


        
   </div>
  );
};

export default Wallet;

import React, { useEffect, useState } from "react";
import EmtyWatchlist from "../../../../src/assets/icons/empty-watch-list.svg";
import { useLanguage } from "context/language-context";
import content from "localization/content";
import localizationKeys from "localization/localization-keys";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import AddImageIcon from '../../../../src/assets/icons/add-image.svg'; 
import api from "api";
import { Dimmer } from "semantic-ui-react";
import LoadingTest3arbon from "component/shared/lotties-file/loading-test-3arbon";
import SuccessModal from "component/shared/successModal/SuccessModal";
import ShowBankDetailsModal from "component/shared/withdrawalModal/ShowBankDetailsModal";
import routes from "routes";
import { FaWallet, FaArrowUp, FaArrowDown, FaMoneyBillWave, FaHistory } from "react-icons/fa";

const Wallet = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const {run : runWallet, isLoading: isLoadingWallet} = useAxios([])
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletHistory, setWalletHistory] = useState([]);
  const [withdrawalOpen,setWithdrawalOpen] = useState(false)
  const [successModalOpen,setSuccessModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [historyResponse, balanceResponse] = await Promise.all([
          runWallet(authAxios.get(`${api.app.Wallet.get}`)),
          runWallet(authAxios.get(`${api.app.Wallet.getBalance}`))
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
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
  };

  async function handleWithdrawClick() {
    setWithdrawalOpen(true)
  }

  return (
   <div className="min-h-screen bg-gray-50 dark:bg-transparent pb-20 pt-10">
    <Dimmer className="bg-white/70 backdrop-blur-sm z-50" active={isLoadingWallet} inverted>
        <LoadingTest3arbon />
    </Dimmer>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      
      {/* Wallet Balance Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1c23] to-[#2d3748] shadow-2xl mb-12 animate-fade-in-up border border-gray-700 mt-10 md:mt-24">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#d4af37] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-500 opacity-10 blur-2xl pointer-events-none"></div>
        
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#eac566] to-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af37]/30 transform hover:rotate-6 transition-transform duration-300">
              <FaWallet className="text-4xl text-gray-900" />
            </div>
            <div>
              <p className="text-gray-400 text-sm md:text-base font-medium mb-1 tracking-wider uppercase">
                {selectedContent[localizationKeys.WalletBalance] || "Available Balance"}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                  {walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xl md:text-2xl font-bold text-[#d4af37]">AED</span>
              </div>
            </div>
          </div>

          <button  
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#eac566] to-[#d4af37] rounded-xl font-bold text-gray-900 text-lg shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/40 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            onClick={handleWithdrawClick}
          >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
            <FaMoneyBillWave className="text-xl" />
            <span>{selectedContent[localizationKeys.Withdraw] || "Withdraw Funds"}</span>
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white dark:bg-[#1a1c23] rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-[#1f222d]">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <FaHistory className="text-[#d4af37]" />
            Transaction History
          </h2>
        </div>

        {walletHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1f222d] text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-5 font-semibold whitespace-nowrap">{selectedContent[localizationKeys.Date] || "Date"}</th>
                  <th className="px-6 py-5 font-semibold">Details</th>
                  <th className="px-6 py-5 font-semibold whitespace-nowrap">Product</th>
                  <th className="px-6 py-5 font-semibold whitespace-nowrap text-right">Amount</th>
                  <th className="px-6 py-5 font-semibold whitespace-nowrap text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[...walletHistory].map((data, index) => {
                  const isDeposit = data.status === "DEPOSIT";
                  return (
                    <tr 
                      key={index}
                      className="hover:bg-gray-50/80 dark:hover:bg-[#1f222d]/60 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(data.date).split(',')[0]}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(data.date).split(',')[1]}</div>
                      </td>
                      
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDeposit ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            {isDeposit ? <FaArrowDown size={14} /> : <FaArrowUp size={14} />}
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${isDeposit ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}`}>
                              {isDeposit ? 'Received' : 'Sent'}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium line-clamp-2 max-w-md">
                              {data.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {data?.auction?.product || data?.product ? (
                          <div className="flex flex-col justify-center">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1" title={data?.auction?.product?.title || data?.product?.title}>
                              {data?.auction?.product?.title || data?.product?.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: #{data?.auction?.product?.id || data?.product?.id}</p>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-400 dark:text-gray-600">—</span>
                        )}
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className={`text-base font-bold ${isDeposit ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {isDeposit ? '+' : '-'} AED {Number(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1a1c23] inline-block px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                          AED {Number(data.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="w-32 h-32 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <img src={EmtyWatchlist} alt="Empty Wallet" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No Transactions Yet</h3>
          </div>
        )}
      </div>
    </div>
        
    { withdrawalOpen &&
      <ShowBankDetailsModal
        open={withdrawalOpen}
        setOpen={setWithdrawalOpen}
        setSuccessModal={setSuccessModalOpen}
        accountBalance={walletBalance}
      />
    }

    {successModalOpen && 
      <SuccessModal
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

import React, { useState, useEffect, useMemo } from "react";
import { stripePromise } from "../../../config/stripe-config";
import { Elements } from "@stripe/react-stripe-js";
import { useParams, useHistory } from "react-router-dom";
import { useLanguage } from "../../../context/language-context";

// Removed global stripePromise to ensure it's created within component context

import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../../utils/format-currency";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import { Dimmer } from "semantic-ui-react";
import CheckoutFormPayDeposite from "../../../component/shared/stripe-payment/checkout-form-pay-deposite";
import { 
  IoShieldCheckmarkOutline, 
  IoDocumentTextOutline, 
  IoTimeOutline, 
  IoInformationCircleOutline,
  IoWalletOutline,
  IoCardOutline
} from "react-icons/io5";

const ProductArbonCheckout = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { productId } = useParams();

  // Using shared stripePromise from config

  const [productData, setProductData] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isWalletPayment, setIsWalletPayment] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [showWalletPayment, setShowWalletPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch Product Data
        const productRes = await authAxios.get(api.app.productListing.listedProduct(productId));
        const data = productRes.data.data.product;
        setProductData(data);

        // 2. Fetch Wallet Balance
        const balanceRes = await authAxios.get(api.app.Wallet.getBalance);
        setWalletBalance(balanceRes.data);

        // Force Stripe for testing
        setIsWalletPayment(false);
      } catch (err) {
        console.error("PRODUCT ARBON CHECKOUT ERROR:", err);
        const errorMessage = err?.response?.data?.message || err?.message || selectedContent[localizationKeys.failedToLoadProductDetails];
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) fetchData();
  }, [productId]);

  const initiateStripePayment = async (amount) => {
    try {
      const response = await authAxios.post(api.app.payments.payArbon, {
        productId: Number(productId),
        amount: Number(amount),
        currency: "AED"
      });
      console.log("STRIPE DEBUG: API Response received", response.data);
      if (response.data.success && response.data.data.clientSecret) {
        setClientSecret(response.data.data.clientSecret);
        console.log("STRIPE DEBUG: Client Secret set successfully", response.data.data.clientSecret);
      } else {
        console.error("STRIPE DEBUG: API returned no clientSecret", response.data);
      }
    } catch (err) {
      console.error("Stripe initiation failed:", err);
      toast.error(selectedContent[localizationKeys.stripeSystemOffline]);
    }
  };

  const handlePaymentSubmit = async () => {
    if (isWalletPayment === null) {
      toast.error(selectedContent[localizationKeys.pleaseSelectAPaymentMethod]);
      return;
    }

    if (isWalletPayment) {
      setShowWalletPayment(true);
      setShowStripePayment(false);
    } else {
      setIsLoading(true);
      try {
        await initiateStripePayment(productData.arbonAmount);
        setShowStripePayment(true);
        setShowWalletPayment(false);
      } catch (e) {
        console.error("Stripe trigger failed", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <LoadingTest3arbon />
      </div>
    );
  }

  const isRTL = lang === "ar";

  return (
    <div className="min-h-screen bg-white dark:bg-primary pt-24 md:pt-32 pb-20 px-4 md:px-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary-dark),transparent_70%)] opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,var(--color-primary),transparent_50%)] opacity-10"></div>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse duration-[10s]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse duration-[15s]"></div>

      <Dimmer active={isLoading} inverted className="fixed w-full h-full top-0 z-[100] bg-black/60 backdrop-blur-md">
        <LoadingTest3arbon />
      </Dimmer>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
          
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="bg-white dark:bg-primary-dark backdrop-blur-sm rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white dark:bg-primary-dark rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-colors duration-700"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <IoDocumentTextOutline size={28} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-none">
                    {selectedContent[localizationKeys.arbonSummary]}
                  </h2>
                  <p className="text-zinc-500 text-[10px] md:text-xs mt-1 uppercase tracking-widest font-bold">{selectedContent[localizationKeys.secureReservation]}</p>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="bg-white dark:bg-primary-dark rounded-3xl p-5 md:p-6 border border-white/5 mb-8 hover:border-white/10 transition-colors">
                <div className="flex gap-4 md:gap-5">
                  <div className="relative shrink-0">
                    <img 
                      src={productData?.images?.[0]?.imageLink} 
                      alt={productData?.title} 
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl shadow-lg border border-white/10"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-base md:text-lg font-bold text-white line-clamp-2 leading-tight">
                      {productData?.title}
                    </h3>
                    <div className="mt-3">
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">{selectedContent[localizationKeys.arbonAmount]}</p>
                      <p className="text-primary font-black text-xl md:text-2xl tracking-tighter">
                        {formatCurrency(productData?.arbonAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                <div className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                    <IoShieldCheckmarkOutline size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {selectedContent[localizationKeys.reservationGuarantee]}
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                      {selectedContent[localizationKeys.theItemWillBeReservedExclusivelyForYou]}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <IoTimeOutline size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {selectedContent[localizationKeys.holdDuration]}
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                      {selectedContent[localizationKeys.sevenDaysToCompleteTheTransaction]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="mt-8 p-5 md:p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                <div className="flex gap-3">
                  <IoInformationCircleOutline className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] md:text-[11px] leading-relaxed text-zinc-400 font-medium italic">
                    {selectedContent[localizationKeys.arbonNotice]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Gateway */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white dark:bg-primary-dark rounded-[2.5rem] p-6 md:p-10 border border-white/5 min-h-[500px] md:min-h-[600px] flex flex-col transition-all duration-500">
              
              <div className="mb-10 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">
                  {selectedContent[localizationKeys.checkout]}
                </h2>
                <p className="text-zinc-500 text-[10px] md:text-xs mt-2 uppercase tracking-widest font-bold">{selectedContent[localizationKeys.selectPreferredMethod]}</p>
              </div>

              {/* Payment Selection Interface */}
              {!showStripePayment && !showWalletPayment && (
                <div className="flex-grow flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4 md:space-y-6">
                    {/* Wallet Option Card - HIDDEN FOR NOW */}
                    {/* 
                    <div 
                      onClick={() => setIsWalletPayment(true)}
                      className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                        isWalletPayment === true ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                          isWalletPayment === true ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          <IoWalletOutline size={30} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">My Wallet</p>
                          <p className="text-zinc-500 text-sm">Balance: {formatCurrency(walletBalance)}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isWalletPayment === true ? 'border-primary' : 'border-zinc-700'
                      }`}>
                        {isWalletPayment === true && <div className="w-3 h-3 bg-primary rounded-full animate-in zoom-in"></div>}
                      </div>
                    </div>
                    */}

                    {/* Stripe/Card Option Card */}
                    <div 
                      onClick={() => setIsWalletPayment(false)}
                      className={`p-5 md:p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                        isWalletPayment === false ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all ${
                          isWalletPayment === false ? 'bg-primary text-black scale-105' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                        }`}>
                          <IoCardOutline size={28} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-base md:text-lg tracking-tight">{selectedContent[localizationKeys.creditDebitCard]}</p>
                          <p className="text-zinc-500 text-[10px] md:text-sm font-medium">{selectedContent[localizationKeys.secureStripeGateway]}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isWalletPayment === false ? 'border-primary' : 'border-zinc-700'
                      }`}>
                        {isWalletPayment === false && <div className="w-3 h-3 bg-primary rounded-full animate-in zoom-in"></div>}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handlePaymentSubmit}
                    disabled={isWalletPayment === null}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-black py-4 md:py-5 rounded-2xl mt-10 transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs md:text-sm shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98]"
                  >
                    {selectedContent[localizationKeys.continueToPayment]}
                  </button>
                </div>
              )}

              {/* Active Stripe Interface */}
              {showStripePayment && clientSecret && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex-grow">
                  <div className="bg-white/5 rounded-[2rem] p-4 md:p-8 border border-white/5 mb-8">
                    <div style={{ minHeight: "300px" }}>
                      <Elements 
                        key={clientSecret} 
                        stripe={stripePromise} 
                      >
                        <CheckoutFormPayDeposite
                          productId={productId}
                          isArbon={true}
                          payPrice={productData.arbonAmount}
                          onError={(msg) => setError(msg)}
                          clientSecret={clientSecret}
                        />
                      </Elements>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setShowStripePayment(false); setClientSecret(""); setIsWalletPayment(null); }}
                    className="mt-4 md:mt-6 text-zinc-500 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors mx-auto group"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform inline-block">{lang === "ar" ? "→" : "←"}</span>
                    <span>{selectedContent[localizationKeys.backToSelection]}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductArbonCheckout;

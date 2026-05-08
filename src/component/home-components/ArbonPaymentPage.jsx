import React, { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../utils/format-currency";
import LoadingTest3arbon from "../shared/lotties-file/loading-test-3arbon";
import { Dimmer } from "semantic-ui-react";
import CheckoutFormPayDeposite from "../shared/stripe-payment/checkout-form-pay-deposite";
import PaymentSelection from "../shared/PaymentSelection/PaymentSelection";
import WalletPaymentForBiddingDeoposit from "../shared/WalletPayment/WalletPaymentForBiddingDeoposit";
import { IoShieldCheckmarkOutline, IoDocumentTextOutline, IoTimeOutline, IoInformationCircleOutline } from "react-icons/io5";

const ArbonPaymentPage = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { productId } = useParams();
  const location = useLocation();

  const stripePromise = useMemo(() => {
    const key = process.env.REACT_APP_STRIPE_API_KEY;
    if (!key) return null;
    return loadStripe(key);
  }, []);

  const [productData, setProductData] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isWalletPayment, setIsWalletPayment] = useState(null);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [showWalletPayment, setShowWalletPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stripe, setStripe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stripePromise) {
      stripePromise.then(res => {
        console.log("Stripe Promise Resolved:", !!res);
        setStripe(res);
      });
    }
  }, [stripePromise]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch Product Data
        const productRes = await authAxios.get(api.app.productListing.listedProduct(productId));
        const data = productRes.data.data.product;
        setProductData(data);

        // Fetch Wallet Balance
        const balanceRes = await authAxios.get(api.app.Wallet.getBalance);
        setWalletBalance(balanceRes.data);

        // If balance is enough, show selection, otherwise go straight to Stripe
        if (Number(balanceRes.data) >= Number(data.arbonAmount)) {
          // Stay on selection mode
        } else {
          await initiateStripePayment(data.arbonAmount);
          setShowStripePayment(true);
        }
      } catch (err) {
        console.error("Failed to fetch payment data:", err);
        toast.error(selectedContent[localizationKeys.somethingWentWrongPleaseTryAgainLater]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const initiateStripePayment = async (amount) => {
    try {
      const response = await authAxios.post(api.app.payments.payArbon, {
        productId: Number(productId),
        amount: Number(amount),
        currency: "AED"
      });
      if (response.data.success && response.data.data.clientSecret) {
        setClientSecret(response.data.data.clientSecret);
      }
    } catch (err) {
      console.error("Stripe initiation failed:", err);
      toast.error("Failed to initialize Stripe payment");
    }
  };

  const handlePaymentMethodSubmit = async () => {
    if (isWalletPayment === null) {
      toast.error("Please select a payment method");
      return;
    }

    if (isWalletPayment) {
      setShowWalletPayment(true);
      setShowStripePayment(false);
    } else {
      setIsLoading(true);
      await initiateStripePayment(productData.arbonAmount);
      setShowStripePayment(true);
      setShowWalletPayment(false);
      setIsLoading(false);
    }
  };

  if (isLoading && !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary">
        <LoadingTest3arbon />
      </div>
    );
  }

  const isRTL = lang === "ar";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-primary pt-32 pb-20 px-4 md:px-8 transition-colors duration-300">
      <Dimmer active={isLoading} inverted className="fixed w-full h-full top-0 z-[100] bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <LoadingTest3arbon />
      </Dimmer>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contract Summary */}
          <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <IoDocumentTextOutline size={28} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {isRTL ? "ملخص العربون" : "Arbon Summary"}
                </h2>
              </div>

              {/* Product Info */}
              <div className="flex gap-4 mb-8 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                <img 
                  src={productData?.images?.[0]?.imageLink} 
                  alt={productData?.title} 
                  className="w-24 h-24 object-cover rounded-2xl shadow-sm"
                />
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                    {productData?.title}
                  </h3>
                  <p className="text-primary font-black text-xl mt-1">
                    {formatCurrency(productData?.arbonAmount)}
                  </p>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <IoShieldCheckmarkOutline className="text-green-500" size={24} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {isRTL ? "ضمان الحجز" : "Reservation Guarantee"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isRTL ? "سيتم حجز المنتج لك حصرياً" : "The item will be reserved exclusively for you"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <IoTimeOutline className="text-blue-500" size={24} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {isRTL ? "مدة الحجز" : "Hold Duration"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isRTL ? "7 أيام لإتمام المعاملة" : "7 days to complete the transaction"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="mt-8 p-6 bg-red-50 dark:bg-red-500/10 rounded-[2rem] border border-red-100 dark:border-red-500/20">
                <div className="flex gap-3 mb-2 text-red-600 dark:text-red-400">
                  <IoInformationCircleOutline size={20} className="shrink-0" />
                  <p className="text-xs font-black uppercase tracking-widest italic">
                    {isRTL ? "تنبيه هام" : "Important Notice"}
                  </p>
                </div>
                <p className="text-[11px] leading-relaxed text-red-700/80 dark:text-red-300/80">
                  {isRTL 
                    ? "بمجرد دفع العربون، سيتم حجز المنتج لمدة 7 أيام. في حال التراجع عن الشراء، لن يتم استرداد مبلغ العربون وسيكون من حق البائع كتعويض عن فترة الحجز."
                    : "Once Arbon is paid, the item is held for 7 days. If you withdraw from the purchase, the Arbon amount is non-refundable and will be awarded to the seller as compensation."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Methods */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-white/5 min-h-[500px]">
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {isRTL ? "طريقة الدفع" : "Payment Method"}
                </h2>
                <div className="px-4 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                  Secure Encryption
                </div>
              </div>

              {/* Wallet vs Card Selection */}
              {!showStripePayment && !showWalletPayment && (
                <div className="space-y-8 h-full flex flex-col">
                  <div className="flex-grow">
                    <PaymentSelection
                      isWalletPayment={isWalletPayment}
                      setIsWalletPayment={setIsWalletPayment}
                      handleSubmitPayment={handlePaymentMethodSubmit}
                    />
                  </div>
                </div>
              )}

              {/* Stripe Payment Form */}
              {showStripePayment && clientSecret && (
                <div className="animate-in fade-in zoom-in duration-500">
                  {stripe && clientSecret && (
                      <Elements 
                        key={clientSecret} 
                        stripe={stripePromise} 
                      >
                      <CheckoutFormPayDeposite
                        productId={productId}
                        isArbon={true}
                        payPrice={productData.arbonAmount}
                        onError={(msg) => {
                          console.error("ArbonPaymentPage: Stripe Error:", msg);
                          toast.error(msg);
                        }}
                        clientSecret={clientSecret}
                      />
                    </Elements>
                  )}
                  <button 
                    onClick={() => { setShowStripePayment(false); setClientSecret(""); }}
                    className="mt-6 text-gray-400 hover:text-primary text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    ← {isRTL ? "تغيير طريقة الدفع" : "Change Payment Method"}
                  </button>
                </div>
              )}

              {/* Wallet Payment Form */}
              {showWalletPayment && (
                <div className="animate-in fade-in zoom-in duration-500">
                  <WalletPaymentForBiddingDeoposit
                    productId={productId}
                    amount={productData.arbonAmount}
                    walletBalance={walletBalance}
                    paymentAPI={api.app.payments.payArbon}
                    setShwoPaymentSelection={() => setShowWalletPayment(false)}
                    setShowWalletPaymentMethod={() => setShowWalletPayment(false)}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbonPaymentPage;

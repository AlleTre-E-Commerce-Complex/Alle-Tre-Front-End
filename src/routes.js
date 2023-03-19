const routes = {
  auth: {
    default: `/auth`,
    logIn: `/auth/log-in`,
    signUp: `/auth/sign-Up`,
    enterEmail: `/auth/enter-email`,

    forgetpass: {
      default: `/credentials-update`,
      restpass: `/credentials-update/change-password`,
    },
  },
  app: {
    default: `/allatre`,
    home: `/allatre/home`,
    myBides: `/allatre/my-bides`,
    categories: `/allatre/categories`,
    watchlist: `/allatre/watchlist`,
    faqs: `/allatre/FAQs`,
    support: `/allatre/support`,
  },
  createAuction: {
    default: `/allatre/home/create-auction`,
    productDetails: `/allatre/home/create-auction/product-details`,
    auctionDetails: `/allatre/home/create-auction/product-details/auction-details`,
    shippingDetails: `/allatre/home/create-auction/product-details/auction-details/shipping-details`,
    paymentDetails: `/allatre/home/create-auction/product-details/auction-details/shipping-details/payment-details`,
  },
  profile: {
    default: `/allatre/profile`,
    profileSettings: `/allatre/profile/settings`,
    myAuctions: `/allatre/profile/my-auctions`,
  },
};

export default routes;

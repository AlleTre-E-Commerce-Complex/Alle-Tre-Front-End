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
    homeDetails: (auctionId = ":auctionId") =>
      `/allatre/home/${auctionId}/details`,
    categories: (
      categoryTitle = ":categoryTitle",
      categoryId = ":categoryId"
    ) => `/allatre/categories/${categoryTitle}/${categoryId}`,
    myBides: `/allatre/my-bides`,
    faqs: `/allatre/FAQs`,
    support: `/allatre/support`,

    createAuction: {
      default: `/allatre/home/create-auction`,
      productDetails: `/allatre/home/create-auction/product-details`,
      auctionDetails: `/allatre/home/create-auction/product-details/auction-details`,
      shippingDetails: `/allatre/home/create-auction/product-details/auction-details/shipping-details`,
      paymentDetails: `/allatre/home/create-auction/product-details/auction-details/shipping-details/payment-details`,
      paymentSucsess: `/allatre/home/create-auction/product-details/auction-details/shipping-details/payment-details/Sucsess`,
      paymentFaild: `/allatre/home/create-auction/product-details/auction-details/shipping-details/payment-details/Faild`,
    },

    profile: {
      default: `/allatre/profile`,
      profileSettings: `/allatre/profile/settings`,
      myAuctions: {
        default: `/allatre/profile/my-auctions`,
        active: `/allatre/profile/my-auctions/active`,
        scheduled: `/allatre/profile/my-auctions/scheduled`,
        drafts: `/allatre/profile/my-auctions/drafts`,
        sold: `/allatre/profile/my-auctions/sold`,
        pending: `/allatre/profile/my-auctions/pending`,
        expired: `/allatre/profile/my-auctions/expired`,

        activeDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-auctions/active/${auctionId}/details`,
        scheduledDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-auctions/scheduled/${auctionId}/details`,
        soldDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-auctions/sold/${auctionId}/details`,
        pendingDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-auctions/pending/${auctionId}/details`,
        expiredDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-auctions/expired/${auctionId}/details`,
      },
      watchlist: `/allatre/profile/watchlist`,
      watchlistDetails: (auctionId = ":auctionId") =>
        `/allatre/profile/watchlist/${auctionId}/details`,
    },
  },
};

export default routes;

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
    payDeposite: (auctionId = ":auctionId") =>
      `/allatre/home/${auctionId}/details/pay-deposite`,
    paymentSucsess: (auctionId = ":auctionId") =>
      `/allatre/home/${auctionId}/details/pay-deposite/paymentSucsess`,
    categories: (
      categoryTitle = ":categoryTitle",
      categoryId = ":categoryId"
    ) => `/allatre/categories/${categoryTitle}/${categoryId}`,

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

      myBids: {
        default: `/allatre/profile/my-bids`,
        inPogress: `/allatre/profile/my-bids/in-pogress`,
        pending: `/allatre/profile/my-bids/pending`,
        waitingForDelivery: `/allatre/profile/my-bids/waiting-for-delivery`,
        expired: `/allatre/profile/my-bids/expired`,
        completed: `/allatre/profile/my-bids/completed`,

        inPogressDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-bids/in-pogress/${auctionId}/details`,
        pendingDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-bids/pending/${auctionId}/details`,
        waitingForDeliveryDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-bids/waitingForDelivery/${auctionId}/details`,
        expiredDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-bids/expired/${auctionId}/details`,
        completedDetails: (auctionId = ":auctionId") =>
          `/allatre/profile/my-bids/completed/${auctionId}/details`,

        completePayment: `/allatre/profile/my-bids/pending/complete-payment`,
      },

      watchlist: `/allatre/profile/watchlist`,
      watchlistDetails: (auctionId = ":auctionId") =>
        `/allatre/profile/watchlist/${auctionId}/details`,
    },
  },
};

export default routes;

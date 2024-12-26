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
    default: `/alletre`,
    unSubscribeUser : "/alletre/unSubscribeUser",
    home: "/alletre/home",
    homeDetails: (auctionId = ":auctionId") =>
      `/alletre/home/${auctionId}/details`,
    payDeposite: (auctionId = ":auctionId") =>
      `/alletre/home/${auctionId}/details/pay-deposite`,
    buyNow: (auctionId = ":auctionId") =>
      `/alletre/home/${auctionId}/details/buy-now`,
    paymentSucsess: (auctionId = ":auctionId") =>
      `/alletre/home/${auctionId}/details/pay-deposite/paymentSucsess`,
    categories: (
      categoryTitle = ":categoryTitle",
      categoryId = ":categoryId"
    ) => `/alletre/categories/${categoryTitle}/${categoryId}`,

    faqs: `/alletre/FAQs`,
    support: `/alletre/support`,

    createAuction: {
      default: `/alletre/home/create-auction`,
      productDetails: `/alletre/home/create-auction/product-details`,
      auctionDetails: `/alletre/home/create-auction/product-details/auction-details`,
      shippingDetails: `/alletre/home/create-auction/product-details/auction-details/shipping-details`,
      paymentDetails: `/alletre/home/create-auction/product-details/auction-details/shipping-details/payment-details`,
      paymentSucsess: `/alletre/home/create-auction/product-details/auction-details/shipping-details/payment-details/Sucsess`,
      paymentFaild: `/alletre/home/create-auction/product-details/auction-details/shipping-details/payment-details/Faild`,
    },

    profile: {
      default: `/alletre/profile`,
      profileSettings: `/alletre/profile/settings`,
      myAuctions: {
        default: `/alletre/profile/my-auctions`,
        active: `/alletre/profile/my-auctions/active`,
        scheduled: `/alletre/profile/my-auctions/scheduled`,
        drafts: `/alletre/profile/my-auctions/drafts`,
        sold: `/alletre/profile/my-auctions/sold`,
        pending: `/alletre/profile/my-auctions/pending`,
        watingForPayment: `/alletre/profile/my-auctions/wating-for-payment`,
        expired: `/alletre/profile/my-auctions/expired`,
        cancelled:`/alletre/profile/my-auctions/cancelled`,

        activeDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-auctions/active/${auctionId}/details`,
        scheduledDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-auctions/scheduled/${auctionId}/details`,
        soldDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-auctions/sold/${auctionId}/details`,
        pendingDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-auctions/pending/${auctionId}/details`,
        watingForPaymentDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-auctions/wating-for-payment/${auctionId}/details`,
        expiredDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-auctions/expired/${auctionId}/details`,
      },

      myBids: {
        default: `/alletre/profile/my-bids`,
        inPogress: `/alletre/profile/my-bids/in-pogress`,
        pending: `/alletre/profile/my-bids/pending`,
        waitingForDelivery: `/alletre/profile/my-bids/waiting-for-delivery`,
        expired: `/alletre/profile/my-bids/expired`,
        completed: `/alletre/profile/my-bids/completed`,
        cancelled: `/alletre/profile/my-bids/cancelled`,

        inPogressDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-bids/in-pogress/${auctionId}/details`,
        pendingDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-bids/pending/${auctionId}/details`,
        waitingForDeliveryDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-bids/waitingForDelivery/${auctionId}/details`,
        expiredDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-bids/expired/${auctionId}/details`,
        completedDetails: (auctionId = ":auctionId") =>
          `/alletre/profile/my-bids/completed/${auctionId}/details`,

        completePayment: `/alletre/profile/my-bids/pending/complete-payment`,
      },

      watchlist: `/alletre/profile/watchlist`,
      watchlistDetails: (auctionId = ":auctionId") =>
        `/alletre/profile/watchlist/${auctionId}/details`,

      purchased: `/alletre/profile/purchased`,
      wallet: `/alletre/profile/wallet`,
      notifications: `/alletre/profile/notifications`

    },
  },
};

export default routes;

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
    default: `/`,
    unSubscribeUser: "/unSubscribeUser",
    home: "/home",
    homeDetails: (auctionId = ":auctionId") =>
      `/home/${auctionId}/details`,
    payDeposite: (auctionId = ":auctionId") =>
      `/home/${auctionId}/details/pay-deposite`,
    buyNow: (auctionId = ":auctionId") =>
      `/home/${auctionId}/details/buy-now`,
    paymentSucsess: (auctionId = ":auctionId") =>
      `/home/${auctionId}/details/pay-deposite/paymentSucsess`,
    categories: (
      categoryTitle = ":categoryTitle",
      categoryId = ":categoryId"
    ) => `/categories/${categoryTitle}/${categoryId}`,

    faqs: `/FAQs`,
    support: `/support`,
    privacyPolicy: `/privacy-policy`,
    terms: `/terms-and-conditions`,
    chat: `/chat`,

    createAuction: {
      default: `/home/create-auction`,
      productDetails: `/home/create-auction/product-details`,
      auctionDetails: `/home/create-auction/product-details/auction-details`,
      shippingDetails: `/home/create-auction/product-details/auction-details/shipping-details`,
      paymentDetails: `/home/create-auction/product-details/auction-details/shipping-details/payment-details`,
      paymentSucsess: `/home/create-auction/product-details/auction-details/shipping-details/payment-details/Sucsess`,
      paymentFaild: `/home/create-auction/product-details/auction-details/shipping-details/payment-details/Faild`,
    },
    listProduct: {
      default: `/list-product`,
      details: (productId = ":productId") =>
        `/my-product/${productId}/details`,
      listProductLocationDetails: `/my-products/add-location`,
      userDetails: `/user/user-details`,
    },
    profile: {
      default: `/profile`,
      profileSettings: `/profile/settings`,
      myAuctions: {
        default: `/profile/my-auctions`,
        active: `/profile/my-auctions/active`,
        scheduled: `/profile/my-auctions/scheduled`,
        drafts: `/profile/my-auctions/drafts`,
        sold: `/profile/my-auctions/sold`,
        pending: `/profile/my-auctions/pending`,
        watingForPayment: `/profile/my-auctions/wating-for-payment`,
        expired: `/profile/my-auctions/expired`,
        cancelled: `/profile/my-auctions/cancelled`,

        activeDetails: (auctionId = ":auctionId") =>
          `/profile/my-auctions/active/${auctionId}/details`,
        scheduledDetails: (auctionId = ":auctionId") =>
          `/profile/my-auctions/scheduled/${auctionId}/details`,
        soldDetails: (auctionId = ":auctionId") =>
          `/profile/my-auctions/sold/${auctionId}/details`,
        pendingDetails: (auctionId = ":auctionId") =>
          `/profile/my-auctions/pending/${auctionId}/details`,
        watingForPaymentDetails: (auctionId = ":auctionId") =>
          `/profile/my-auctions/wating-for-payment/${auctionId}/details`,
        expiredDetails: (auctionId = ":auctionId") =>
          `/profile/my-auctions/expired/${auctionId}/details`,
      },

      myBids: {
        default: `/profile/my-bids`,
        inPogress: `/profile/my-bids/in-pogress`,
        pending: `/profile/my-bids/pending`,
        waitingForDelivery: `/profile/my-bids/waiting-for-delivery`,
        expired: `/profile/my-bids/expired`,
        completed: `/profile/my-bids/completed`,
        cancelled: `/profile/my-bids/cancelled`,

        inPogressDetails: (auctionId = ":auctionId") =>
          `/profile/my-bids/in-pogress/${auctionId}/details`,
        pendingDetails: (auctionId = ":auctionId") =>
          `/profile/my-bids/pending/${auctionId}/details`,
        waitingForDeliveryDetails: (auctionId = ":auctionId") =>
          `/profile/my-bids/waitingForDelivery/${auctionId}/details`,
        expiredDetails: (auctionId = ":auctionId") =>
          `/profile/my-bids/expired/${auctionId}/details`,
        completedDetails: (auctionId = ":auctionId") =>
          `/profile/my-bids/completed/${auctionId}/details`,

        completePayment: `/profile/my-bids/pending/complete-payment`,
      },

      myProducts: {
        default: `/profile/my-products`,
        inPogress: `/profile/my-products/in-pogress`,
        outOfStock: `/profile/my-products/out-of-stock`,
        soldOut: `/profile/my-products/sold-out`,
        drafts: `/profile/my-products/drafts`,
      },

      watchlist: `/profile/watchlist`,
      watchlistDetails: (auctionId = ":auctionId") =>
        `/profile/watchlist/${auctionId}/details`,

      purchased: `/profile/purchased`,
      wallet: `/profile/wallet`,
      notifications: `/profile/notifications`,
    },
    admin: {
      comments: `/admin/comments`,
    },
  },
};

export default routes;

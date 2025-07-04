const api = {
  auth: {
    login: "/auth/sign-in",
    signup: "/auth/sign-up",
    aAuth: "auth/oAuth",
    forgetPassword: "/auth/forget-password",
    resendVerification: "/auth/resend-verification",
    resetCredentials: "/auth/reset-credentials",
    RefrshToken: "/auth/refresh-token",
    logout: "/auth/logout",
  },
  app: {
    allHomecategory: {
      default: "/categories/home",
    },
    subscribers: {
      create: "/users/subscribers/create",
      unsubscribeUser: "/users/subscribers/unSubscribe",
    },
    category: {
      default: "/categories/all",
      getParticularCatergory: (categoryId) =>
        `/categories/getParticularCatergory?categoryId=${categoryId}`,
    },
    subCategory: {
      default: (categoryId) =>
        `/categories/sub-categories?categoryId=${categoryId}`,
    },
    auctions: {
      default: "/auctions",
      oneClickAuction:'/auctions/one-click-auction',
      setDeliveryType: (auctionId) =>
        `/auctions/user/${auctionId}/set-delivery-type`,
      setAssdraft: "/auctions/save-draft",
      setUpdatedraft: (auctionsId) => `auctions/user/${auctionsId}/details`,
      convertListedProductToAuction: (productId) => `auctions/user/${productId}/convertListedProductToAuction`,
      updateAuction: (auctionId) => `/auctions/user/${auctionId}/update`,
      completeUpdatedraft: (auctionsId) =>
        `auctions/user/${auctionsId}/draft-details`,
      cancell_auction: (auctionId) =>
        `/auctions/user/${auctionId}/cancel-auction`,
      send_item_forDelivery: (auctionId) =>
        `/auctions/user/${auctionId}/sendItem-forDelivery`,
      getAllOwnesAuctions: "auctions/user/ownes",
      getOtherUsersAuction: "/auctions/user/user-details",
      getAlldraft: "auctions/user/ownes",
      getAuctionsDetails: (auctionsId) => `/auctions/user/${auctionsId}`,
      getUserAuctionsDetails: (auctionsId) =>
        `/auctions/user/${auctionsId}/details`,
      isPendingPayment: (auctionId, paymentType) =>
        `/auctions/user/pendingPayment?auctionId=${auctionId}&paymentType=${paymentType}`,
      delete: (auctionsId) => `/auctions/user/${auctionsId}`,
      getMain: "/auctions/user/main",
      getLiveAuctions: "auctions/user/live",
      getUpComming: "/auctions/user/up-comming",
      getBuyNow: "/auctions/user/buy-now",
      getExpiredAuctions: "/auctions/user/expired-auctions",
      sponsored: "/auctions/user/sponsored",
      totalBids: (auctionsId) => `/auctions/user/${auctionsId}/total-bids`,
      totalBidsDetails: (auctionsId, userId) =>
        `/auctions/user/${auctionsId}/bids-history?userId=${userId}`,
      submitBid: (auctionsId) => `/auctions/user/${auctionsId}/submit-bid`,
      payForAuction: "/auctions/user/pay",
      walletPayForAuction: "/auctions/user/walletPay",
      PayDepositByBidder: (auctionsId) =>
        `/auctions/user/${auctionsId}/bidder-deposit`,
      walletPayDepositByBidder: "auctions/user/bidder-walletDeposit",
      auctionPurchaseByBidder: (auctionsId) =>
        `/auctions/user/${auctionsId}/bidder-purchase`,
      WalletPayForBidderFullPayment: (auctionsId) =>
        `/auctions/user/${auctionsId}/wallet-bidder-purchase`,
      //
      getAllMyBids: "/auctions/user/joined-auctions",
      bidAnalytics: "auctions/user/joined-auctions/analytics",
      ConfirmDelivery: (auctionsId) =>
        `/auctions/user/${auctionsId}/confirm-delivery`,
      buyNow: (auctionsId) => `/auctions/user/${auctionsId}/buy-now`,
      buyNowThroughWallet: (auctionsId) =>
        `/auctions/user/${auctionsId}/buy-now-through-wallet`,
      SimilarAuctions: (auctionsId) =>
        `/auctions/user/similar?auctionId=${auctionsId}`,
      deliveryIssue: "/auctions/user/auction-complaints",
      getSellerLocation: (auctionId) => `/auctions/user/${auctionId}/location`,
      getBuyerLocation: (auctionId) =>
        `auctions/user/${auctionId}/buyer-location-details`,
      payByBank_uploadBankStatement:
        "/auctions/user/pay-by-banck/upload-bank-statement",
      lockAuction:'/auctions/lock-auction',
    },
    Imagees: {
      upload: (auctionsId,isListing) => `auctions/user/${auctionsId}/upload-image?isListing=${isListing}`,
      delete: (auctionsId, imageId) =>
        `/auctions/user/${auctionsId}/remove-image?imageId=${imageId}`,
    },
    productListing: {
      listNewProduct: `auctions/product-listing`,
      productAnalytics: "auctions/user/product/analytics",
      getAllListedProducts: `auctions/listedProducts/getAllListed-products`,
      getOtherUserProducts: "/auctions/listedProducts/userProductdetails",
      listedProduct: (productId) =>
        `auctions/listedProducts/${productId}/details`,
      SimilarProduct: (productId) =>
        `auctions/product/similar?productId=${productId}`,
      getAllMyProduts: "auctions/user/get-all-myProducts",
      updateProductStatus: (productId) =>
        `auctions/products/updateProductStatus?productId=${productId}`,
      updateListedProduct: (productId) => 
        `auctions/listedProducts/${productId}/update`,
    },
    customField: {
      ByCategoryId: (categoryId) =>
        `/categories/custom-fields?categoryId=${categoryId}`,
      BySubCategoryId: (subCategoryId) =>
        `/categories/custom-fields?subCategoryId=${subCategoryId}`,
      systemField: `categories/system-fields`,
    },
    brand: {
      default: (categoryId) => `/categories/brands?categoryId=${categoryId}`,
      all: "/categories/brands",
    },
    location: {
      post: "/users/locations",
      put: "/users/locations",
      get: "/users/my-locations",
      edit: (locationsId) => `/users/locations/${locationsId}`,
      delete: (locationsId) => `/users/locations/${locationsId}`,
      makeDefault: (locationsId) =>
        `/users/locations/${locationsId}/make-default`,
    },
    countries: {
      default: "/regions/countries",
    },
    cities: {
      default: (countryId) => `/regions/cities?countryId=${countryId}`,
    },
    profile: {
      default: "users/my-profile",
      editPersonalInfo: "/users/personal-info",
      editCredentialsInfo: "/users/credentials-info",
      analytics: "/auctions/user/ownes/analytics",
      purchased: "/auctions/user/purchased-auctions",
    },
    WatchList: {
      get: "/watch-lists/saved",
      add: "/watch-lists/save",
      delete: (auctionsId) => `/watch-lists/un-save?auctionId=${auctionsId}`,
    },
    Wallet: {
      get: "/wallet/get_from_wallet",
      getBalance: "/wallet/get_balance",
      post: "/wallet/add_to_wallet",
      withdrawalRequest: "/auctions/user/withdrawalRequest",
      getAccountData: "/auctions/user/getAccountData",
      addBankAccount: "/auctions/user/addBankAccount",
    },
    notifications: {
      get: "/notifications/get/all",
      subscribe: "/notifications/subscribe",
      markAsRead: "/notifications/mark-as-read",
    },
    whatsApp:{
      sendInspectionDetails: (auctionid) => `/whatsapp/Send-Inspection-Details?auctionId=${auctionid}`
    },
    updateUserBlockStatus :(currentStatus) => 
      `users/updateUserBlockStatus?currentStatus=${currentStatus}`,
  },
};

export default api;

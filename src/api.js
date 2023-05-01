const api = {
  auth: {
    login: "/auth/sign-in",
    signup: "/auth/sign-up",
    aAuth: "auth/oAuth",
    forgetPassword: "/auth/forget-password",
    resendVerification: "/auth/resend-verification",
    resetCredentials: "/auth/reset-credentials",
    RefrshToken: "/auth/refresh-token",
  },
  app: {
    category: {
      default: "/categories/all",
    },
    subCategory: {
      default: (categoryId) =>
        `/categories/sub-categories?categoryId=${categoryId}`,
    },
    auctions: {
      default: "/auctions",
      setAssdraft: "/auctions/save-draft",
      getAlldraft: "auctions/user/ownes?status=DRAFTED",
      getAllactive: "auctions/user/ownes?status=ACTIVE",
      getAllscheduled: "auctions/user/ownes?status=IN_SCHEDULED",
      getAllsold: "auctions/user/ownes?status=SOLD",
      getAllpending: "auctions/user/ownes?status=PENDING_OWNER_DEPOIST",
      getAllexpired: "auctions/user/ownes?status=EXPIRED",
      getAuctionsDetails: (auctionsId) => `/auctions/user/${auctionsId}`,
      getUserAuctionsDetails: (auctionsId) =>
        `/auctions/user/${auctionsId}/details`,
      delete: (auctionsId) => `/auctions/user/${auctionsId}`,
      getMain: "/auctions/user/main",
      getCategory: (categoryId) =>
        `/auctions/user/main?categories[]=${categoryId}`,
      getLiveAuctions: "auctions/user/live",
      getUpComming: "/auctions/user/up-comming",
      getBuyNow: "/auctions/user/buy-now",
      sponsored: "/auctions/user/sponsored",
      totalBids: (auctionsId) => `/auctions/user/${auctionsId}/total-bids`,
      submitBid: (auctionsId) => `/auctions/user/${auctionsId}/submit-bid`,
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
      get: "/users/my-locations",
      edit: (locationsId) => `/users/locations/${locationsId}/set-main`,
      delete: (locationsId) => `/users/locations/${locationsId}`,
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
    },
    WatchList: {
      get: "/watch-lists/saved",
      add: "/watch-lists/save",
      delete: (auctionsId) => `/watch-lists/un-save?auctionId=${auctionsId}`,
    },
  },
};

export default api;

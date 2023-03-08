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
    },
    customField: {
      ByCategoryId: (categoryId) =>
        `/categories/custom-fields?categoryId=${categoryId}`,
      BySubCategoryId: (subCategoryId) =>
        `/categories/custom-fields?subCategoryId=${subCategoryId}`,
    },
    brand: {
      default: (categoryId) => `/categories/brands?categoryId=${categoryId}`,
    },
    location: {
      post: "/users/locations",
      get: "/users/my-locations",
    },
    countries: {
      default: "/regions/countries",
    },
    cities: {
      default: (countryId) => `/regions/cities?countryId=${countryId}`,
    },
  },
};

export default api;

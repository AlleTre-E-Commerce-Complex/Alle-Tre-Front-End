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
      default: (categoryId = ":categoryId") =>
        `/categories/sub-categories?categoryId=${categoryId}`,
    },
    customField: {
      ByCategoryId: (categoryId = ":categoryId") =>
        `/categories/custom-fields?categoryId=${categoryId}`,
      BySubCategoryId: (subCategoryId = ":subCategoryId") =>
        `/categories/custom-fields?subCategoryId=${subCategoryId}`,
    },
    brand: {
      default: (categoryId = ":categoryId") =>
        `/categories/brands?categoryId=${categoryId}`,
    },
    location: {
      post: "/users/locations",
      get: "/users/my-locations",
    },
    countries: {
      default: "/regions/countries",
    },
    cities: {
      default: (countryId = ":countryId") =>
        `/regions/cities?countryId=${countryId}`,
    },
  },
};

export default api;

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
  },
};

export default api;

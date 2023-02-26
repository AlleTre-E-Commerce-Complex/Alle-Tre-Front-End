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
};

export default routes;

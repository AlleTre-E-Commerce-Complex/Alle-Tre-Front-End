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
  },
};

export default routes;

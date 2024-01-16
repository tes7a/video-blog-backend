import { Router } from "express";
import { authController } from "../compositions";
import {
  apiConnectMiddleware,
  authMiddleware,
  checkConfirmationCodeMiddleware,
  checkCookieMiddleware,
  checkEmailMiddleware,
  checkEmailPasswordRecoveryMiddleware,
  checkRecoveryPassword,
  createAuthValidationMiddleware,
  registrationAuthValidationMiddleware,
} from "../middleware";

export const authRoute = Router({});

authRoute.get("/me", authMiddleware, authController.me.bind(authController));

authRoute.post(
  "/registration",
  apiConnectMiddleware,
  registrationAuthValidationMiddleware,
  authController.registration.bind(authController)
);

authRoute.post(
  "/login",
  apiConnectMiddleware,
  createAuthValidationMiddleware,
  authController.login.bind(authController)
);

authRoute.post(
  "/registration-confirmation",
  apiConnectMiddleware,
  checkConfirmationCodeMiddleware,
  authController.registrationConfirmation.bind(authController)
);

authRoute.post(
  "/registration-email-resending",
  apiConnectMiddleware,
  checkEmailMiddleware,
  authController.emailResending.bind(authController)
);

authRoute.post(
  "/refresh-token",
  apiConnectMiddleware,
  checkCookieMiddleware,
  authController.refreshToken.bind(authController)
);

authRoute.post(
  "/password-recovery",
  checkEmailPasswordRecoveryMiddleware,
  apiConnectMiddleware,
  authController.passwordRecovery.bind(authController)
);

authRoute.post(
  "/new-password",
  apiConnectMiddleware,
  checkRecoveryPassword,
  authController.newPassword.bind(authController)
);

authRoute.post(
  "/logout",
  checkCookieMiddleware,
  authController.logout.bind(authController)
);

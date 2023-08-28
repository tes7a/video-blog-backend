import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import {
  checkConfirmationCodeMiddleware,
  checkCookieMiddleware,
  checkEmailMiddleware,
  checkEmailPasswordRecoveryMiddleware,
  checkRecoveryPassword,
  createAuthValidationMiddleware,
  registrationAuthValidationMiddleware,
} from "../middleware/validation/auth-validation";
import { RequestWithBody } from "../types/types";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { AuthOutputUserModel } from "../models/auth/AuthOutputUserModel";
import { AuthRegistrationModel } from "../models/auth/AuthRegistrationModel";
import { apiConnectMiddleware } from "../middleware/api-connects-middleware";
import { authService, jwtService, userService } from "../services";

export const authRoute = Router({});
const { No_Content, Unauthorized, OK, Bad_Request } = HTTPS_ANSWERS;

class AuthController {
  async me(req: Request, res: Response<AuthOutputUserModel>) {
    const result = await userService.findLoggedUser(req.userId);
    if (result) return res.status(OK).send(result);
  }

  async registration(
    req: RequestWithBody<AuthRegistrationModel>,
    res: Response
  ) {
    const { email, login, password } = req.body;
    const result = await authService.createUser({ email, login, password });
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async login(
    req: RequestWithBody<AuthLoginModel>,
    res: Response<{ accessToken: string }>
  ) {
    const result = await authService.login(req);
    if (result) {
      const { user, refreshToken } = result;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(OK).send(await jwtService.createJWT(user));
    }

    return res.sendStatus(Unauthorized);
  }

  async registrationConfirmation(
    req: RequestWithBody<{ code: string }>,
    res: Response
  ) {
    const { code } = req.body;
    const result = await authService.confirmCode(code);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async emailResending(req: RequestWithBody<{ email: string }>, res: Response) {
    const { email } = req.body;
    const result = await authService.resendingMail(email);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async refreshToken(req: Request, res: Response<{ accessToken: string }>) {
    const result = await authService.refreshToken(req);
    if (result) {
      const { user, isDevice } = result;
      if (isDevice) return res.sendStatus(Unauthorized);
      return res.status(OK).send(await jwtService.createJWT(user));
    }

    return res.sendStatus(Unauthorized);
  }

  async passwordRecovery(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ) {
    const { email } = req.body;
    await authService.passwordRecovery(email);
    return res.sendStatus(No_Content);
  }

  async newPassword(
    req: RequestWithBody<{ newPassword: string; recoveryCode: string }>,
    res: Response
  ) {
    const { newPassword, recoveryCode } = req.body;
    const result = await authService.changePassword(newPassword, recoveryCode);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async logout(req: Request, res: Response) {
    const result = await authService.logout(req.cookies.refreshToken);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Unauthorized);
  }
}

const authControllerInstance = new AuthController();

authRoute.get("/me", authMiddleware, authControllerInstance.me);

authRoute.post(
  "/registration",
  apiConnectMiddleware,
  registrationAuthValidationMiddleware,
  authControllerInstance.registration
);

authRoute.post(
  "/login",
  apiConnectMiddleware,
  createAuthValidationMiddleware,
  authControllerInstance.login
);

authRoute.post(
  "/registration-confirmation",
  apiConnectMiddleware,
  checkConfirmationCodeMiddleware,
  authControllerInstance.registrationConfirmation
);

authRoute.post(
  "/registration-email-resending",
  apiConnectMiddleware,
  checkEmailMiddleware,
  authControllerInstance.emailResending
);

authRoute.post(
  "/refresh-token",
  apiConnectMiddleware,
  checkCookieMiddleware,
  authControllerInstance.refreshToken
);

authRoute.post(
  "/password-recovery",
  checkEmailPasswordRecoveryMiddleware,
  apiConnectMiddleware,
  authControllerInstance.passwordRecovery
);

authRoute.post(
  "/new-password",
  apiConnectMiddleware,
  checkRecoveryPassword,
  authControllerInstance.newPassword
);

authRoute.post("/logout", checkCookieMiddleware, authControllerInstance.logout);

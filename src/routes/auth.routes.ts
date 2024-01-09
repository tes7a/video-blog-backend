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
import { AuthService, JwtService, UserService } from "../services";

export const authRoute = Router({});
const { No_Content, Unauthorized, OK, Bad_Request } = HTTPS_ANSWERS;

class AuthController {
  authService: AuthService;
  userService: UserService;
  jwtService: JwtService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.jwtService = new JwtService();
  }

  async me(req: Request, res: Response<AuthOutputUserModel>) {
    const result = await this.userService.findLoggedUser(req.userId);
    if (result) return res.status(OK).send(result);
  }

  async registration(
    req: RequestWithBody<AuthRegistrationModel>,
    res: Response
  ) {
    const { email, login, password } = req.body;
    const result = await this.authService.createUser({
      email,
      login,
      password,
    });
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async login(
    req: RequestWithBody<AuthLoginModel>,
    res: Response<{ accessToken: string }>
  ) {
    const result = await this.authService.login(req);
    if (result) {
      const { user, refreshToken } = result;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(OK).send(await this.jwtService.createJWT(user));
    }

    return res.sendStatus(Unauthorized);
  }

  async registrationConfirmation(
    req: RequestWithBody<{ code: string }>,
    res: Response
  ) {
    const { code } = req.body;
    const result = await this.authService.confirmCode(code);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async emailResending(req: RequestWithBody<{ email: string }>, res: Response) {
    const { email } = req.body;
    const result = await this.authService.resendingMail(email);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async refreshToken(req: Request, res: Response<{ accessToken: string }>) {
    const result = await this.authService.refreshToken(req);
    if (result) {
      const { user, isDevice } = result;
      if (isDevice) return res.sendStatus(Unauthorized);
      return res.status(OK).send(await this.jwtService.createJWT(user));
    }

    return res.sendStatus(Unauthorized);
  }

  async passwordRecovery(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ) {
    const { email } = req.body;
    await this.authService.passwordRecovery(email);
    return res.sendStatus(No_Content);
  }

  async newPassword(
    req: RequestWithBody<{ newPassword: string; recoveryCode: string }>,
    res: Response
  ) {
    const { newPassword, recoveryCode } = req.body;
    const result = await this.authService.changePassword(
      newPassword,
      recoveryCode
    );
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }

  async logout(req: Request, res: Response) {
    const result = await this.authService.logout(req.cookies.refreshToken);
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
  authControllerInstance.registration.bind(authControllerInstance)
);

authRoute.post(
  "/login",
  apiConnectMiddleware,
  createAuthValidationMiddleware,
  authControllerInstance.login.bind(authControllerInstance)
);

authRoute.post(
  "/registration-confirmation",
  apiConnectMiddleware,
  checkConfirmationCodeMiddleware,
  authControllerInstance.registrationConfirmation.bind(authControllerInstance)
);

authRoute.post(
  "/registration-email-resending",
  apiConnectMiddleware,
  checkEmailMiddleware,
  authControllerInstance.emailResending.bind(authControllerInstance)
);

authRoute.post(
  "/refresh-token",
  apiConnectMiddleware,
  checkCookieMiddleware,
  authControllerInstance.refreshToken.bind(authControllerInstance)
);

authRoute.post(
  "/password-recovery",
  checkEmailPasswordRecoveryMiddleware,
  apiConnectMiddleware,
  authControllerInstance.passwordRecovery.bind(authControllerInstance)
);

authRoute.post(
  "/new-password",
  apiConnectMiddleware,
  checkRecoveryPassword,
  authControllerInstance.newPassword.bind(authControllerInstance)
);

authRoute.post(
  "/logout",
  checkCookieMiddleware,
  authControllerInstance.logout.bind(authControllerInstance)
);

import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import { userService } from "../services/users-service";
import {
  checkConfirmationCodeMiddleware,
  checkCookieMiddleware,
  checkEmailMiddleware,
  createAuthValidationMiddleware,
  registrationAuthValidationMiddleware,
} from "../middleware/validation/auth-validation";
import { jwtService } from "../services/jwt-service";
import { RequestWithBody } from "../types/types";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { AuthOutputUserModel } from "../models/auth/AuthOutputUserModel";
import { AuthRegistrationModel } from "../models/auth/AuthRegistrationModel";
import { authService } from "../services/auth-service";
import { deviceService } from "../services/device-service";

export const authRoute = Router({});
const { No_Content, Unauthorized, OK, Bad_Request } = HTTPS_ANSWERS;

authRoute.get(
  "/me",
  authMiddleware,
  async (req: Request, res: Response<AuthOutputUserModel>) => {
    const result = await userService.findLoggedUser(req.userId);
    if (result) return res.status(OK).send(result);
  }
);

authRoute.post(
  "/registration",
  registrationAuthValidationMiddleware,
  async (req: RequestWithBody<AuthRegistrationModel>, res: Response) => {
    const { email, login, password } = req.body;
    const result = await authService.createUser({ email, login, password });
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }
);

authRoute.post(
  "/login",
  createAuthValidationMiddleware,
  async (
    req: RequestWithBody<AuthLoginModel>,
    res: Response<{ accessToken: string }>
  ) => {
    const { loginOrEmail, password } = req.body;
    const user = await userService.checkUserCredentials({
      loginOrEmail,
      password,
    });
    if (user) {
      const refreshToken = await jwtService.createRefreshJWT(user);
      const result = await userService.updateToken(user.id, refreshToken);
      await deviceService.createDevice({
        userId: user.id,
        lastActiveDate: new Date().toISOString(),
        ip:
          (req.headers["x-forwarded-for"] as string) ||
          (req.socket.remoteAddress as string),
        deviceId: req.headers["x-device-id"] as string,
        title: req.headers["user-agent"] as string, /// need to ask ????
      });
      if (!result) return res.sendStatus(Unauthorized);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return res.status(OK).send(await jwtService.createJWT(user));
    }
    return res.sendStatus(Unauthorized);
  }
);

authRoute.post(
  "/registration-confirmation",
  checkConfirmationCodeMiddleware,
  async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const { code } = req.body;
    const result = await authService.confirmCode(code);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }
);

authRoute.post(
  "/registration-email-resending",
  checkEmailMiddleware,
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendingMail(email);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Bad_Request);
  }
);

authRoute.post(
  "/refresh-token",
  checkCookieMiddleware,
  async (req: Request, res: Response<{ accessToken: string }>) => {
    const token = req.cookies.refreshToken;
    const user = await authService.findByToken(token);
    if (user) {
      const refreshToken = await jwtService.createRefreshJWT(user);
      const result = await userService.updateToken(user.id, refreshToken);
      if (!result) return res.sendStatus(Unauthorized);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return res.status(OK).send(await jwtService.createJWT(user));
    }
    if (!user) return res.sendStatus(Unauthorized);
    return res.sendStatus(Unauthorized);
  }
);

authRoute.post(
  "/logout",
  checkCookieMiddleware,
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    const result = await authService.logout(token);
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Unauthorized);
  }
);

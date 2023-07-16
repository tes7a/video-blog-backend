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
import { apiConnectMiddleware } from "../middleware/api-connects-middleware";
import { randomUUID } from "crypto";

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
  apiConnectMiddleware,
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
  apiConnectMiddleware,
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
      const deviceId = randomUUID();
      const refreshToken = await jwtService.createRefreshJWT(user, deviceId);
      const result = await userService.updateToken(user.id, refreshToken);
      const date = await jwtService.getJwtDate(refreshToken);
      await deviceService.createDevice({
        userId: user.id,
        lastActiveDate: date!.toISOString(),
        ip: req.ip,
        deviceId,
        title: req.headers["user-agent"] || ("custom user-agent" as string),
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
  apiConnectMiddleware,
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
  apiConnectMiddleware,
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
  apiConnectMiddleware,
  checkCookieMiddleware,
  async (req: Request, res: Response<{ accessToken: string }>) => {
    const token = req.cookies.refreshToken;
    const result = await jwtService.getUserIdByToken(token);
    if (!result) return res.sendStatus(Unauthorized);
    const user = await userService.findUserById(result.userId);
    if (user) {
      const tokenDate = await jwtService.getJwtDate(token);
      const isDevice = await deviceService.getDevice(req.params.id, tokenDate!);
      if (isDevice) return res.sendStatus(Unauthorized);
      const refreshToken = await jwtService.createRefreshJWT(
        user,
        result.deviceId
      );
      const date = await jwtService.getJwtDate(refreshToken);
      await deviceService.updateDevice({
        userId: user.id,
        lastActiveDate: date!.toISOString(),
        ip: req.ip,
        deviceId: result.deviceId,
        title: req.headers["user-agent"] || ("custom user-agent" as string),
      });
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

import { Request, Response } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithBody } from "../types/types";
import { AuthService, JwtService, UserService } from "../services";
import {
  AuthLoginModel,
  AuthOutputUserModel,
  AuthRegistrationModel,
} from "../models";

const { No_Content, Unauthorized, OK, Bad_Request } = HTTPS_ANSWERS;

export class AuthController {
  constructor(
    protected authService: AuthService,
    protected userService: UserService,
    protected jwtService: JwtService
  ) {}

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

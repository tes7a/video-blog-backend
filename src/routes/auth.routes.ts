import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import { userService } from "../services/users-service";
import { createAuthValidationMiddleware } from "../middleware/validation/auth-validation";
import { jwtService } from "../services/jwt-service";
import { RequestWithBody } from "../types/types";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { AuthOutputUserModel } from "../models/auth/AuthOutputUserModel";

export const authRoute = Router({});
const { Created, Unauthorized, OK } = HTTPS_ANSWERS;

authRoute.get(
  "/me",
  authMiddleware,
  async (req: Request, res: Response<AuthOutputUserModel>) => {
    const result = await userService.findLoggedUser(req.userId);
    if (result) return res.status(OK).send(result);
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
      return res.status(OK).send(await jwtService.createJWT(user));
    }
    return res.sendStatus(Unauthorized);
  }
);

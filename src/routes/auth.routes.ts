import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithBody } from "../types";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import { userService } from "../services/users-service";
import { createAuthValidationMiddleware } from "../middleware/validation/auth-validation";

export const authRoute = Router({});
const { OK, Not_Found, No_Content, Unauthorized } = HTTPS_ANSWERS;

authRoute.post(
  "/login",
  createAuthValidationMiddleware,
  async (req: RequestWithBody<AuthLoginModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;
    const response = await userService.checkUserCredentials({
      loginOrEmail,
      password,
    });
    if (response) return res.sendStatus(No_Content);
    return res.sendStatus(Unauthorized);
  }
);

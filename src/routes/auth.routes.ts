import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import { userService } from "../services/users-service";
import { createAuthValidationMiddleware } from "../middleware/validation/auth-validation";
import { jwtService } from "../services/jwt-service";
import { RequestWithBody } from "../types/types";

export const authRoute = Router({});
const { Created, Unauthorized } = HTTPS_ANSWERS;

authRoute.post(
  "/login",
  createAuthValidationMiddleware,
  async (req: RequestWithBody<AuthLoginModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;
    const user = await userService.checkUserCredentials({
      loginOrEmail,
      password,
    });
    if (user) {
      return res.status(Created).send(await jwtService.createJWT(user));
    }
    return res.sendStatus(Unauthorized);
  }
);

import { NextFunction, Request, Response } from "express";
import { HTTPS_ANSWERS } from "../../utils/https-answers";

export const authMiddlewareCustomVariant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(HTTPS_ANSWERS.Unauthorized);
  const [authType, authValue] = auth.split(" ");
  if (authType !== "Basic" || authValue !== "YWRtaW46cXdlcnR5")
    return res.sendStatus(HTTPS_ANSWERS.Unauthorized);
  return next();
};

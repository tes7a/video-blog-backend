import { NextFunction, Request, Response } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";

///tested variant with custom middleware
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { Unauthorized } = HTTPS_ANSWERS;
  if (req.headers.authorization === "Basic YWRtaW46cXdlcnR5") next();
  return res.sendStatus(Unauthorized);
};

import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HTTPS_ANSWERS } from "../utils/https-answers";

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors
      .array({ onlyFirstError: true })
      .map((e: any) => ({ message: e.msg, field: e.path }));

    return res.status(HTTPS_ANSWERS.Bad_Request).send({ errorsMessages });
  }

  return next();
};

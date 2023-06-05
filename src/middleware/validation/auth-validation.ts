import { body } from "express-validator";
import { inputValidationMiddleware } from "./input-validation.middleware";
import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../services/jwt-service";
import { userService } from "../../services/users-service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debugger;
  if (!req.headers.authorization) {
    return res.send(401);
  }
  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    //@ts-ignore
    const { _id } = await userService.findUserById(userId);
    req.userId = _id;
    return next();
  }
  return res.sendStatus(401);
};

const loginOrEmailMiddleware = body("loginOrEmail")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string");

const passwordMiddleware = body("password")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string");

export const createAuthValidationMiddleware = [
  loginOrEmailMiddleware,
  passwordMiddleware,
  inputValidationMiddleware,
];

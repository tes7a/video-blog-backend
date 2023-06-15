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
  if (!req.headers.authorization) {
    return res.send(401);
  }
  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    const user = await userService.findUserById(userId);
    req.userId = user!.id;
    next();
  } else {
    return res.sendStatus(401);
  }
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

const loginRegMiddleware = body("login")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ min: 3 })
  .withMessage("Min length 3 charters")
  .isLength({ max: 10 })
  .withMessage("Max length 10 charters")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("Must be valid");

const passwordRegMiddleware = body("password")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ min: 6 })
  .withMessage("Min length 6 charters")
  .isLength({ max: 20 })
  .withMessage("Max length 20 charters");

const emailRegMiddleware = body("email")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Must be valid");

const confirmationCodeMiddleware = body("code")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string");

export const registrationAuthValidationMiddleware = [
  loginRegMiddleware,
  passwordRegMiddleware,
  emailRegMiddleware,
  inputValidationMiddleware,
];

export const createAuthValidationMiddleware = [
  loginOrEmailMiddleware,
  passwordMiddleware,
  inputValidationMiddleware,
];

export const checkConfirmationCodeMiddleware = [
  confirmationCodeMiddleware,
  inputValidationMiddleware,
];

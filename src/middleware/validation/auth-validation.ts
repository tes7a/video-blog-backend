import { body, cookie, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../input-validation.middleware";
import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../services/jwt-service";
import { userService } from "../../services/users-service";
import { HTTPS_ANSWERS } from "../../utils/https-answers";
import { authService } from "../../services/auth-service";

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
  .withMessage("Must be valid")
  .custom(async (value) => {
    const user = await authService.checkUser(value);
    if (user) throw new Error("This login is already being used");

    return true;
  });

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
  .withMessage("Must be valid")
  .custom(async (value) => {
    const user = await authService.checkUser(value);
    if (user) throw new Error("This email is already being used");

    return true;
  });

const confirmationCodeMiddleware = body("code")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .custom(async (value) => {
    const result = await authService.checkConfirmationCode(value);
    if (result) throw new Error("The code is invalid or has already been used");

    return true;
  });

const emailResendMiddleware = body("email")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Must be valid")
  .custom(async (value) => {
    const user = await authService.checkUser(value);
    if (!user) throw new Error("User email doesnt exist");
    if (user?.emailConfirmation?.isConfirmed)
      throw new Error("Email already confirmed");

    return true;
  });

export const inputValidationForRegistrationMiddleware = (
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

export const inputValidationForCookieMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors
      .array({ onlyFirstError: true })
      .map((e: any) => ({ message: e.msg, field: e.path }));

    return res.status(HTTPS_ANSWERS.Unauthorized).send({ errorsMessages });
  }

  return next();
};

const cookieValidation = cookie("refreshToken")
  .notEmpty()
  .withMessage("No Cookie")
  .custom(async (value) => {
    const userId = await jwtService.getUserIdByToken(value);
    if (!userId) throw new Error("Token Expired");
    return true;
  });

export const registrationAuthValidationMiddleware = [
  loginRegMiddleware,
  passwordRegMiddleware,
  emailRegMiddleware,
  inputValidationMiddleware,
];

export const createAuthValidationMiddleware = [
  loginOrEmailMiddleware,
  passwordMiddleware,
  inputValidationForRegistrationMiddleware,
];

export const checkConfirmationCodeMiddleware = [
  confirmationCodeMiddleware,
  inputValidationForRegistrationMiddleware,
];

export const checkEmailMiddleware = [
  emailResendMiddleware,
  inputValidationForRegistrationMiddleware,
];

export const checkCookieMiddleware = [
  cookieValidation,
  inputValidationForCookieMiddleware,
];

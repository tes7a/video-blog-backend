import { body, cookie, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../input-validation.middleware";
import { NextFunction, Request, Response } from "express";
import { HTTPS_ANSWERS } from "../../utils/https-answers";
import { UsersRepository } from "../../repositories/users-repository";
import { AuthService, JwtService, UserService } from "../../services";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.send(401);
  }
  const token = req.headers.authorization.split(" ")[1];
  // const result = await jwtService.getUserIdByToken(token);
  // if (!result) return res.sendStatus(401);
  // const user = await userService.findUserById(result.userId);
  // req.userId = user!.id;
  next();
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
// .custom(async (value) => {
//   const user = await authService.checkUser(value);
//   if (user) throw new Error("This login is already being used");

//   return true;
// });

const passwordRegMiddleware = body("password")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ min: 6 })
  .withMessage("Min length 6 charters")
  .isLength({ max: 20 })
  .withMessage("Max length 20 charters");

const newPasswordRegMiddleware = body("newPassword")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ min: 6 })
  .withMessage("Min length 6 charters")
  .isLength({ max: 20 })
  .withMessage("Max length 20 charters");

const recoveryCodeMiddleware = body("recoveryCode")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string");
// .custom(async (value) => {
//   const code = await usersRepository.findRecoveryCode(value);
//   if (!code) throw new Error("Bad recovery code");

//   return true;
// });

const emailRegMiddleware = body("email")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Must be valid");
// .custom(async (value) => {
//   const user = await authService.checkUser(value);
//   if (user) throw new Error("This email is already being used");

//   return true;
// });

const confirmationCodeMiddleware = body("code")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string");
// .custom(async (value) => {
//   const result = await authService.checkConfirmationCode(value);
//   if (result) throw new Error("The code is invalid or has already been used");

//   return true;
// });

const emailResendMiddleware = body("email")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Must be valid");
// .custom(async (value) => {
//   const user = await authService.checkUser(value);
//   if (!user) throw new Error("User email doesnt exist");
//   if (user?.emailConfirmation?.isConfirmed)
//     throw new Error("Email already confirmed");

//   return true;
// });

const emailRecoveryMiddleware = body("email")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Must be valid");

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

const cookieValidation = cookie("refreshToken")
  .notEmpty()
  .withMessage("No Cookie");
// .custom(async (value) => {
//   const result = await jwtService.getUserIdByToken(value);
//   if (!result) throw new Error("Token Expired");
//   return true;
// });

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

export const checkRecoveryPassword = [
  newPasswordRegMiddleware,
  recoveryCodeMiddleware,
  inputValidationMiddleware,
];

export const checkEmailPasswordRecoveryMiddleware = [
  emailRecoveryMiddleware,
  inputValidationMiddleware,
];

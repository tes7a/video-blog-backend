import { body } from "express-validator";
import { inputValidationMiddleware } from "./input-validation.middleware";

const loginMiddleware = body("login")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ min: 3 })
  .withMessage("Min length 3 charters")
  .isLength({ max: 10 })
  .withMessage("Max length 10 charters")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("Login must be valid");

const passwordMiddleware = body("password")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ min: 6 })
  .withMessage("Min length 6 charters")
  .isLength({ max: 20 })
  .withMessage("Max length 20 charters");

const emailMiddleware = body("email")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Email must be valid");

export const createUserValidationMiddleware = [
  loginMiddleware,
  passwordMiddleware,
  emailMiddleware,
  inputValidationMiddleware,
];

import { body } from "express-validator";
import { inputValidationMiddleware } from "./input-validation.middleware";

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

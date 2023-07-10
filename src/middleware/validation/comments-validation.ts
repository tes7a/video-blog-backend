import { body } from "express-validator";
import { inputValidationMiddleware } from "../input-validation.middleware";

const contentMiddleware = body("content")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ min: 20 })
  .withMessage("Min length 20 charters")
  .isLength({ max: 300 })
  .withMessage("Max length 300 charters");

export const createCommentsValidationMiddleware = [
  contentMiddleware,
  inputValidationMiddleware,
];

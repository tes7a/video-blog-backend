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

const likeStatusMiddleware = body("likeStatus")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isIn(["None", "Like", "Dislike"])
  .withMessage("Should be a None, Like, Dislike");

export const likeStatusValidationMiddleware = [
  contentMiddleware,
  likeStatusMiddleware,
];

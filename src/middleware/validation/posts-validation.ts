import { body } from "express-validator";
import { inputValidationMiddleware } from "./input-validation.middleware";

const titleMiddleware = body("title")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 30 })
  .withMessage("Max length 30 charters");

const shortDescriptionMiddleware = body("shortDescription")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 100 })
  .withMessage("Max length 100 charters");

const contentMiddleware = body("content")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 1000 })
  .withMessage("Max length 1000 charters");

const blogIdMiddleware = body("blogId")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isNumeric({ no_symbols: true })
  .withMessage("Should be number");

export const createPostsValidationMiddleware = [
  titleMiddleware,
  shortDescriptionMiddleware,
  contentMiddleware,
  blogIdMiddleware,
  inputValidationMiddleware,
];

export const createPostForBlogIdValidationMiddleware = [
  titleMiddleware,
  shortDescriptionMiddleware,
  contentMiddleware,
  inputValidationMiddleware,
];

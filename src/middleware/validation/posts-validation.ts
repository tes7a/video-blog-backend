import { body } from "express-validator";
import { inputValidationMiddleware } from "./input-validation.middleware";

const titleMiddleware = body("title")
  .notEmpty()
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 30 })
  .withMessage("Max length 15 charters");

const shortDescriptionMiddleware = body("shortDescription")
  .notEmpty()
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 100 })
  .withMessage("Max length 15 charters");

const contentMiddleware = body("content")
  .notEmpty()
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 1000 })
  .withMessage("Max length 15 charters");

const blogIdMiddleware = body("blogId")
  .notEmpty()
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string");

export const createPostsValidationMiddleware = [
  titleMiddleware,
  shortDescriptionMiddleware,
  contentMiddleware,
  blogIdMiddleware,
  inputValidationMiddleware,
];

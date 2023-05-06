import { body } from "express-validator";
import { inputValidationMiddleware } from "./input-validation.middleware";

const nameMiddleware = body("name")
  .notEmpty()
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 15 })
  .withMessage("Max length 15 charters");

const descriptionMiddleware = body("description")
  .notEmpty()
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 500 })
  .withMessage("Max length 500 charters");

const websiteUrlMiddleware = body("websiteUrl")
  .notEmpty()
  .withMessage("Should not be empty")
  .isString()
  .withMessage("Should be a string")
  .isLength({ max: 100 })
  .withMessage("Max length 100 charters")
  .isURL()
  .withMessage("Should be a URL");

export const createBlogValidationMiddleware = [
  nameMiddleware,
  descriptionMiddleware,
  websiteUrlMiddleware,
  inputValidationMiddleware,
];

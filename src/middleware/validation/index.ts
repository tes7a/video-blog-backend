import {
  authMiddleware,
  checkConfirmationCodeMiddleware,
  checkCookieMiddleware,
  checkEmailMiddleware,
  checkEmailPasswordRecoveryMiddleware,
  checkRecoveryPassword,
  createAuthValidationMiddleware,
  inputValidationForCookieMiddleware,
  inputValidationForRegistrationMiddleware,
  registrationAuthValidationMiddleware,
} from "./auth-validation";
import { createBlogValidationMiddleware } from "./blogs-validation";
import {
  createCommentsValidationMiddleware,
  likeStatusValidationMiddleware,
} from "./comments-validation";
import {
  createPostForBlogIdValidationMiddleware,
  createPostsValidationMiddleware,
} from "./posts-validation";
import { createUserValidationMiddleware } from "./users-validation";
import { authMiddlewareCustomVariant } from "./basic-auth.middleware";

export {
  authMiddleware,
  checkConfirmationCodeMiddleware,
  checkCookieMiddleware,
  checkEmailMiddleware,
  checkEmailPasswordRecoveryMiddleware,
  checkRecoveryPassword,
  createAuthValidationMiddleware,
  inputValidationForCookieMiddleware,
  inputValidationForRegistrationMiddleware,
  registrationAuthValidationMiddleware,
  createBlogValidationMiddleware,
  createCommentsValidationMiddleware,
  likeStatusValidationMiddleware,
  createPostForBlogIdValidationMiddleware,
  createPostsValidationMiddleware,
  createUserValidationMiddleware,
  authMiddlewareCustomVariant,
};

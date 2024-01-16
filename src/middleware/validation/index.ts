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
import {
  // authMiddleware as authBasicMiddleware,
  authMiddlewareCustomVariant,
} from "./basic-auth.middleware";
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
  // authBasicMiddleware,
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  createCommentsValidationMiddleware,
  likeStatusValidationMiddleware,
  createPostForBlogIdValidationMiddleware,
  createPostsValidationMiddleware,
  createUserValidationMiddleware,
};

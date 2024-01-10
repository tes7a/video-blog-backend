import { Router } from "express";
import { createPostsValidationMiddleware } from "../middleware/validation/posts-validation";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { createCommentsValidationMiddleware } from "../middleware/validation/comments-validation";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { postsController } from "../compositions";

export const postsRoute = Router({});

postsRoute.get("/", postsController.getAllPosts.bind(postsController));

postsRoute.get(
  "/:id/comments",
  postsController.getCommentsPost.bind(postsController)
);

postsRoute.get("/:id", postsController.getPostById.bind(postsController));

postsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  postsController.createPost.bind(postsController)
);

postsRoute.post(
  "/:id/comments",
  authMiddleware,
  createCommentsValidationMiddleware,
  postsController.createComment.bind(postsController)
);

postsRoute.put(
  "/:id",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  postsController.updatePost.bind(postsController)
);

postsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  postsController.deletePost.bind(postsController)
);

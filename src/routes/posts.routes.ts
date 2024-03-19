import { Router } from "express";
import { postsController } from "../compositions";
import {
  authMiddleware,
  authMiddlewareCustomVariant,
  createCommentsValidationMiddleware,
  createPostsValidationMiddleware,
  inputValidationMiddleware,
  likeStatusValidationMiddleware,
} from "../middleware";

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

postsRoute.put(
  "/:id/like-status",
  authMiddleware,
  likeStatusValidationMiddleware,
  postsController.updateLike.bind(postsController)
);

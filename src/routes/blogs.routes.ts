import { Router } from "express";
import { createBlogValidationMiddleware } from "../middleware/validation/blogs-validation";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { createPostForBlogIdValidationMiddleware } from "../middleware/validation/posts-validation";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { blogsController } from "../compositions";

export const blogsRoute = Router({});

blogsRoute.get("/", blogsController.getAllBlogs.bind(blogsController));

blogsRoute.get("/:id", blogsController.getById.bind(blogsController));

blogsRoute.get(
  "/:id/posts",
  blogsController.getPostsByIdBlog.bind(blogsController)
);

blogsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  blogsController.createBlog.bind(blogsController)
);

blogsRoute.post(
  "/:id/posts",
  authMiddlewareCustomVariant,
  createPostForBlogIdValidationMiddleware,
  blogsController.createPostForCurrentBlog.bind(blogsController)
);

blogsRoute.put(
  "/:id",
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  blogsController.updateBlog.bind(blogsController)
);

blogsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  blogsController.deleteById.bind(blogsController)
);

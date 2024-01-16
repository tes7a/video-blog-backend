import { Router } from "express";
import { blogsController } from "../compositions";
import {
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  createPostForBlogIdValidationMiddleware,
  inputValidationMiddleware,
} from "../middleware";

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

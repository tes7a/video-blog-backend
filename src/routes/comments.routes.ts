import { Router } from "express";
import { createCommentsValidationMiddleware } from "../middleware/validation/comments-validation";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { commentsController } from "../compositions";

export const commentsRoute = Router({});

commentsRoute.get(
  "/:id",
  commentsController.getCommentsById.bind(commentsController)
);

commentsRoute.put(
  "/:id",
  authMiddleware,
  createCommentsValidationMiddleware,
  commentsController.updateComment.bind(commentsController)
);

commentsRoute.delete(
  "/:id",
  authMiddleware,
  inputValidationMiddleware,
  commentsController.deleteComment.bind(commentsController)
);

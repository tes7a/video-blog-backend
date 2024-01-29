import { Router } from "express";
import { commentsController } from "../compositions";
import {
  authMiddleware,
  createCommentsValidationMiddleware,
  inputValidationMiddleware,
  likeStatusValidationMiddleware,
} from "../middleware";

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

commentsRoute.put(
  "/:id/like-status",
  authMiddleware,
  likeStatusValidationMiddleware,
  commentsController.updateLike.bind(commentsController)
);

import { Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithParams } from "../types/types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { RequestWithParamsAndBody } from "../types/types";
import { createCommentsValidationMiddleware } from "../middleware/validation/comments-validation";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { commentsService } from "../services";

export const commentsRoute = Router({});

const { OK, Not_Found, No_Content, Forbidden } = HTTPS_ANSWERS;

class CommentsController {
  async getCommentsById(
    req: RequestWithParams<URIParamsModel>,
    res: Response<CommentsOutputModel>
  ) {
    const comments = await commentsService.getCommentsById(req.params.id);
    if (!comments) return res.sendStatus(Not_Found);
    return res.status(OK).send(comments);
  }

  async updateComment(
    req: RequestWithParamsAndBody<URIParamsModel, { content: string }>,
    res: Response<CommentsOutputModel>
  ) {
    const { content } = req.body;
    const comments = await commentsService.getCommentsById(req.params.id);
    const result = await commentsService.updateComment(req.params.id, content);
    if (req.userId === comments?.commentatorInfo.userId) {
      if (result) return res.sendStatus(No_Content);
    }
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(Forbidden);
  }

  async deleteComment(req: RequestWithParams<URIParamsModel>, res: Response) {
    const comments = await commentsService.getCommentsById(req.params.id);
    const result = await commentsService.deleteComment(req.params.id);
    if (req.userId === comments?.commentatorInfo.userId) {
      return res.sendStatus(No_Content);
    }
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(Forbidden);
  }
}

const commentsControllerInstance = new CommentsController();

commentsRoute.get("/:id", commentsControllerInstance.getCommentsById);

commentsRoute.put(
  "/:id",
  authMiddleware,
  createCommentsValidationMiddleware,
  commentsControllerInstance.updateComment
);

commentsRoute.delete(
  "/:id",
  authMiddleware,
  inputValidationMiddleware,
  commentsControllerInstance.deleteComment
);

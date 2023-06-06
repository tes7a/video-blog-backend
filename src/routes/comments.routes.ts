import { Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithParams } from "../types/types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { commentsService } from "../services/comments-service";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { RequestWithParamsAndBody } from "../types/types";
import { createCommentsValidationMiddleware } from "../middleware/validation/comments-validation";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";

export const commentsRoute = Router({});

const { OK, Not_Found, No_Content, Forbidden } = HTTPS_ANSWERS;

commentsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<URIParamsModel>,
    res: Response<CommentsOutputModel>
  ) => {
    const comments = await commentsService.getCommentsById(req.params.id);
    if (!comments) return res.sendStatus(Not_Found);
    return res.status(OK).send(comments);
  }
);

commentsRoute.put(
  "/:id",
  authMiddleware,
  createCommentsValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<URIParamsModel, { content: string }>,
    res: Response<CommentsOutputModel>
  ) => {
    const { content } = req.body;
    const comments = await commentsService.getCommentsById(req.params.id);
    const result = await commentsService.updateComment(req.params.id, content);
    if (req.userId !== comments?.commentatorInfo.userId)
      return res.sendStatus(Forbidden);
    if (result) return res.sendStatus(No_Content);

    return res.sendStatus(Not_Found);
  }
);

commentsRoute.delete(
  "/:id",
  authMiddleware,
  inputValidationMiddleware,
  async (req: RequestWithParams<URIParamsModel>, res: Response) => {
    const comments = await commentsService.getCommentsById(req.params.id);
    const result = await commentsService.deleteComment(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    if (req.userId !== comments?.commentatorInfo.userId)
      return res.sendStatus(Forbidden);
    return res.sendStatus(No_Content);
  }
);

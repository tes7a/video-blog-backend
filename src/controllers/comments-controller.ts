import { Response } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithParams, RequestWithParamsAndBody } from "../types/types";
import { CommentsService } from "../services";
import { CommentsOutputModel, URIParamsModel } from "../models";

const { OK, Not_Found, No_Content, Forbidden } = HTTPS_ANSWERS;

export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  async getCommentsById(
    req: RequestWithParams<URIParamsModel>,
    res: Response<CommentsOutputModel>
  ) {
    const comments = await this.commentsService.getCommentsById(req.params.id);
    if (!comments) return res.sendStatus(Not_Found);
    return res.status(OK).send(comments);
  }

  async updateComment(
    req: RequestWithParamsAndBody<URIParamsModel, { content: string }>,
    res: Response<CommentsOutputModel>
  ) {
    const { content } = req.body;
    const comments = await this.commentsService.getCommentsById(req.params.id);
    const result = await this.commentsService.updateComment(
      req.params.id,
      content
    );
    if (req.userId === comments?.commentatorInfo.userId) {
      if (result) return res.sendStatus(No_Content);
    }
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(Forbidden);
  }

  async deleteComment(req: RequestWithParams<URIParamsModel>, res: Response) {
    const comments = await this.commentsService.getCommentsById(req.params.id);
    const result = await this.commentsService.deleteComment(req.params.id);
    if (req.userId === comments?.commentatorInfo.userId) {
      return res.sendStatus(No_Content);
    }
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(Forbidden);
  }

  async likeStatus(req: RequestWithParams<URIParamsModel>, res: Response) {}
}

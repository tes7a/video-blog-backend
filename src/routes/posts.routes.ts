import { Request, Response, Router } from "express";
import { PostType, posts } from "../db/posts.db";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { postsRepository } from "../repositories/posts-repository";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { validationResult } from "express-validator";
import { PostCreateModel } from "../models/posts/PostCreateModel";
import { createPostsValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostUpdateModel } from "../models/posts/PostUpdateModel";

export const postsRoute = Router({});

const { OK, Not_Found, Unauthorized, No_Content, Created } = HTTPS_ANSWERS;

postsRoute.get("/", (req: Request, res: Response<PostType[]>) => {
  res.status(OK).send(posts);
});

postsRoute.get(
  "/:id",
  (
    req: RequestWithParams<URIParamsModel>,
    res: Response<PostType | PostType[]>
  ) => {
    if (!postsRepository.getBlogById(req.params.id)) res.sendStatus(Not_Found);
    return res.status(OK).send(postsRepository.getBlogById(req.params.id));
  }
);

postsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  (req: RequestWithBody<PostCreateModel>, res: Response<PostType>) => {
    const { title, shortDescription, content, blogId } = req.body;
    return res
      .status(Created)
      .send(
        postsRepository.createPost(title, shortDescription, content, blogId)
      );
  }
);

postsRoute.put(
  "/:id",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  (
    req: RequestWithParamsAndBody<URIParamsModel, PostUpdateModel>,
    res: Response<PostType>
  ) => {
    const { title, shortDescription, content, blogId } = req.body;
    const result = postsRepository.updatePost(
      req.params.id,
      title,
      shortDescription,
      content,
      blogId
    );
    if (result) return res.status(No_Content).send(result);
    return res.sendStatus(Not_Found);
  }
);

postsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  (req: RequestWithParams<URIParamsModel>, res: Response) => {
    if (!validationResult(req).isEmpty()) return res.sendStatus(Unauthorized);
    if (!postsRepository.deleteById(req.params.id))
      return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);

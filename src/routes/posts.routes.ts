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
import { PostCreateModel } from "../models/posts/PostCreateModel";
import { createPostsValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostUpdateModel } from "../models/posts/PostUpdateModel";
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";
import { PostDbModel } from "../models/posts/PostDbModel";

export const postsRoute = Router({});

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

postsRoute.get("/", async (req: Request, res: Response<PostDbModel[]>) => {
  res.status(OK).send(await postsRepository.getAllPosts());
});

postsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<URIParamsModel>,
    res: Response<PostDbModel>
  ) => {
    const post = await postsRepository.getBlogById(req.params.id);
    if (!post) res.sendStatus(Not_Found);
    return res.status(OK).send(post);
  }
);

postsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  async (req: RequestWithBody<PostCreateModel>, res: Response<PostDbModel>) => {
    const { title, shortDescription, content, blogId } = req.body;
    return res
      .status(Created)
      .send(
        await postsRepository.createPost(
          title,
          shortDescription,
          content,
          blogId
        )
      );
  }
);

postsRoute.put(
  "/:id",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<URIParamsModel, PostUpdateModel>,
    res: Response
  ) => {
    const { title, shortDescription, content, blogId } = req.body;
    const result = await postsRepository.updatePost(
      req.params.id,
      title,
      shortDescription,
      content,
      blogId
    );
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Not_Found);
  }
);

postsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  async (req: RequestWithParams<URIParamsModel>, res: Response) => {
    const result = await postsRepository.deleteById(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);

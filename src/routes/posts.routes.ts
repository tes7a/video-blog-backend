import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { PostCreateModel } from "../models/posts/PostCreateModel";
import { createPostsValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostUpdateModel } from "../models/posts/PostUpdateModel";
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";
import { PostDbModel } from "../models/posts/PostDbModel";
import { postsServices } from "../services/posts-service";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { PostRequestModel } from "../models/posts/PostRequestModel";

export const postsRoute = Router({});

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

postsRoute.get(
  "/",
  async (
    req: RequestWithQuery<PostRequestModel>,
    res: Response<WithQueryModel<PostDbModel[]>>
  ) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    return res
      .status(OK)
      .send(
        await postsServices.getAllPosts(
          sortBy?.toString(),
          sortDirection?.toString(),
          pageNumber?.toString(),
          pageSize?.toString()
        )
      );
  }
);

postsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<URIParamsModel>,
    res: Response<PostDbModel>
  ) => {
    const post = await postsServices.getPostById(req.params.id);
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
        await postsServices.createPost(title, shortDescription, content, blogId)
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
    const result = await postsServices.updatePost(
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
    const result = await postsServices.deleteById(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);

import { Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { PostCreateModel } from "../models/posts/PostCreateModel";
import { createPostsValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostUpdateModel } from "../models/posts/PostUpdateModel";
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";
import { postsServices } from "../services/posts-service";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { PostWIthQueryModel } from "../models/posts/PostWIthQueryModel";
import { PostOutputModel } from "../models/posts/PostOutputModel";
import { postQueryRepository } from "../repositories/query-repositories/post-query-repository";
import { createCommentsValidationMiddleware } from "../middleware/validation/comments-validation";
import { commentsService } from "../services/comments-service";
import { userService } from "../services/users-service";
import { CommentsQueryModel } from "../models/comments/CommentsQueryModel";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { postCommentsQueryRepository } from "../repositories/query-repositories/post-comments-query-repository";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";

export const postsRoute = Router({});

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

postsRoute.get(
  "/",
  async (
    req: RequestWithQuery<PostWIthQueryModel>,
    res: Response<WithQueryModel<PostOutputModel[]>>
  ) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    return res.status(OK).send(
      await postQueryRepository.getPosts({
        sortBy: sortBy?.toString(),
        sortDirection: sortDirection?.toString(),
        pageNumber: pageNumber?.toString(),
        pageSize: pageSize?.toString(),
      })
    );
  }
);

postsRoute.get(
  "/:id/comments",
  async (
    req: RequestWithQuery<CommentsQueryModel>,
    res: Response<WithQueryModel<CommentsOutputModel[]>>
  ) => {
    const result = await postCommentsQueryRepository.getComments(req.query);
    if (result) return res.status(OK).send(result);
    return res.sendStatus(Not_Found);
  }
);

postsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<URIParamsModel>,
    res: Response<PostOutputModel>
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
  async (
    req: RequestWithBody<PostCreateModel>,
    res: Response<PostOutputModel>
  ) => {
    const { title, shortDescription, content, blogId } = req.body;
    return res.status(Created).send(
      await postsServices.createPost({
        title,
        shortDescription,
        content,
        blogId,
      })
    );
  }
);

postsRoute.post(
  "/:id/comments",
  authMiddlewareCustomVariant,
  createCommentsValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<URIParamsModel, { content: string }>,
    res: Response
  ) => {
    const { content } = req.body;
    const post = await postsServices.getPostById(req.params.id);
    const user = await userService.findLoggedUser(req.userId);
    if (post && user) {
      const { login, userId } = user;
      return res.status(Created).send(
        await commentsService.createdComment({
          postId: post.id,
          content,
          userId,
          userLogin: login,
        })
      );
    }
    return res.sendStatus(Not_Found);
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
    const result = await postsServices.updatePost(req.params.id, {
      title,
      shortDescription,
      content,
      blogId,
    });
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

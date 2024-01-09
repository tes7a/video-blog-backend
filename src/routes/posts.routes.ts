import { Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
  RequestWIthWithURIQueryParams,
} from "../types/types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { PostCreateModel } from "../models/posts/PostCreateModel";
import { createPostsValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostUpdateModel } from "../models/posts/PostUpdateModel";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { PostWIthQueryModel } from "../models/posts/PostWIthQueryModel";
import { PostOutputModel } from "../models/posts/PostOutputModel";
import { createCommentsValidationMiddleware } from "../middleware/validation/comments-validation";
import { CommentsQueryModel } from "../models/comments/CommentsQueryModel";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { authMiddleware } from "../middleware/validation/auth-validation";
import { CommentsService, PostService, UserService } from "../services";
import { PostCommentsQueryRepository } from "../repositories/query-repositories/post-comments-query-repository";
import { PostQueryRepository } from "../repositories/query-repositories/post-query-repository";

export const postsRoute = Router({});

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

class PostsController {
  postCommentsQueryRepository: PostCommentsQueryRepository;
  postQueryRepository: PostQueryRepository;
  commentsService: CommentsService;
  postsServices: PostService;
  userService: UserService;

  constructor() {
    this.postCommentsQueryRepository = new PostCommentsQueryRepository();
    this.postQueryRepository = new PostQueryRepository();
    this.commentsService = new CommentsService();
    this.postsServices = new PostService();
    this.userService = new UserService();
  }

  async getAllPosts(
    req: RequestWithQuery<PostWIthQueryModel>,
    res: Response<WithQueryModel<PostOutputModel[]>>
  ) {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    return res.status(OK).send(
      await this.postQueryRepository.getPosts({
        sortBy: sortBy?.toString(),
        sortDirection: sortDirection?.toString(),
        pageNumber: pageNumber?.toString(),
        pageSize: pageSize?.toString(),
      })
    );
  }

  async getCommentsPost(
    req: RequestWIthWithURIQueryParams<URIParamsModel, CommentsQueryModel>,
    res: Response<WithQueryModel<CommentsOutputModel[]>>
  ) {
    const post = await this.postsServices.getPostById(req.params.id);
    if (post) {
      const result = await this.postCommentsQueryRepository.getComments(
        req.params.id,
        {
          pageNumber: req.query.pageNumber,
          pageSize: req.query.pageSize,
          sortBy: req.query.sortBy,
          sortDirection: req.query.sortDirection,
        }
      );
      if (result) return res.status(OK).send(result);
    }
    return res.sendStatus(Not_Found);
  }

  async getPostById(
    req: RequestWithParams<URIParamsModel>,
    res: Response<PostOutputModel>
  ) {
    const post = await this.postsServices.getPostById(req.params.id);
    if (!post) res.sendStatus(Not_Found);
    return res.status(OK).send(post);
  }

  async createPost(
    req: RequestWithBody<PostCreateModel>,
    res: Response<PostOutputModel>
  ) {
    const { title, shortDescription, content, blogId } = req.body;
    return res.status(Created).send(
      await this.postsServices.createPost({
        title,
        shortDescription,
        content,
        blogId,
      })
    );
  }

  async createComment(
    req: RequestWithParamsAndBody<URIParamsModel, { content: string }>,
    res: Response
  ) {
    const { content } = req.body;
    const post = await this.postsServices.getPostById(req.params.id);
    const user = await this.userService.findLoggedUser(req.userId);
    if (post && user) {
      const { login, userId } = user;
      return res.status(Created).send(
        await this.commentsService.createdComment({
          postId: post.id,
          content,
          userId,
          userLogin: login,
        })
      );
    }
    return res.sendStatus(Not_Found);
  }

  async updatePost(
    req: RequestWithParamsAndBody<URIParamsModel, PostUpdateModel>,
    res: Response
  ) {
    const { title, shortDescription, content, blogId } = req.body;
    const result = await this.postsServices.updatePost(req.params.id, {
      title,
      shortDescription,
      content,
      blogId,
    });
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Not_Found);
  }

  async deletePost(req: RequestWithParams<URIParamsModel>, res: Response) {
    const result = await this.postsServices.deleteById(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
}

const postsControllerInstance = new PostsController();

postsRoute.get(
  "/",
  postsControllerInstance.getAllPosts.bind(postsControllerInstance)
);

postsRoute.get(
  "/:id/comments",
  postsControllerInstance.getCommentsPost.bind(postsControllerInstance)
);

postsRoute.get(
  "/:id",
  postsControllerInstance.getPostById.bind(postsControllerInstance)
);

postsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  postsControllerInstance.createPost.bind(postsControllerInstance)
);

postsRoute.post(
  "/:id/comments",
  authMiddleware,
  createCommentsValidationMiddleware,
  postsControllerInstance.createComment.bind(postsControllerInstance)
);

postsRoute.put(
  "/:id",
  authMiddlewareCustomVariant,
  createPostsValidationMiddleware,
  postsControllerInstance.updatePost.bind(postsControllerInstance)
);

postsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  postsControllerInstance.deletePost.bind(postsControllerInstance)
);

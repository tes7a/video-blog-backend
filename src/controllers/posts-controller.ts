import { Response } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
  RequestWIthWithURIQueryParams,
} from "../types/types";
import {
  PostCommentsQueryRepository,
  PostQueryRepository,
} from "../repositories";
import {
  CommentsService,
  JwtService,
  PostService,
  UserService,
} from "../services";
import {
  CommentsOutputModel,
  CommentsQueryModel,
  PostCreateModel,
  PostOutputModel,
  PostUpdateModel,
  PostWIthQueryModel,
  URIParamsModel,
  WithQueryModel,
} from "../models";

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

export class PostsController {
  constructor(
    protected postCommentsQueryRepository: PostCommentsQueryRepository,
    protected postQueryRepository: PostQueryRepository,
    protected commentsService: CommentsService,
    protected postsServices: PostService,
    protected userService: UserService,
    protected jwtService: JwtService
  ) {}

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
    const token = req.headers.authorization ?? "";
    if (post) {
      if (token) {
        const user = await this.jwtService.getUserIdByToken(
          token.split(" ")[1]
        );

        const result = await this.postCommentsQueryRepository.getComments(
          req.params.id,
          {
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
          },
          user?.userId
        );
        if (result) return res.status(OK).send(result);

        return res.sendStatus(Not_Found);
      }
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

  async updateLike(
    req: RequestWithParamsAndBody<
      URIParamsModel,
      { likeStatus: "None" | "Like" | "Dislike" }
    >,
    res: Response
  ) {
    const result = await this.postsServices.updateLike(
      req.params.id,
      req.body.likeStatus,
      req.userId
    );
    if (!result) return res.sendStatus(Not_Found);

    return res.sendStatus(No_Content);
  }
}

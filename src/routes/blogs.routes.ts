import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWIthWithURIQueryParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { createBlogValidationMiddleware } from "../middleware/validation/blogs-validation";
import { inputValidationMiddleware } from "../middleware/input-validation.middleware";
import { BlogCreateModel } from "../models/blogs/BlogCreateModel";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { BlogWithQueryModel } from "../models/blogs/BlogWithQueryModel";
import { PostBlogIdCreateModel } from "../models/posts/PostBlogIdCreateModel";
import { PostDbModel } from "../models/posts/PostDbModel";
import { createPostForBlogIdValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostWIthQueryModel } from "../models/posts/PostWIthQueryModel";
import { BlogsQueryRepository } from "../repositories/query-repositories/blogs-query-repository";
import { BlogsOutputMode } from "../models/blogs/BlogsOutputModel";
import { PostOutputModel } from "../models/posts/PostOutputModel";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { BlogsService, PostService } from "../services";
import { PostQueryRepository } from "../repositories/query-repositories/post-query-repository";

export const blogsRoute = Router({});

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

class BlogsController {
  blogsServices: BlogsService;
  blogsQueryRepository: BlogsQueryRepository;
  postQueryRepository: PostQueryRepository;
  postsServices: PostService;

  constructor() {
    this.blogsServices = new BlogsService();
    this.blogsQueryRepository = new BlogsQueryRepository();
    this.postQueryRepository = new PostQueryRepository();
    this.postsServices = new PostService();
  }

  async getAllBlogs(
    req: RequestWithQuery<BlogWithQueryModel>,
    res: Response<WithQueryModel<BlogsOutputMode[]>>
  ) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      req.query;
    return res.status(OK).send(
      await this.blogsQueryRepository.getBlogs({
        searchNameTerm: searchNameTerm?.toString(),
        sortBy: sortBy?.toString(),
        sortDirection: sortDirection?.toString(),
        pageNumber: pageNumber?.toString(),
        pageSize: pageSize?.toString(),
      })
    );
  }

  async getById(
    req: RequestWithParams<URIParamsModel>,
    res: Response<BlogsOutputMode>
  ) {
    const blog = await this.blogsServices.getBlogById(req.params.id);
    if (!blog) return res.sendStatus(Not_Found);
    return res.status(OK).send(blog);
  }

  async getPostsByIdBlog(
    req: RequestWIthWithURIQueryParams<URIParamsModel, PostWIthQueryModel>,
    res: Response<WithQueryModel<PostOutputModel[]>>
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;
    const blog = await this.blogsServices.getBlogById(req.params.id);
    if (blog) {
      return res.status(OK).send(
        await this.postQueryRepository.getPostByBlogID(req.params.id, {
          sortBy: sortBy?.toString(),
          sortDirection: sortDirection?.toString(),
          pageNumber: pageNumber?.toString(),
          pageSize: pageSize?.toString(),
        })
      );
    }
    return res.sendStatus(Not_Found);
  }

  async createBlog(
    req: RequestWithBody<BlogCreateModel>,
    res: Response<BlogsOutputMode>
  ) {
    const { name, description, websiteUrl } = req.body;
    return res
      .status(Created)
      .send(
        await this.blogsServices.createdBlog({ name, description, websiteUrl })
      );
  }

  async createPostForCurrentBlog(
    req: RequestWithParamsAndBody<URIParamsModel, PostBlogIdCreateModel>,
    res: Response<PostDbModel>
  ) {
    const blog = await this.blogsServices.getBlogById(req.params.id);
    if (blog) {
      const post = await this.postsServices.createPostForCurrentBlog(
        req.params.id,
        {
          title: req.body.title,
          shortDescription: req.body.shortDescription,
          content: req.body.content,
        }
      );
      return res.status(Created).send(post);
    }
    return res.sendStatus(Not_Found);
  }

  async updateBlog(
    req: RequestWithParamsAndBody<URIParamsModel, BlogCreateModel>,
    res: Response
  ) {
    const { description, name, websiteUrl } = req.body;
    const result = await this.blogsServices.updateBlog(
      req.params.id,
      description,
      name,
      websiteUrl
    );
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Not_Found);
  }

  async deleteById(req: Request, res: Response) {
    const result = await this.blogsServices.deleteById(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
}
const blogsControllerInstance = new BlogsController();

blogsRoute.get(
  "/",
  blogsControllerInstance.getAllBlogs.bind(blogsControllerInstance)
);

blogsRoute.get(
  "/:id",
  blogsControllerInstance.getById.bind(blogsControllerInstance)
);

blogsRoute.get(
  "/:id/posts",
  blogsControllerInstance.getPostsByIdBlog.bind(blogsControllerInstance)
);

blogsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  blogsControllerInstance.createBlog.bind(blogsControllerInstance)
);

blogsRoute.post(
  "/:id/posts",
  authMiddlewareCustomVariant,
  createPostForBlogIdValidationMiddleware,
  blogsControllerInstance.createPostForCurrentBlog.bind(blogsControllerInstance)
);

blogsRoute.put(
  "/:id",
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  blogsControllerInstance.updateBlog.bind(blogsControllerInstance)
);

blogsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  blogsControllerInstance.deleteById.bind(blogsControllerInstance)
);

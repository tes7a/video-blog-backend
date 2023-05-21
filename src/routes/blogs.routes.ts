import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWIthWithURIQueryParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { createBlogValidationMiddleware } from "../middleware/validation/blogs-validation";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";
import { BlogPostModel } from "../models/blogs-models/BlogPostModel";
import { BlogResponseModel } from "../models/blogs-models/BlogResponseModel";
import { blogsServices } from "../services/blogs-service";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { BlogDbModel } from "../models/blogs-models/BlogDbModel";
import { BlogRequestModel } from "../models/blogs-models/BlogRequestModel";
import { PostBlogIdCreateModel } from "../models/posts/PostBlogIdCreateModel";
import { PostDbModel } from "../models/posts/PostDbModel";
import { postsServices } from "../services/posts-service";
import { createPostForBlogIdValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostRequestModel } from "../models/posts/PostRequestModel";

export const blogsRoute = Router({});
const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

blogsRoute.get(
  "/",
  async (
    req: RequestWithQuery<BlogRequestModel>,
    res: Response<WithQueryModel<BlogDbModel[]>>
  ) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      req.query;
    return res
      .status(OK)
      .send(
        await blogsServices.getAllBlogs(
          searchNameTerm?.toString(),
          sortBy?.toString(),
          sortDirection?.toString(),
          pageNumber?.toString(),
          pageSize?.toString()
        )
      );
  }
);

blogsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<URIParamsModel>,
    res: Response<BlogResponseModel>
  ) => {
    const blog = await blogsServices.getBlogById(req.params.id);
    if (!blog) return res.sendStatus(Not_Found);
    return res.status(OK).send(blog);
  }
);
blogsRoute.get(
  "/:id/posts",
  async (
    req: RequestWIthWithURIQueryParams<URIParamsModel, PostRequestModel>,
    res: Response<WithQueryModel<PostDbModel[]>>
  ) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;
    const blog = await blogsServices.getBlogById(req.params.id);
    if (blog) {
      const posts = await postsServices.getPostByBlogID(
        req.params.id,
        pageNumber?.toString(),
        pageSize?.toString(),
        sortBy?.toString(),
        sortDirection?.toString()
      );
      return res.status(OK).send(posts);
    }
    return res.sendStatus(Not_Found);
  }
);

blogsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  async (
    req: RequestWithBody<BlogPostModel>,
    res: Response<BlogResponseModel>
  ) => {
    return res
      .status(Created)
      .send(
        await blogsServices.createdBlog(
          req.body.name,
          req.body.description,
          req.body.websiteUrl
        )
      );
  }
);
blogsRoute.post(
  "/:id/posts",
  authMiddlewareCustomVariant,
  createPostForBlogIdValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<URIParamsModel, PostBlogIdCreateModel>,
    res: Response<PostDbModel>
  ) => {
    const blog = await blogsServices.getBlogById(req.params.id);
    if (blog) {
      const post = await postsServices.createPostForCurrentBlog(
        req.params.id,
        req.body.title,
        req.body.shortDescription,
        req.body.content
      );
      return res.status(Created).send(post);
    }
    return res.sendStatus(Not_Found);
  }
);

blogsRoute.put(
  "/:id",
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<URIParamsModel, BlogPostModel>,
    res: Response
  ) => {
    const { description, name, websiteUrl } = req.body;
    const result = await blogsServices.updateBlog(
      req.params.id,
      description,
      name,
      websiteUrl
    );
    if (result) return res.sendStatus(No_Content);
    return res.sendStatus(Not_Found);
  }
);

blogsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await blogsServices.deleteById(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);

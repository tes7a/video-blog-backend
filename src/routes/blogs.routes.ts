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
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";
import { BlogCreateModel } from "../models/blogs-models/BlogCreateModel";
import { blogsServices } from "../services/blogs-service";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { BlogWithQueryModel } from "../models/blogs-models/BlogWithQueryModel";
import { PostBlogIdCreateModel } from "../models/posts/PostBlogIdCreateModel";
import { PostDbModel } from "../models/posts/PostDbModel";
import { postsServices } from "../services/posts-service";
import { createPostForBlogIdValidationMiddleware } from "../middleware/validation/posts-validation";
import { PostWIthQueryModel } from "../models/posts/PostWIthQueryModel";
import { blogsQueryRepository } from "../repositories/query-repositories/blogs-query-repository";
import { BlogsOutputMode } from "../models/blogs-models/BlogsOutputModel";
import { PostOutputModel } from "../models/posts/PostOutputModel";
import { postQueryRepository } from "../repositories/query-repositories/post-query-repository";
import { authMiddleware } from "../middleware/validation/auth-validation";

export const blogsRoute = Router({});
const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

blogsRoute.get(
  "/",
  async (
    req: RequestWithQuery<BlogWithQueryModel>,
    res: Response<WithQueryModel<BlogsOutputMode[]>>
  ) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      req.query;
    return res.status(OK).send(
      await blogsQueryRepository.getBlogs({
        searchNameTerm: searchNameTerm?.toString(),
        sortBy: sortBy?.toString(),
        sortDirection: sortDirection?.toString(),
        pageNumber: pageNumber?.toString(),
        pageSize: pageSize?.toString(),
      })
    );
  }
);

blogsRoute.get(
  "/:id",
  async (
    req: RequestWithParams<URIParamsModel>,
    res: Response<BlogsOutputMode>
  ) => {
    const blog = await blogsServices.getBlogById(req.params.id);
    if (!blog) return res.sendStatus(Not_Found);
    return res.status(OK).send(blog);
  }
);
blogsRoute.get(
  "/:id/posts",
  async (
    req: RequestWIthWithURIQueryParams<URIParamsModel, PostWIthQueryModel>,
    res: Response<WithQueryModel<PostOutputModel[]>>
  ) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = req.query;
    const blog = await blogsServices.getBlogById(req.params.id);
    if (blog) {
      return res.status(OK).send(
        await postQueryRepository.getPostByBlogID(req.params.id, {
          sortBy: sortBy?.toString(),
          sortDirection: sortDirection?.toString(),
          pageNumber: pageNumber?.toString(),
          pageSize: pageSize?.toString(),
        })
      );
    }
    return res.sendStatus(Not_Found);
  }
);

blogsRoute.post(
  "/",
  authMiddleware,
  createBlogValidationMiddleware,
  async (
    req: RequestWithBody<BlogCreateModel>,
    res: Response<BlogsOutputMode>
  ) => {
    const { name, description, websiteUrl } = req.body;
    return res
      .status(Created)
      .send(await blogsServices.createdBlog({ name, description, websiteUrl }));
  }
);
blogsRoute.post(
  "/:id/posts",
  authMiddleware,
  createPostForBlogIdValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<URIParamsModel, PostBlogIdCreateModel>,
    res: Response<PostDbModel>
  ) => {
    const blog = await blogsServices.getBlogById(req.params.id);
    if (blog) {
      const post = await postsServices.createPostForCurrentBlog(req.params.id, {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
      });
      return res.status(Created).send(post);
    }
    return res.sendStatus(Not_Found);
  }
);

blogsRoute.put(
  "/:id",
  authMiddleware,
  createBlogValidationMiddleware,
  async (
    req: RequestWithParamsAndBody<URIParamsModel, BlogCreateModel>,
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
  authMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await blogsServices.deleteById(req.params.id);
    if (!result) return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);

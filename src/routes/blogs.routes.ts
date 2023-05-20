import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { createBlogValidationMiddleware } from "../middleware/validation/blogs-validation";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { inputValidationMiddleware } from "../middleware/validation/input-validation.middleware";
import { BlogPostModel } from "../models/blogs-models/BlogPostModel";
import { BlogResponseModel } from "../models/blogs-models/BlogResponseModel";
import { blogsServices } from "../services/blogs-service";

export const blogsRoute = Router({});
const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

blogsRoute.get(
  "/",
  async (req: Request, res: Response<BlogResponseModel[]>) => {
    return res.status(OK).send(await blogsServices.getAllBlogs());
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

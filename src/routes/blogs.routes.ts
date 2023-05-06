import { Request, Response, Router } from "express";
import { BlogType, blogs } from "../db/blogs.db";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { blogsRepository } from "../repositories/blogs-repository";
import { validationResult } from "express-validator";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../types";
import { URIParamsModel } from "../models/universal/URIParamsModel";
import { createBlogValidationMiddleware } from "../middleware/validation/blogs-validation";
import { authMiddlewareCustomVariant } from "../middleware/auth/basic-auth.middleware";
import { BlogPostModel } from "../models/blogs-models/BlogPostModel";

export const blogsRoute = Router({});
const { OK, Not_Found, No_Content, Unauthorized, Created, Bad_Request } =
  HTTPS_ANSWERS;

blogsRoute.get("/", (req: Request, res: Response<BlogType[]>) => {
  return res.status(OK).send(blogs);
});

blogsRoute.get(
  "/:id",
  (
    req: RequestWithParams<URIParamsModel>,
    res: Response<BlogType[] | BlogType | undefined>
  ) => {
    if (!blogsRepository.getBlogById(req.params.id))
      return res.sendStatus(Not_Found);
    return res.status(OK).send(blogsRepository.getBlogById(req.params.id));
  }
);
blogsRoute.post(
  "/",
  authMiddlewareCustomVariant,
  createBlogValidationMiddleware,
  (req: RequestWithBody<BlogPostModel>, res: Response) => {
    return res
      .status(Created)
      .send(
        blogsRepository.createdBlog(
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
  (
    req: RequestWithParamsAndBody<URIParamsModel, BlogPostModel>,
    res: Response
  ) => {
    const { description, name, websiteUrl } = req.body;
    const result = blogsRepository.updateBlog(
      req.params.id,
      description,
      name,
      websiteUrl
    );
    if (result) return res.status(No_Content).send(result);
    return res.sendStatus(Not_Found);
  }
);

blogsRoute.delete(
  "/:id",
  authMiddlewareCustomVariant,
  (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) return res.sendStatus(Unauthorized);
    if (!blogsRepository.deleteById(req.params.id))
      return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);

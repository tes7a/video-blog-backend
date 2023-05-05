import { Request, Response, Router } from "express";
import { BlogType, blogs } from "../db/blogs.db";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { blogsRepository } from "../repositories/blogs-repository";
import { header, validationResult, body } from "express-validator";
import { RequestWithParams } from "../types";
import { URIParamsModel } from "../models/universal/URIParamsModel";

export const blogsRoute = Router({});
const { OK, Not_Found, No_Content, Unauthorized, Created } = HTTPS_ANSWERS;

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
  header("authorization").equals("Basic YWRtaW46cXdlcnR5"),
  //   body(["name", "description", "websiteUrl"]).isString(),
  (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) return res.sendStatus(Unauthorized);
    res
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

blogsRoute.delete(
  "/:id",
  header("authorization").equals("Basic YWRtaW46cXdlcnR5"),
  (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) return res.sendStatus(Unauthorized);
    if (!blogsRepository.deleteById(req.params.id))
      return res.sendStatus(Not_Found);
    return res.sendStatus(No_Content);
  }
);

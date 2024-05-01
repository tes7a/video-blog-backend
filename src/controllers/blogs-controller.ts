import { Request, Response } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import {
  RequestWIthWithURIQueryParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/types";
import { BlogsService, JwtService, PostService } from "../services";
import { BlogsQueryRepository, PostQueryRepository } from "../repositories";
import {
  BlogCreateModel,
  BlogWithQueryModel,
  BlogsOutputMode,
  PostBlogIdCreateModel,
  PostDbModel,
  PostOutputModel,
  PostWIthQueryModel,
  URIParamsModel,
  WithQueryModel,
} from "../models";

const { OK, Not_Found, No_Content, Created } = HTTPS_ANSWERS;

export class BlogsController {
  constructor(
    protected blogsServices: BlogsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postQueryRepository: PostQueryRepository,
    protected postsServices: PostService,
    protected jwtService: JwtService
  ) {}

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
    const token = req.headers.authorization ?? "";
    if (blog) {
      if (token) {
        const result = await this.jwtService.getUserIdByToken(
          token.split(" ")[1]
        );

        return res.status(OK).send(
          await this.postQueryRepository.getPostByBlogID(
            req.params.id,
            {
              sortBy: sortBy?.toString(),
              sortDirection: sortDirection?.toString(),
              pageNumber: pageNumber?.toString(),
              pageSize: pageSize?.toString(),
            },
            result?.userId
          )
        );
      } else {
        return res.status(OK).send(
          await this.postQueryRepository.getPostByBlogID(req.params.id, {
            sortBy: sortBy?.toString(),
            sortDirection: sortDirection?.toString(),
            pageNumber: pageNumber?.toString(),
            pageSize: pageSize?.toString(),
          })
        );
      }
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

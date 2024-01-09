import { BlogCreateModel } from "../models/blogs/BlogCreateModel";
import { BlogsOutputMode } from "../models/blogs/BlogsOutputModel";
import { BlogsRepository } from "../repositories/blogs-repository";

export class BlogsService {
  blogsRepository: BlogsRepository;

  constructor() {
    this.blogsRepository = new BlogsRepository();
  }

  async getBlogById(id: string): Promise<BlogsOutputMode | undefined> {
    return await this.blogsRepository.getBlogById(id);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteById(id);
  }

  async createdBlog(payload: BlogCreateModel): Promise<BlogsOutputMode> {
    const newBlog = {
      id: new Date().getMilliseconds().toString(),
      name: payload.name!,
      description: payload.description!,
      websiteUrl: payload.websiteUrl!,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await this.blogsRepository.createdBlog(newBlog);
  }

  async updateBlog(
    id: string,
    description: string,
    name: string,
    websiteUrl: string
  ): Promise<boolean> {
    return await this.blogsRepository.updateBlog(
      id,
      description,
      name,
      websiteUrl
    );
  }
}

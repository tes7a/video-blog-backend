import { BlogCreateModel, BlogsOutputMode } from "../models";
import { BlogsRepository } from "../repositories";

export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

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

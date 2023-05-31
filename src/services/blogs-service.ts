import { BlogCreateModel } from "../models/blogs-models/BlogCreateModel";
import { BlogsOutputMode } from "../models/blogs-models/BlogsOutputModel";
import { blogsRepository } from "../repositories/blogs-repository";

export const blogsServices = {
  async getBlogById(id: string): Promise<BlogsOutputMode | undefined> {
    return await blogsRepository.getBlogById(id);
  },
  async deleteById(id: string): Promise<boolean> {
    return await blogsRepository.deleteById(id);
  },
  async createdBlog(payload: BlogCreateModel): Promise<BlogsOutputMode> {
    const newBlog = {
      id: new Date().getMilliseconds().toString(),
      name: payload.name!,
      description: payload.description!,
      websiteUrl: payload.websiteUrl!,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.createdBlog(newBlog);
  },
  async updateBlog(
    id: string,
    description: string,
    name: string,
    websiteUrl: string
  ): Promise<boolean> {
    return await blogsRepository.updateBlog(id, description, name, websiteUrl);
  },
};

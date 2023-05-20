import { blogsDb } from "../db/db";
import { BlogDbModel } from "../models/blogs-models/BlogDbModel";
import { blogsRepository } from "../repositories/blogs-repository";

type argumentType = string | undefined;
type queryParams = string | null;

export const blogsServices = {
  async getAllBlogs(): Promise<BlogDbModel[]> {
    return await blogsRepository.getAllBlogs();
  },
  async getBlogById(id: argumentType): Promise<BlogDbModel | undefined> {
    return await blogsRepository.getBlogById(id);
  },
  async deleteById(id: argumentType): Promise<boolean> {
    return await blogsRepository.deleteById(id);
  },
  async createdBlog(
    name: argumentType,
    description: argumentType,
    websiteUrl: argumentType
  ): Promise<BlogDbModel> {
    const newBlog = {
      id: new Date().getMilliseconds().toString(),
      name: name!,
      description: description!,
      websiteUrl: websiteUrl!,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.createdBlog(newBlog);
  },
  async updateBlog(
    id: argumentType,
    description: argumentType,
    name: argumentType,
    websiteUrl: argumentType
  ): Promise<boolean> {
    return await blogsRepository.updateBlog(id, description, name, websiteUrl);
  },
};

import { blogsDb } from "../db/db";
import { BlogDbModel } from "../models/blogs-models/BlogDbModel";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { blogsRepository } from "../repositories/blogs-repository";

type ArgumentType = string | undefined;

export const blogsServices = {
  async getAllBlogs(
    searchNameTerm: ArgumentType,
    sortBy: ArgumentType,
    sortDirection: ArgumentType,
    pageNumber: ArgumentType,
    pageSize: ArgumentType
  ): Promise<WithQueryModel<BlogDbModel[]>> {
    return await blogsRepository.getAllBlogs(
      searchNameTerm!,
      sortBy!,
      sortDirection!,
      pageNumber!,
      pageSize!
    );
  },
  async getBlogById(id: ArgumentType): Promise<BlogDbModel | undefined> {
    return await blogsRepository.getBlogById(id);
  },
  async deleteById(id: ArgumentType): Promise<boolean> {
    return await blogsRepository.deleteById(id);
  },
  async createdBlog(
    name: ArgumentType,
    description: ArgumentType,
    websiteUrl: ArgumentType
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
    id: ArgumentType,
    description: ArgumentType,
    name: ArgumentType,
    websiteUrl: ArgumentType
  ): Promise<boolean> {
    return await blogsRepository.updateBlog(id, description, name, websiteUrl);
  },
};

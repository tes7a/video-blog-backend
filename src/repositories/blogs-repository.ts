import { blogsDb } from "../db/db";
import { BlogDbModel } from "../models/blogs-models/BlogDbModel";

type argumentType = string | undefined;

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogDbModel[]> {
    return await blogsDb.find({}).toArray();
  },
  async getBlogById(id: argumentType): Promise<BlogDbModel> {
    const res = (await blogsDb.find({ id: { $regex: id } }).toArray())[0];
    return {
      id: res.id,
      name: res.name,
      createdAt: res.createdAt,
      description: res.description,
      isMembership: res.isMembership,
      websiteUrl: res.websiteUrl,
    };
  },
  async deleteById(id: argumentType): Promise<boolean> {
    const { deletedCount } = await blogsDb.deleteOne({ id: id });

    return deletedCount === 1;
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
    await blogsDb.insertOne(newBlog);
    return {
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    };
  },
  async updateBlog(
    id: argumentType,
    description: argumentType,
    name: argumentType,
    websiteUrl: argumentType
  ): Promise<boolean> {
    const { matchedCount } = await blogsDb.updateOne(
      { id: id },
      { $set: { description, name, websiteUrl } }
    );

    return matchedCount === 1;
  },
};

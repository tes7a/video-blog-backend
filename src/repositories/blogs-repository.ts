import { blogsDb } from "../db/db";
import { BlogDbModel } from "../models/blogs-models/BlogDbModel";
import { BlogsOutputMode } from "../models/blogs-models/BlogsOutputModel";

export const blogsRepository = {
  async getBlogById(id: string): Promise<BlogsOutputMode | undefined> {
    const res = (await blogsDb.find({ id: { $regex: id } }).toArray())[0];
    if (!res) return undefined;
    return {
      id: res.id,
      name: res.name,
      createdAt: res.createdAt,
      description: res.description,
      isMembership: res.isMembership,
      websiteUrl: res.websiteUrl,
    };
  },
  async deleteById(id: string): Promise<boolean> {
    const { deletedCount } = await blogsDb.deleteOne({ id: id });

    return deletedCount === 1;
  },
  async createdBlog(newBlog: BlogDbModel): Promise<BlogsOutputMode> {
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
    id: string,
    description: string,
    name: string,
    websiteUrl: string
  ): Promise<boolean> {
    const { matchedCount } = await blogsDb.updateOne(
      { id: id },
      { $set: { description, name, websiteUrl } }
    );

    return matchedCount === 1;
  },
};

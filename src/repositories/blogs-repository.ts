import { BlogModelClass } from "../db/db";
import { BlogDbModel } from "../models/blogs/BlogDbModel";
import { BlogsOutputMode } from "../models/blogs/BlogsOutputModel";
export class BlogsRepository {
  async getBlogById(id: string): Promise<BlogsOutputMode | undefined> {
    const res = (await BlogModelClass.find({ id: { $regex: id } }).lean())[0];
    if (!res) return undefined;
    return {
      id: res.id,
      name: res.name,
      createdAt: res.createdAt,
      description: res.description,
      isMembership: res.isMembership,
      websiteUrl: res.websiteUrl,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const { deletedCount } = await BlogModelClass.deleteOne({ id: id });

    return deletedCount === 1;
  }

  async createdBlog(newBlog: BlogDbModel): Promise<BlogsOutputMode> {
    const blog = new BlogModelClass({
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    });

    await blog.save();

    return newBlog;
  }

  async updateBlog(
    id: string,
    description: string,
    name: string,
    websiteUrl: string
  ): Promise<boolean> {
    const blog = await BlogModelClass.findOne({ id });
    if (!blog) return false;

    blog.description = description;
    blog.name = name;
    blog.websiteUrl = websiteUrl;

    await blog.save();

    return true;
  }
}

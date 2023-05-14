import { postsDb } from "../db/db";
import { PostDbModel } from "../models/posts/PostDbModel";

type argumentType = string | undefined;

export const postsRepository = {
  async getAllPosts(): Promise<PostDbModel[]> {
    return await postsDb.find({}).toArray();
  },
  async getBlogById(id: argumentType): Promise<PostDbModel> {
    const res = (await postsDb.find({ id: { $regex: id } }).toArray())[0];
    return {
      blogId: res.blogId,
      blogName: res.blogName,
      content: res.content,
      createdAt: res.createdAt,
      id: res.id,
      shortDescription: res.shortDescription,
      title: res.title,
    };
  },

  async deleteById(id: argumentType): Promise<boolean> {
    const { deletedCount } = await postsDb.deleteOne({ id: id });
    return deletedCount === 1;
  },

  async createPost(
    title: argumentType,
    shortDescription: argumentType,
    content: argumentType,
    blogId: argumentType
  ): Promise<PostDbModel> {
    const newPost = {
      id: new Date().getMilliseconds().toString(),
      title: title!,
      shortDescription: shortDescription!,
      content: content!,
      blogId: blogId!,
      blogName: `Blog Name #`,
      createdAt: new Date().toISOString(),
    };
    await postsDb.insertOne(newPost);
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    };
  },

  async updatePost(
    id: argumentType,
    title: argumentType,
    shortDescription: argumentType,
    content: argumentType,
    blogId: argumentType
  ): Promise<boolean> {
    const { matchedCount } = await postsDb.updateOne(
      { id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return matchedCount === 1;
  },
};

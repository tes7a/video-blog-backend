import { postsDb } from "../db/db";
import { posts } from "../db/posts.db";
import { PostType } from "../db/posts.db";
import { PostDbModel } from "../models/posts/PostDbModel";

type argumentType = string | undefined;

export const postsRepository = {
  async getAllPosts(): Promise<PostDbModel[]> {
    return await postsDb.find({}).toArray();
  },
  async getBlogById(id: argumentType): Promise<PostDbModel> {
    return (await postsDb.find({ id: { $regex: id } }).toArray())[0];
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

    return newPost;
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

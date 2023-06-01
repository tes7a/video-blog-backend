import { postsDb } from "../db/db";
import { PostDbModel } from "../models/posts/PostDbModel";
import { PostOutputModel } from "../models/posts/PostOutputModel";
import { PostUpdateModel } from "../models/posts/PostUpdateModel";

export const postsRepository = {
  async getPostById(id: string): Promise<PostDbModel | undefined> {
    const res = (await postsDb.find({ id: { $regex: id } }).toArray())[0];
    if (!res) return undefined;
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

  async deleteById(id: string): Promise<boolean> {
    const { deletedCount } = await postsDb.deleteOne({ id: id });
    return deletedCount === 1;
  },

  async createPost(newPost: PostDbModel): Promise<PostOutputModel> {
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

  async updatePost(id: string, payload: PostUpdateModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = payload;
    const { matchedCount } = await postsDb.updateOne(
      { id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return matchedCount === 1;
  },
};

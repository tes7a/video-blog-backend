import { log } from "console";
import { postsDb } from "../db/db";
import { PostDbModel } from "../models/posts/PostDbModel";
import { postsRepository } from "../repositories/posts-repository";

type argumentType = string | undefined;

export const postsServices = {
  async getAllPosts(): Promise<PostDbModel[]> {
    return await postsRepository.getAllPosts();
  },
  async getBlogById(id: argumentType): Promise<PostDbModel | undefined> {
    return await postsRepository.getBlogById(id);
  },

  async deleteById(id: argumentType): Promise<boolean> {
    return await postsRepository.deleteById(id);
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
    return postsRepository.createPost(newPost);
  },

  async updatePost(
    id: argumentType,
    title: argumentType,
    shortDescription: argumentType,
    content: argumentType,
    blogId: argumentType
  ): Promise<boolean> {
    return await postsRepository.updatePost(
      id,
      title,
      shortDescription,
      content,
      blogId
    );
  },
};

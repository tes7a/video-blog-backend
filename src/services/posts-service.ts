import { log } from "console";
import { postsDb } from "../db/db";
import { PostDbModel } from "../models/posts/PostDbModel";
import { postsRepository } from "../repositories/posts-repository";
import { WithQueryModel } from "../models/universal/WithQueryModel";

type ArgumentType = string | undefined;

export const postsServices = {
  async getAllPosts(
    sortBy?: ArgumentType,
    sortDirection?: ArgumentType,
    pageNumber?: ArgumentType,
    pageSize?: ArgumentType
  ): Promise<WithQueryModel<PostDbModel[]>> {
    return await postsRepository.getAllPosts(
      sortBy!,
      sortDirection!,
      pageNumber!,
      pageSize!
    );
  },
  async getPostById(id: ArgumentType): Promise<PostDbModel | undefined> {
    return await postsRepository.getPostById(id);
  },

  async getPostByBlogID(
    blogId: ArgumentType,
    pageNumber: ArgumentType,
    pageSize: ArgumentType,
    sortBy: ArgumentType,
    sortDirection: ArgumentType
  ): Promise<WithQueryModel<PostDbModel[]>> {
    return await postsRepository.getPostByBlogID(
      blogId,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    );
  },

  async deleteById(id: ArgumentType): Promise<boolean> {
    return await postsRepository.deleteById(id);
  },

  async createPost(
    title: ArgumentType,
    shortDescription: ArgumentType,
    content: ArgumentType,
    blogId: ArgumentType
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

  async createPostForCurrentBlog(
    blogId: ArgumentType,
    title: ArgumentType,
    shortDescription: ArgumentType,
    content: ArgumentType
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
    id: ArgumentType,
    title: ArgumentType,
    shortDescription: ArgumentType,
    content: ArgumentType,
    blogId: ArgumentType
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

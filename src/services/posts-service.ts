import { PostBlogIdCreateModel } from "../models/posts/PostBlogIdCreateModel";
import { PostCreateModel } from "../models/posts/PostCreateModel";
import { PostDbModel } from "../models/posts/PostDbModel";
import { PostOutputModel } from "../models/posts/PostOutputModel";
import { PostUpdateModel } from "../models/posts/PostUpdateModel";
import { postsRepository } from "../repositories/posts-repository";

export const postsServices = {
  async getPostById(id: string): Promise<PostDbModel | undefined> {
    return await postsRepository.getPostById(id);
  },

  async deleteById(id: string): Promise<boolean> {
    return await postsRepository.deleteById(id);
  },

  async createPost(payload: PostCreateModel): Promise<PostOutputModel> {
    const newPost = {
      id: new Date().getMilliseconds().toString(),
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
      blogName: `Blog Name #`,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.createPost(newPost);
  },

  async createPostForCurrentBlog(
    blogId: string,
    payload: PostBlogIdCreateModel
  ): Promise<PostOutputModel> {
    const newPost = {
      id: new Date().getMilliseconds().toString(),
      title: payload.title,
      shortDescription: payload.shortDescription!,
      content: payload.content,
      blogId: blogId,
      blogName: `Blog Name #`,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.createPost(newPost);
  },
  async updatePost(id: string, payload: PostUpdateModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = payload;
    return await postsRepository.updatePost(id, {
      title,
      shortDescription,
      content,
      blogId,
    });
  },
};

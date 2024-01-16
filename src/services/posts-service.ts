import {
  PostBlogIdCreateModel,
  PostCreateModel,
  PostDbModel,
  PostOutputModel,
  PostUpdateModel,
} from "../models";
import { PostsRepository } from "../repositories";

export class PostService {
  constructor(protected postsRepository: PostsRepository) {}
  async getPostById(id: string): Promise<PostDbModel | undefined> {
    return await this.postsRepository.getPostById(id);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.postsRepository.deleteById(id);
  }

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
    return this.postsRepository.createPost(newPost);
  }

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
    return this.postsRepository.createPost(newPost);
  }

  async updatePost(id: string, payload: PostUpdateModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = payload;
    return await this.postsRepository.updatePost(id, {
      title,
      shortDescription,
      content,
      blogId,
    });
  }
}

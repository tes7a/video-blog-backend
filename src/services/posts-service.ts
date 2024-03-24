import {
  PostBlogIdCreateModel,
  PostCreateModel,
  PostDbModel,
  PostOutputModel,
  PostUpdateModel,
} from "../models";
import { PostsRepository } from "../repositories";
import { UserService } from "./users-service";

export class PostService {
  constructor(
    protected postsRepository: PostsRepository,
    protected userService: UserService
  ) {}

  async getPostById(
    id: string,
    userId?: string
  ): Promise<PostDbModel | undefined> {
    return await this.postsRepository.getPostById(id, userId);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.postsRepository.deleteById(id);
  }

  async createPost(payload: PostCreateModel): Promise<PostOutputModel> {
    const newPost: PostDbModel = {
      id: new Date().getMilliseconds().toString(),
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
      blogName: `Blog Name #`,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    };
    return this.postsRepository.createPost(newPost);
  }

  async createPostForCurrentBlog(
    blogId: string,
    payload: PostBlogIdCreateModel
  ): Promise<PostDbModel> {
    const newPost: PostDbModel = {
      id: new Date().getMilliseconds().toString(),
      title: payload.title,
      shortDescription: payload.shortDescription!,
      content: payload.content,
      blogId: blogId,
      blogName: `Blog Name #`,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None",
      },
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

  async updateLike(
    id: string,
    likeStatus: "None" | "Like" | "Dislike",
    userId: string
  ): Promise<boolean> {
    const post = await this.getPostById(id);
    if (!post) return false;

    const user = await this.userService.findUserById(userId);

    await this.postsRepository.updateLike(
      id,
      likeStatus,
      userId,
      user!.accountData.login
    );

    return true;
  }
}

import { CommentCreateModel } from "../models/comments/CommentCreateModel";
import { CommentsDbModel } from "../models/comments/CommentsDbModel";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { CommentsRepository } from "../repositories/comments-repository";
import { JwtService } from "./jwt-service";

export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected jwtService: JwtService
  ) {}

  async getCommentsById(
    id: string,
    token?: boolean
  ): Promise<CommentsOutputModel | undefined> {
    return await this.commentsRepository.getCommentsById(id, token);
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    return await this.commentsRepository.updateComment(id, content);
  }

  async deleteComment(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteComment(id);
  }

  async createdComment(
    payload: CommentCreateModel
  ): Promise<CommentsOutputModel> {
    const { postId, content, userId, userLogin } = payload;
    const newComment: CommentsDbModel = {
      id: new Date().getMilliseconds().toString(),
      content,
      postId: postId,
      commentatorInfo: {
        userId,
        userLogin,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    };

    return this.commentsRepository.createComment(newComment);
  }

  async updateLike(
    id: string,
    likeStatus: "None" | "Like" | "Dislike",
    userId: string
  ): Promise<boolean> {
    return await this.commentsRepository.updateLike(id, likeStatus, userId);
  }
}

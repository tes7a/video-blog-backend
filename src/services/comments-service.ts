import { CommentCreateModel } from "../models/comments/CommentCreateModel";
import { CommentsDbModel } from "../models/comments/CommentsDbModel";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { CommentsRepository } from "../repositories/comments-repository";

export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}

  async getCommentsById(id: string): Promise<CommentsOutputModel | undefined> {
    return await this.commentsRepository.getCommentsById(id);
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
        myStatus: null,
      },
    };

    return this.commentsRepository.createComment(newComment);
  }
}

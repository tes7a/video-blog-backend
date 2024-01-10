import { CommentCreateModel } from "../models/comments/CommentCreateModel";
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
    const newComment = {
      id: new Date().getMilliseconds().toString(),
      content,
      postId: postId,
      commentatorInfo: {
        userId,
        userLogin,
      },
      createdAt: new Date().toISOString(),
    };

    return this.commentsRepository.createComment(newComment);
  }
}

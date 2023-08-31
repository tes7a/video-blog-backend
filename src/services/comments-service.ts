import { CommentCreateModel } from "../models/comments/CommentCreateModel";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { commentsRepository } from "../repositories/comments-repository";

class CommentsService {
  async getCommentsById(id: string): Promise<CommentsOutputModel | undefined> {
    return await commentsRepository.getCommentsById(id);
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    return await commentsRepository.updateComment(id, content);
  }

  async deleteComment(id: string): Promise<boolean> {
    return await commentsRepository.deleteComment(id);
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

    return commentsRepository.createComment(newComment);
  }
}

export const commentsService = new CommentsService();

//   async getCommentsById(id: string): Promise<CommentsOutputModel | undefined> {
//     return await commentsRepository.getCommentsById(id);
//   },
//   async updateComment(id: string, content: string): Promise<boolean> {
//     return await commentsRepository.updateComment(id, content);
//   },
//   async deleteComment(id: string): Promise<boolean> {
//     return await commentsRepository.deleteComment(id);
//   },
//   async createdComment(
//     payload: CommentCreateModel
//   ): Promise<CommentsOutputModel> {
//     const { postId, content, userId, userLogin } = payload;
//     const newComment = {
//       id: new Date().getMilliseconds().toString(),
//       content,
//       postId: postId,
//       commentatorInfo: {
//         userId,
//         userLogin,
//       },
//       createdAt: new Date().toISOString(),
//     };

//     return commentsRepository.createComment(newComment);
//   },
// };

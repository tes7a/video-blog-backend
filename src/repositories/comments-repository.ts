import { CommentModelClass } from "../db/db";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { CommentsDbModel } from "../models/comments/CommentsDbModel";

export const commentsRepository = {
  async getCommentsById(
    idComment: string
  ): Promise<CommentsOutputModel | undefined> {
    const res = (
      await CommentModelClass.find({ id: { $regex: idComment } }).lean()
    )[0];
    if (!res) return undefined;
    const {
      id,
      content,
      createdAt,
      commentatorInfo: { userId, userLogin },
    } = res;
    return {
      id,
      content,
      commentatorInfo: {
        userId,
        userLogin,
      },
      createdAt,
    };
  },
  async createComment(
    newComment: CommentsDbModel
  ): Promise<CommentsOutputModel> {
    const comment = new CommentModelClass({
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
    });
    await comment.save();
    return newComment;
  },
  async updateComment(id: string, content: string): Promise<boolean> {
    const comment = await CommentModelClass.findOne({ id });
    if (!comment) return false;

    comment.content = content;

    await comment.save();
    return true;
  },
  async deleteComment(id: string): Promise<boolean> {
    const { deletedCount } = await CommentModelClass.deleteOne({ id: id });

    return deletedCount === 1;
  },
};

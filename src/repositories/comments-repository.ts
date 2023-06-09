import { commentsDb } from "../db/db";
import { CommentsOutputModel } from "../models/comments/CommentsOutputModel";
import { CommentsDbModel } from "../models/comments/CommetnsDbModel";

export const commentsRepository = {
  async getCommentsById(
    idComment: string
  ): Promise<CommentsOutputModel | undefined> {
    const res = (
      await commentsDb.find({ id: { $regex: idComment } }).toArray()
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
    await commentsDb.insertOne(newComment);
    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
    };
  },
  async updateComment(id: string, content: string): Promise<boolean> {
    const { matchedCount } = await commentsDb.updateOne(
      { id: id },
      { $set: { content } }
    );
    return matchedCount === 1;
  },
  async deleteComment(id: string): Promise<boolean> {
    const { deletedCount } = await commentsDb.deleteOne({ id: id });

    return deletedCount === 1;
  },
};

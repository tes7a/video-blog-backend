import mongoose from "mongoose";
import { CommentsDbModel } from "../../models/comments/CommentsDbModel";

export const commentsSchema = new mongoose.Schema<CommentsDbModel>({
  id: { type: String, required: true },
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
  likesInfo: {
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
    myStatus: { type: String, required: true },
  },
});

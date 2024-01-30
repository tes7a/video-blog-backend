import mongoose from "mongoose";
import { CommentsDbModel } from "../../models/comments/CommentsDbModel";

export const commentsSchema = new mongoose.Schema<CommentsDbModel>({
  id: String,
  postId: String,
  content: String,
  commentatorInfo: {
    userId: String,
    userLogin: String,
  },
  createdAt: String,
  likesInfo: {
    likesCount: Number,
    dislikesCount: Number,
    myStatus: String,
  },
});

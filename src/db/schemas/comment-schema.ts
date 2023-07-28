import mongoose from "mongoose";
import { CommentsDbModel } from "../../models/comments/CommetnsDbModel";

export const commentsSchema = new mongoose.Schema<CommentsDbModel>({
  id: String,
  postId: String,
  content: String,
  commentatorInfo: {
    userId: String,
    userLogin: String,
  },
  createdAt: String,
});

import mongoose from "mongoose";
import { PostDbModel } from "../../models/posts/PostDbModel";

export const postSchema = new mongoose.Schema<PostDbModel>({
  id: String,
  title: String,
  shortDescription: String,
  content: String,
  blogId: String,
  blogName: String,
  createdAt: String,
});

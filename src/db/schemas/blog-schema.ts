import mongoose from "mongoose";
import { BlogDbModel } from "../../models/blogs/BlogDbModel";

export const blogSchema = new mongoose.Schema<BlogDbModel>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

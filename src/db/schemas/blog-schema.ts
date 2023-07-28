import mongoose from "mongoose";
import { BlogDbModel } from "../../models/blogs/BlogDbModel";

export const blogSchema = new mongoose.Schema<BlogDbModel>({
  id: String,
  name: String,
  description: String,
  websiteUrl: String,
  createdAt: String,
  isMembership: Boolean,
});

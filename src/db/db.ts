import { log } from "console";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  blogSchema,
  commentsSchema,
  devicesSchema,
  postSchema,
  userSchema,
} from "./schemas";

dotenv.config();

const mongoUri = process.env.MONGO_URL || `mongodb://0.0.0.0:27017`;
if (!mongoUri) throw new Error("something wrong");

export const BlogModelClass = mongoose.model("blogs", blogSchema);
export const UserModelClass = mongoose.model("users", userSchema);
export const PostModelClass = mongoose.model("posts", postSchema);
export const CommentModelClass = mongoose.model("comments", commentsSchema);
export const DeviceModelClass = mongoose.model("devices", devicesSchema);

export async function runDb() {
  try {
    await mongoose.connect(mongoUri);
    log("Connect successful");
  } catch (e) {
    console.log("no connection");
    await mongoose.disconnect();
  }
}

import { log } from "console";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userSchema } from "./schemas/user-schema";
import { blogSchema } from "./schemas/blog-schema";
import { postSchema } from "./schemas/post-schema";
import { commentsSchema } from "./schemas/comment-schema";
import { devicesSchema } from "./schemas/device-schema";
dotenv.config();

const mongoUri = process.env.MONGO_URL || `mongodb://0.0.0.0:27017`;
if (!mongoUri) throw new Error("something wrong");

export const client = new MongoClient(mongoUri);
const dbConnect = (dbName: string) => {
  return client.db(dbName);
};
// export const blogsDb = dbConnect("blogs").collection<BlogDbModel>("inventory");
// export const postsDb = dbConnect("posts").collection<PostDbModel>("inventory");
// export const usersDb = dbConnect("users").collection<UsersDbModel>("inventory");
// export const commentsDb =
//   dbConnect("comments").collection<CommentsDbModel>("inventory");
// export const devicesDb =
//   dbConnect("devices").collection<DeviceDbModel>("inventory");
// export const apiConnects =
//   dbConnect("api-connects").collection<ApiConnectsModel>("inventory");

export const blogsDb = mongoose.model("blogs", blogSchema);
export const usersDb = mongoose.model("users", userSchema);
export const postsDb = mongoose.model("posts", postSchema);
export const commentsDb = mongoose.model("comments", commentsSchema);
export const devicesDb = mongoose.model("devices", devicesSchema);

export async function runDb() {
  try {
    await client.connect();
    await mongoose.connect(mongoUri);
    await client.db("admin").command({ ping: 1 });
    log("Connect successful");
  } catch (e) {
    await client.close();
    console.log("no connection");
    await mongoose.disconnect();
  }
}

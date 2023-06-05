import { log } from "console";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { BlogDbModel } from "../models/blogs-models/BlogDbModel";
import { PostDbModel } from "../models/posts/PostDbModel";
import { UsersDbModel } from "../models/users/UsersDbModel";
import { CommentsDbModel } from "../models/comments/CommetnsDbModel";
dotenv.config();

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) throw new Error("something wrong");

export const client = new MongoClient(mongoUri);
const dbConnect = (dbName: string) => {
  return client.db(dbName);
};
export const blogsDb = dbConnect("blogs").collection<BlogDbModel>("inventory");
export const postsDb = dbConnect("posts").collection<PostDbModel>("inventory");
export const usersDb = dbConnect("users").collection<UsersDbModel>("inventory");
export const commentsDb =
  dbConnect("comments").collection<CommentsDbModel>("inventory");

export async function runDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    log("Connect successful");
  } catch (e) {
    await client.close();
  }
}

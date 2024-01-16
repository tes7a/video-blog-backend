import { PostModelClass } from "../db";
import { PostDbModel, PostOutputModel, PostUpdateModel } from "../models";

export class PostsRepository {
  async getPostById(id: string): Promise<PostDbModel | undefined> {
    const res = (await PostModelClass.find({ id: { $regex: id } }).lean())[0];
    if (!res) return undefined;
    return {
      blogId: res.blogId,
      blogName: res.blogName,
      content: res.content,
      createdAt: res.createdAt,
      id: res.id,
      shortDescription: res.shortDescription,
      title: res.title,
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const { deletedCount } = await PostModelClass.deleteOne({ id: id });
    return deletedCount === 1;
  }

  async createPost(newPost: PostDbModel): Promise<PostOutputModel> {
    await PostModelClass.insertMany([newPost]);
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    };
  }

  async updatePost(id: string, payload: PostUpdateModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = payload;
    const { matchedCount } = await PostModelClass.updateOne(
      { id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return matchedCount === 1;
  }
}

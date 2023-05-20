import { log } from "console";
import { postsDb } from "../db/db";
import { PostDbModel } from "../models/posts/PostDbModel";
import { WithQueryModel } from "../models/universal/WithQueryModel";

type argumentType = string | undefined;
type queryParams = string | null;

export const postsRepository = {
  async getAllPosts(
    sortBy?: queryParams,
    sortDirection?: queryParams,
    pageNumber?: queryParams,
    pageSize?: queryParams
  ): Promise<WithQueryModel<PostDbModel[]>> {
    const allPosts = await postsDb
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const defaultSortBy = sortBy || "createdAt";
    const defaultSortDirection = sortDirection || "desc";
    const defaultPageSize = +pageSize! || 10;
    const defaultPageNumber = +pageNumber! || 1;
    const pagesCount = Math.ceil(allPosts.length / defaultPageSize);
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    const endIndex = defaultPageNumber * defaultPageSize;
    const totalCount = allPosts.length;

    const modifiedArray = allPosts
      .slice(startIndex, endIndex)
      .sort((p1, p2) => {
        if (p1[defaultSortBy] < p2[defaultSortBy])
          return defaultSortDirection === "asc" ? -1 : 1;
        if (p1[defaultSortBy] > p2[defaultSortBy])
          return defaultSortDirection === "asc" ? 1 : -1;
        return 0;
      });

    return {
      pagesCount: pagesCount,
      page: defaultPageNumber,
      pageSize: defaultPageSize,
      totalCount: totalCount,
      items: modifiedArray,
    };
  },
  async getBlogById(id: argumentType): Promise<PostDbModel | undefined> {
    const res = (await postsDb.find({ id: { $regex: id } }).toArray())[0];
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
  },

  async deleteById(id: argumentType): Promise<boolean> {
    const { deletedCount } = await postsDb.deleteOne({ id: id });
    return deletedCount === 1;
  },

  async createPost(newPost: PostDbModel): Promise<PostDbModel> {
    await postsDb.insertOne(newPost);
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    };
  },

  async updatePost(
    id: argumentType,
    title: argumentType,
    shortDescription: argumentType,
    content: argumentType,
    blogId: argumentType
  ): Promise<boolean> {
    const { matchedCount } = await postsDb.updateOne(
      { id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return matchedCount === 1;
  },
};

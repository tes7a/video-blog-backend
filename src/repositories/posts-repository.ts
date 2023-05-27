import { log } from "console";
import { postsDb } from "../db/db";
import { PostDbModel } from "../models/posts/PostDbModel";
import { WithQueryModel } from "../models/universal/WithQueryModel";

type ArgumentType = string | undefined;
type SortType =
  | "createdAt"
  | "blogName"
  | "blogId"
  | "content"
  | "shortDescription"
  | "title";

export const postsRepository = {
  async getAllPosts(
    sortBy?: ArgumentType,
    sortDirection?: ArgumentType,
    pageNumber?: ArgumentType,
    pageSize?: ArgumentType
  ): Promise<WithQueryModel<PostDbModel[]>> {
    const allPosts = await postsDb
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const defaultSortBy = sortBy || "createdAt";
    const defaultSortDirection = sortDirection || "desc";
    const defaultPageSize = +pageSize! || 10;
    const defaultPageNumber = +pageNumber! || 1;
    // const pagesCount = Math.ceil(allPosts.length / defaultPageSize);
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    // const endIndex = defaultPageNumber * defaultPageSize;
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    // const totalCount = allPosts.length;
    const filteredArray = await postsDb
      .find({}, { projection: { _id: 0 } })
      .sort({ [defaultSortBy]: sortDirectionMongoDb })
      .skip(startIndex)
      .limit(+defaultPageSize!)
      .toArray();

    const pagesCount = Math.ceil(allPosts.length / defaultPageSize);
    const totalCount = allPosts.length;

    // const modifiedArray = allPosts
    //   .sort((p1, p2) => {
    //     if (p1[defaultSortBy as SortType] < p2[defaultSortBy as SortType])
    //       return defaultSortDirection === "asc" ? -1 : 1;
    //     if (p1[defaultSortBy as SortType] > p2[defaultSortBy as SortType])
    //       return defaultSortDirection === "asc" ? 1 : -1;
    //     return 0;
    //   })
    //   .slice(startIndex, endIndex);
    return {
      pagesCount,
      page: defaultPageNumber,
      pageSize: defaultPageSize,
      totalCount,
      items: filteredArray,
    };
  },
  async getPostById(id: ArgumentType): Promise<PostDbModel | undefined> {
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

  async getPostByBlogID(
    blogId: ArgumentType,
    pageNumber: ArgumentType,
    pageSize: ArgumentType,
    sortBy: ArgumentType,
    sortDirection: ArgumentType
  ): Promise<WithQueryModel<PostDbModel[]>> {
    const res = await postsDb
      .find({ blogId: { $regex: blogId } }, { projection: { _id: 0 } })
      .toArray();
    const defaultSortBy = sortBy || "createdAt";
    const defaultSortDirection = sortDirection || "desc";
    const defaultPageSize = +pageSize! || 10;
    const defaultPageNumber = +pageNumber! || 1;
    // const pagesCount = Math.ceil(res.length / defaultPageSize);
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    // const endIndex = defaultPageNumber * defaultPageSize;
    // const totalCount = res.length;
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    const filteredArray = await postsDb
      .find({ blogId: { $regex: blogId } }, { projection: { _id: 0 } })
      .sort({ [defaultSortBy]: sortDirectionMongoDb })
      .skip(startIndex)
      .limit(+defaultPageSize!)
      .toArray();

    const pagesCount = Math.ceil(res.length / defaultPageSize);
    const totalCount = res.length;

    // const modifiedArray = res
    //   .sort((p1, p2) => {
    //     if (p1[defaultSortBy as SortType] < p2[defaultSortBy as SortType])
    //       return defaultSortDirection === "asc" ? -1 : 1;
    //     if (p1[defaultSortBy as SortType] > p2[defaultSortBy as SortType])
    //       return defaultSortDirection === "asc" ? 1 : -1;
    //     return 0;
    //   })
    //   .slice(startIndex, endIndex);
    return {
      pagesCount,
      page: defaultPageNumber,
      pageSize: defaultPageSize,
      totalCount,
      items: filteredArray,
    };
  },

  async deleteById(id: ArgumentType): Promise<boolean> {
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
    id: ArgumentType,
    title: ArgumentType,
    shortDescription: ArgumentType,
    content: ArgumentType,
    blogId: ArgumentType
  ): Promise<boolean> {
    const { matchedCount } = await postsDb.updateOne(
      { id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return matchedCount === 1;
  },
};

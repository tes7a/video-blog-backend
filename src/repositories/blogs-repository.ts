import { blogsDb } from "../db/db";
import { BlogDbModel } from "../models/blogs-models/BlogDbModel";
import { WithQueryModel } from "../models/universal/WithQueryModel";

type ArgumentType = string | undefined;
type SortType =
  | "createdAt"
  | "name"
  | "description"
  | "websiteUrl"
  | "isMembership";

export const blogsRepository = {
  async getAllBlogs(
    searchNameTerm: ArgumentType,
    sortBy: ArgumentType,
    sortDirection: ArgumentType,
    pageNumber: ArgumentType,
    pageSize: ArgumentType
  ): Promise<WithQueryModel<BlogDbModel[]>> {
    const allBlogs = await blogsDb
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const defaultSortBy = sortBy || "createdAt";
    const defaultSortDirection = sortDirection || "desc";
    const defaultPageSize = +pageSize! || 10;
    const defaultPageNumber = +pageNumber! || 1;
    const pagesCount = Math.ceil(allBlogs.length / defaultPageSize);
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    const endIndex = defaultPageNumber * defaultPageSize;
    const totalCount = allBlogs.length;
    const modifiedArray = allBlogs
      .slice(startIndex, endIndex)
      .sort((b1, b2) => {
        if (b1[defaultSortBy as SortType] < b2[defaultSortBy as SortType])
          return defaultSortDirection === "desc" ? -1 : 1;
        if (b1[defaultSortBy as SortType] > b2[defaultSortBy as SortType])
          return defaultSortDirection === "asc" ? 1 : -1;
        return 0;
      })
      .filter((b) =>
        searchNameTerm ? b.name.indexOf(searchNameTerm!) > -1 : b
      );

    return {
      pagesCount,
      page: defaultPageNumber,
      pageSize: defaultPageSize,
      totalCount,
      items: modifiedArray,
    };
  },
  async getBlogById(id: ArgumentType): Promise<BlogDbModel | undefined> {
    const res = (await blogsDb.find({ id: { $regex: id } }).toArray())[0];
    if (!res) return undefined;
    return {
      id: res.id,
      name: res.name,
      createdAt: res.createdAt,
      description: res.description,
      isMembership: res.isMembership,
      websiteUrl: res.websiteUrl,
    };
  },
  async deleteById(id: ArgumentType): Promise<boolean> {
    const { deletedCount } = await blogsDb.deleteOne({ id: id });

    return deletedCount === 1;
  },
  async createdBlog(newBlog: BlogDbModel): Promise<BlogDbModel> {
    await blogsDb.insertOne(newBlog);
    return {
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    };
  },
  async updateBlog(
    id: ArgumentType,
    description: ArgumentType,
    name: ArgumentType,
    websiteUrl: ArgumentType
  ): Promise<boolean> {
    const { matchedCount } = await blogsDb.updateOne(
      { id: id },
      { $set: { description, name, websiteUrl } }
    );

    return matchedCount === 1;
  },
};

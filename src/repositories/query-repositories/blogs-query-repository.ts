import { blogsDb } from "../../db/db";
import { BlogDbModel } from "../../models/blogs-models/BlogDbModel";
import { BlogWithQueryModel } from "../../models/blogs-models/BlogWithQueryModel";
import { BlogsOutputMode } from "../../models/blogs-models/BlogsOutputModel";
import { WithQueryModel } from "../../models/universal/WithQueryModel";

export const blogsQueryRepository = {
  async getBlogs(
    payload: BlogWithQueryModel
  ): Promise<WithQueryModel<BlogDbModel[]>> {
    const defaultSearchName = payload.searchNameTerm
      ? { name: { $regex: payload.searchNameTerm, $options: "i" } }
      : {};
    const defaultSortBy = payload.sortBy || "createdAt";
    const defaultSortDirection = payload.sortDirection || "desc";
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    const defaultPageSize = +payload.pageSize! || 10;
    const defaultPageNumber = +payload.pageNumber! || 1;
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;

    const allBlogs = await blogsDb
      .find(defaultSearchName, { projection: { _id: 0 } })
      .toArray();
    const filteredArray = await blogsDb
      .find(defaultSearchName, { projection: { _id: 0 } })
      .sort({ [defaultSortBy]: sortDirectionMongoDb })
      .skip(startIndex)
      .limit(+defaultPageSize!)
      .toArray();

    const pagesCount = Math.ceil(allBlogs.length / defaultPageSize);
    const totalCount = allBlogs.length;
    // const defaultSortBy = sortBy || "createdAt";
    // const defaultSortDirection = sortDirection || "desc";
    // const defaultPageSize = +pageSize! || 10;
    // const defaultPageNumber = +pageNumber! || 1;
    // const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    // const endIndex = defaultPageNumber * defaultPageSize;
    // const filteredArray = allBlogs.filter((b) =>
    //   searchNameTerm
    //     ? b.name.toLowerCase().indexOf(searchNameTerm!.toLowerCase()) > -1
    //     : b
    // );
    // const pagesCount = Math.ceil(filteredArray.length / defaultPageSize);
    // const totalCount = filteredArray.length;
    // const modifiedArray = filteredArray
    //   .sort((b1, b2) => {
    //     if (b1[defaultSortBy as SortType] < b2[defaultSortBy as SortType])
    //       return defaultSortDirection === "asc" ? -1 : 1;
    //     if (b1[defaultSortBy as SortType] > b2[defaultSortBy as SortType])
    //       return defaultSortDirection === "asc" ? 1 : -1;
    //     return 0;
    //   })
    //   .slice(startIndex, endIndex);

    return {
      pagesCount,
      page: defaultPageNumber,
      pageSize: defaultPageSize,
      totalCount,
      items: await this._mapBlogs(filteredArray),
    };
  },

  async _mapBlogs(blogs: BlogDbModel[]): Promise<BlogsOutputMode[]> {
    return blogs.map((b) => {
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        isMembership: b.isMembership,
      };
    });
  },
};

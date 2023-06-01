import { postsDb } from "../../db/db";
import { PostDbModel } from "../../models/posts/PostDbModel";
import { PostOutputModel } from "../../models/posts/PostOutputModel";
import { PostWIthQueryModel } from "../../models/posts/PostWIthQueryModel";
import { WithQueryModel } from "../../models/universal/WithQueryModel";

export const postQueryRepository = {
  async getPosts(
    payload: PostWIthQueryModel
  ): Promise<WithQueryModel<PostOutputModel[]>> {
    const allPosts = await postsDb
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const defaultSortBy = payload.sortBy || "createdAt";
    const defaultSortDirection = payload.sortDirection || "desc";
    const defaultPageSize = +payload.pageSize! || 10;
    const defaultPageNumber = +payload.pageNumber! || 1;
    // const pagesCount = Math.ceil(allPosts.length / defaultPageSize);
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    // const endIndex = defaultPageNumber * defaultPageSize;
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    // const totalCount = allPosts.length;
    const filteredArray = await postsDb
      .find({}, { projection: { _id: 0 } })
      .sort({
        [defaultSortBy]: sortDirectionMongoDb,
        createdAt: sortDirectionMongoDb,
      })
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
      items: await this._mapPosts(filteredArray),
    };
  },
  async getPostByBlogID(
    blogId: string,
    payload: PostWIthQueryModel
  ): Promise<WithQueryModel<PostOutputModel[]>> {
    const res = await postsDb
      .find({ blogId: { $regex: blogId } }, { projection: { _id: 0 } })
      .toArray();
    const defaultSortBy = payload.sortBy || "createdAt";
    const defaultSortDirection = payload.sortDirection || "desc";
    const defaultPageSize = +payload.pageSize! || 10;
    const defaultPageNumber = +payload.pageNumber! || 1;
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
      items: await this._mapPosts(filteredArray),
    };
  },
  async _mapPosts(items: PostDbModel[]): Promise<PostOutputModel[]> {
    return items.map((p) => {
      return {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
      };
    });
  },
};

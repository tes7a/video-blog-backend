import { PostModelClass } from "../../db/db";
import { PostDbModel } from "../../models/posts/PostDbModel";
import { PostOutputModel } from "../../models/posts/PostOutputModel";
import { PostWIthQueryModel } from "../../models/posts/PostWIthQueryModel";
import { WithQueryModel } from "../../models/universal/WithQueryModel";

export const postQueryRepository = {
  async getPosts(
    payload: PostWIthQueryModel
  ): Promise<WithQueryModel<PostOutputModel[]>> {
    const allPosts = await PostModelClass.find(
      {},
      { projection: { _id: 0 } }
    ).lean();
    const defaultSortBy = payload.sortBy || "createdAt";
    const defaultSortDirection = payload.sortDirection || "desc";
    const defaultPageSize = +payload.pageSize! || 10;
    const defaultPageNumber = +payload.pageNumber! || 1;
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    const filteredArray = await PostModelClass.find(
      {},
      { projection: { _id: 0 } }
    )
      .sort({
        [defaultSortBy]: sortDirectionMongoDb,
        createdAt: sortDirectionMongoDb,
      })
      .skip(startIndex)
      .limit(+defaultPageSize!)
      .lean();

    const pagesCount = Math.ceil(allPosts.length / defaultPageSize);
    const totalCount = allPosts.length;

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
    const res = await PostModelClass.find(
      { blogId: { $regex: blogId } },
      { projection: { _id: 0 } }
    ).lean();
    const defaultSortBy = payload.sortBy || "createdAt";
    const defaultSortDirection = payload.sortDirection || "desc";
    const defaultPageSize = +payload.pageSize! || 10;
    const defaultPageNumber = +payload.pageNumber! || 1;
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    const filteredArray = await PostModelClass.find(
      { blogId: { $regex: blogId } },
      { projection: { _id: 0 } }
    )
      .sort({ [defaultSortBy]: sortDirectionMongoDb })
      .skip(startIndex)
      .limit(+defaultPageSize!)
      .lean();

    const pagesCount = Math.ceil(res.length / defaultPageSize);
    const totalCount = res.length;

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

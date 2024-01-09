import { PostModelClass } from "../../db/db";
import { PostDbModel } from "../../models/posts/PostDbModel";
import { PostOutputModel } from "../../models/posts/PostOutputModel";
import { PostWIthQueryModel } from "../../models/posts/PostWIthQueryModel";
import { WithQueryModel } from "../../models/universal/WithQueryModel";

export class PostQueryRepository {
  async getPosts(
    payload: PostWIthQueryModel
  ): Promise<WithQueryModel<PostOutputModel[]>> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = payload;

    const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);

    const postsCount = await PostModelClass.countDocuments({});
    const filteredArray = await this.getFilteredPosts(
      {},
      sortBy,
      sortDirection,
      startIndex,
      Number(pageSize)
    );

    const pagesCount = Math.ceil(postsCount / Number(pageSize));

    return {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: postsCount,
      items: await this._mapPosts(filteredArray),
    };
  }

  async getPostByBlogID(
    blogId: string,
    payload: PostWIthQueryModel
  ): Promise<WithQueryModel<PostOutputModel[]>> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = payload;
    const filterCondition = {
      blogId: { $regex: blogId },
    };
    const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);
    const postsCount = await PostModelClass.countDocuments(filterCondition);
    const filteredArray = await this.getFilteredPosts(
      filterCondition,
      sortBy,
      sortDirection,
      startIndex,
      Number(pageSize)
    );

    const pagesCount = Math.ceil(postsCount / Number(pageSize));

    return {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: postsCount,
      items: await this._mapPosts(filteredArray),
    };
  }

  async getFilteredPosts(
    filterCondition: object,
    sortBy: string,
    sortDirection: string,
    startIndex: number,
    pageSize: number
  ): Promise<PostDbModel[]> {
    return PostModelClass.find(filterCondition, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip(startIndex)
      .limit(pageSize)
      .lean();
  }

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
  }
}

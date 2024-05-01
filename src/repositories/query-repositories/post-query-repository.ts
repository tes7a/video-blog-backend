import { PostModelClass } from "../../db";
import {
  PostDbModel,
  PostOutputModel,
  PostWIthQueryModel,
  WithQueryModel,
} from "../../models";

export class PostQueryRepository {
  async getPosts(
    payload: PostWIthQueryModel,
    userId?: string
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
      items: await this._mapPosts(filteredArray, userId!),
    };
  }

  async getPostByBlogID(
    blogId: string,
    payload: PostWIthQueryModel,
    userId?: string
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
      items: await this._mapPosts(filteredArray, userId),
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

  async _mapPosts(
    items: PostDbModel[],
    userId?: string
  ): Promise<PostDbModel[]> {
    return items.map((p) => {
      return {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
        extendedLikesInfo: {
          dislikesCount: p.extendedLikesInfo.dislikesCount,
          likesCount: p.extendedLikesInfo.likesCount,
          myStatus:
            p.extendedLikesInfo.userRatings?.find(
              (user) => user.userId === userId
            )?.userRating ?? "None",
          newestLikes: p.extendedLikesInfo.newestLikes?.length
            ? p.extendedLikesInfo.newestLikes
                .filter((like) =>
                  like.userId === userId
                    ? {
                        addedAt: like.addedAt,
                        userId: like.userId,
                        login: like.login,
                      }
                    : []
                )
                .map((like) => ({
                  addedAt: like.addedAt,
                  userId: like.userId,
                  login: like.login,
                }))
                .slice(0, 3)
            : [],
        },
      };
    });
  }
}

import { CommentModelClass } from "../../db/db";
import { CommentsOutputModel } from "../../models/comments/CommentsOutputModel";
import { CommentsQueryModel } from "../../models/comments/CommentsQueryModel";
import { CommentsDbModel } from "../../models/comments/CommetnsDbModel";
import { WithQueryModel } from "../../models/universal/WithQueryModel";

export const postCommentsQueryRepository = {
  async getComments(
    postId: string,
    payload: CommentsQueryModel
  ): Promise<WithQueryModel<CommentsOutputModel[]>> {
    const allComments = await CommentModelClass.find(
      { postId },
      { projection: { _id: 0 } }
    ).lean();
    const defaultSortBy = payload.sortBy || "createdAt";
    const defaultSortDirection = payload.sortDirection || "desc";
    const defaultPageSize = +payload.pageSize! || 10;
    const defaultPageNumber = +payload.pageNumber! || 1;
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    const filteredArray = await CommentModelClass.find(
      { postId },
      { projection: { _id: 0 } }
    )
      .sort({
        [defaultSortBy]: sortDirectionMongoDb,
        createdAt: sortDirectionMongoDb,
      })
      .skip(startIndex)
      .limit(+defaultPageSize!)
      .lean();
    const pagesCount = Math.ceil(allComments.length / defaultPageSize);
    const totalCount = allComments.length;

    return {
      pagesCount,
      page: defaultPageNumber,
      pageSize: defaultPageSize,
      totalCount,
      items: await this._mapComments(filteredArray),
    };
  },

  async _mapComments(items: CommentsDbModel[]): Promise<CommentsOutputModel[]> {
    return await items.map((item) => {
      return {
        id: item.id,
        content: item.content,
        commentatorInfo: {
          userId: item.commentatorInfo.userId,
          userLogin: item.commentatorInfo.userLogin,
        },
        createdAt: item.createdAt,
      };
    });
  },
};

import { CommentModelClass } from "../../db";
import {
  CommentsOutputModel,
  CommentsQueryModel,
  WithQueryModel,
} from "../../models";

export class PostCommentsQueryRepository {
  async getComments(
    postId: string,
    payload: CommentsQueryModel,
    userId?: string
  ): Promise<WithQueryModel<CommentsOutputModel[]>> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = payload;
    const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);
    const commentsCount = await CommentModelClass.countDocuments({
      postId,
    });
    const filteredArray = await CommentModelClass.find(
      { postId },
      { projection: { _id: 0 } }
    )
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip(startIndex)
      .limit(Number(pageSize))
      .lean();
    const pagesCount = Math.ceil(commentsCount / Number(pageSize));

    return {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: commentsCount,
      items: filteredArray.map(
        ({
          commentatorInfo,
          content,
          createdAt,
          id,
          likesInfo: { dislikesCount, likesCount, userRatings },
        }) => {
          return {
            id: id,
            content: content,
            commentatorInfo: {
              userId: commentatorInfo.userId,
              userLogin: commentatorInfo.userLogin,
            },
            createdAt: createdAt,
            likesInfo: {
              dislikesCount,
              likesCount,
              myStatus:
                userRatings?.find((user) => user.userId === userId)
                  ?.userRating ?? "None",
            },
          };
        }
      ),
    };
  }
}

import { CommentModelClass } from "../../db/db";
import { CommentsOutputModel } from "../../models/comments/CommentsOutputModel";
import { CommentsQueryModel } from "../../models/comments/CommentsQueryModel";
import { WithQueryModel } from "../../models/universal/WithQueryModel";

class PostCommentsQueryRepository {
  async getComments(
    postId: string,
    payload: CommentsQueryModel
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
      items: filteredArray.map((item) => {
        return {
          id: item.id,
          content: item.content,
          commentatorInfo: {
            userId: item.commentatorInfo.userId,
            userLogin: item.commentatorInfo.userLogin,
          },
          createdAt: item.createdAt,
        };
      }),
    };
  }
}

export const postCommentsQueryRepository = new PostCommentsQueryRepository();
//   async getComments(
//     postId: string,
//     payload: CommentsQueryModel
//   ): Promise<WithQueryModel<CommentsOutputModel[]>> {
//     const {
//       pageNumber = 1,
//       pageSize = 10,
//       sortBy = "createdAt",
//       sortDirection = "desc",
//     } = payload;
//     const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);
//     const commentsCount = await CommentModelClass.countDocuments({
//       postId,
//     });
//     const filteredArray = await CommentModelClass.find(
//       { postId },
//       { projection: { _id: 0 } }
//     )
//       .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
//       .skip(startIndex)
//       .limit(Number(pageSize))
//       .lean();
//     const pagesCount = Math.ceil(commentsCount / Number(pageSize));

//     return {
//       pagesCount,
//       page: Number(pageNumber),
//       pageSize: Number(pageSize),
//       totalCount: commentsCount,
//       items: filteredArray.map((item) => {
//         return {
//           id: item.id,
//           content: item.content,
//           commentatorInfo: {
//             userId: item.commentatorInfo.userId,
//             userLogin: item.commentatorInfo.userLogin,
//           },
//           createdAt: item.createdAt,
//         };
//       }),
//     };
//   },
// };

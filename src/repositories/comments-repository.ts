import { CommentModelClass } from "../db";
import { CommentsDbModel, CommentsOutputModel } from "../models";

export class CommentsRepository {
  async getCommentsById(
    idComment: string,
    token?: boolean
  ): Promise<CommentsOutputModel | undefined> {
    const res = (
      await CommentModelClass.find({ id: { $regex: idComment } }).lean()
    )[0];
    if (!res) return undefined;
    const {
      id,
      content,
      createdAt,
      commentatorInfo: { userId, userLogin },
      likesInfo: { dislikesCount, likesCount, myStatus },
    } = res;
    return {
      id,
      content,
      commentatorInfo: {
        userId,
        userLogin,
      },
      createdAt,
      likesInfo: {
        dislikesCount,
        likesCount,
        myStatus: token ? myStatus : "None",
      },
    };
  }

  async createComment(
    newComment: CommentsDbModel
  ): Promise<CommentsOutputModel> {
    const comment = new CommentModelClass({
      id: newComment.id,
      postId: newComment.postId,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None",
      },
    });
    await comment.save();
    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None",
      },
    };
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    const comment = await CommentModelClass.findOne({ id });
    if (!comment) return false;

    comment.content = content;

    await comment.save();
    return true;
  }

  async deleteComment(id: string): Promise<boolean> {
    const { deletedCount } = await CommentModelClass.deleteOne({ id: id });

    return deletedCount === 1;
  }

  async updateLike(
    id: string,
    likeStatus: "None" | "Like" | "Dislike"
  ): Promise<boolean> {
    const comment = await CommentModelClass.findOne({ id });
    if (!comment) return false;

    if (likeStatus === "Like") {
      comment.likesInfo.myStatus = likeStatus;
      comment.likesInfo.likesCount += 1;
    } else if (likeStatus === "Dislike") {
      comment.likesInfo.myStatus = likeStatus;
      comment.likesInfo.dislikesCount += 1;
    }

    comment.save();
    return true;
  }
}

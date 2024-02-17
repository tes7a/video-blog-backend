import { CommentModelClass } from "../db";
import { CommentsDbModel, CommentsOutputModel } from "../models";

export class CommentsRepository {
  async getCommentsById(
    idComment: string,
    token?: boolean,
    currentUserId?: string
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
      likesInfo: { dislikesCount, likesCount, userRatings },
    } = res;

    const currentUser = userRatings?.find(
      (rating) => rating.userId === currentUserId
    );

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
        myStatus: token
          ? currentUser
            ? currentUser?.userRating
            : "None"
          : "None",
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
    likeStatus: "None" | "Like" | "Dislike",
    userId: string
  ): Promise<boolean> {
    const comment = await CommentModelClass.findOne({ id });
    if (!comment) return false;

    const currentUser = comment.likesInfo.userRatings?.find(
      (user) => user.userId === userId
    );

    if (currentUser?.userRating === "Like") {
      return true;
    } else if (currentUser?.userRating === "Dislike") {
      return true;
    }

    if (currentUser) {
      currentUser.userRating = likeStatus;
    } else {
      comment.likesInfo.userRatings?.push({
        userId,
        userRating: likeStatus,
      });
    }

    if (likeStatus === "Like") {
      comment.likesInfo.myStatus = likeStatus;
      comment.likesInfo.likesCount += 1;
    } else if (likeStatus === "Dislike") {
      comment.likesInfo.myStatus = likeStatus;
      comment.likesInfo.dislikesCount += 1;
    } else if (likeStatus === "None" && currentUser?.userRating === "Like") {
      comment.likesInfo.likesCount -= 0;
    } else if (likeStatus === "None" && currentUser?.userRating === "Dislike") {
      comment.likesInfo.dislikesCount -= 0;
    }

    comment.save();
    return true;
  }
}

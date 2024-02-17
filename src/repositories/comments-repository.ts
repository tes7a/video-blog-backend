import { CommentModelClass } from "../db";
import { CommentsDbModel, CommentsOutputModel } from "../models";

export class CommentsRepository {
  async getCommentsById(
    idComment: string,
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
        myStatus: currentUser ? currentUser?.userRating : "None",
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
        userRatings: [],
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

    switch (likeStatus) {
      case "Like":
        if (currentUser) {
          if (currentUser.userRating === "Like") return true;
          if (currentUser.userRating === "Dislike") {
            comment.likesInfo.dislikesCount = Math.max(
              0,
              comment.likesInfo.dislikesCount - 1
            );
          }
          currentUser.userRating = "Like";
        } else {
          comment.likesInfo.userRatings!.push({
            userId,
            userRating: likeStatus,
          });
        }
        comment.likesInfo.myStatus = likeStatus;
        comment.likesInfo.likesCount++;
        break;
      case "Dislike":
        if (currentUser) {
          if (currentUser.userRating === "Dislike") return true;
          if (currentUser.userRating === "Like") {
            comment.likesInfo.likesCount = Math.max(
              0,
              comment.likesInfo.likesCount - 1
            );
          }
          currentUser.userRating = "Dislike";
        } else {
          comment.likesInfo.userRatings!.push({
            userId,
            userRating: likeStatus,
          });
        }
        comment.likesInfo.myStatus = likeStatus;
        comment.likesInfo.dislikesCount++;
        break;
      case "None":
        if (!currentUser) return true;
        if (currentUser.userRating === "Like") {
          comment.likesInfo.likesCount = Math.max(
            0,
            comment.likesInfo.likesCount - 1
          );
        } else if (currentUser.userRating === "Dislike") {
          comment.likesInfo.dislikesCount = Math.max(
            0,
            comment.likesInfo.dislikesCount - 1
          );
        }
        currentUser.userRating = likeStatus;
        comment.likesInfo.myStatus = likeStatus;
        break;
      default:
        return false;
    }

    await comment.save();
    return true;
  }
}

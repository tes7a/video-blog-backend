import { PostModelClass } from "../db";
import { PostDbModel, PostOutputModel, PostUpdateModel } from "../models";

export class PostsRepository {
  async getPostById(
    id: string,
    userId?: string
  ): Promise<PostDbModel | undefined> {
    const res = (await PostModelClass.find({ id: { $regex: id } }).lean())[0];
    if (!res) return undefined;

    return {
      blogId: res.blogId,
      blogName: res.blogName,
      content: res.content,
      createdAt: res.createdAt,
      id: res.id,
      shortDescription: res.shortDescription,
      title: res.title,
      extendedLikesInfo: {
        dislikesCount: res.extendedLikesInfo.dislikesCount,
        likesCount: res.extendedLikesInfo.likesCount,
        myStatus:
          res.extendedLikesInfo.userRatings?.find(
            (user) => user.userId === userId
          )?.userRating ?? "None",
        newestLikes: res.extendedLikesInfo.newestLikes?.length
          ? res.extendedLikesInfo.newestLikes
              .map((like) => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login,
              }))
              .slice(0, 3)
          : [],
      },
    };
  }

  async deleteById(id: string): Promise<boolean> {
    const { deletedCount } = await PostModelClass.deleteOne({ id: id });
    return deletedCount === 1;
  }

  async createPost(newPost: PostDbModel): Promise<PostDbModel> {
    await PostModelClass.insertMany([newPost]);
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        dislikesCount: newPost.extendedLikesInfo.dislikesCount,
        likesCount: newPost.extendedLikesInfo.likesCount,
        myStatus: newPost.extendedLikesInfo.myStatus,
        newestLikes: [],
      },
    };
  }

  async updatePost(id: string, payload: PostUpdateModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = payload;
    const { matchedCount } = await PostModelClass.updateOne(
      { id: id },
      { $set: { title, shortDescription, content, blogId } }
    );
    return matchedCount === 1;
  }

  async updateLike(
    id: string,
    likeStatus: "None" | "Like" | "Dislike",
    userId: string,
    userLogin: string
  ): Promise<boolean> {
    const post = await PostModelClass.findOne({ id });
    if (!post) return false;

    const currentUser = post.extendedLikesInfo?.userRatings?.find(
      (user) => user.userId === userId
    );

    switch (likeStatus) {
      case "Like":
        if (currentUser) {
          if (currentUser.userRating === "Like") return true;
          if (currentUser.userRating === "Dislike") {
            post.extendedLikesInfo.dislikesCount = Math.max(
              0,
              post.extendedLikesInfo.dislikesCount - 1
            );
          }
          currentUser.userRating = "Like";
        } else {
          post.extendedLikesInfo.userRatings!.push({
            userId,
            userRating: likeStatus,
          });
        }
        post.extendedLikesInfo.myStatus = likeStatus;
        post.extendedLikesInfo.likesCount++;
        post.extendedLikesInfo.newestLikes = [
          {
            addedAt: new Date().toISOString(),
            login: userLogin,
            userId,
          },
        ];
        break;
      case "Dislike":
        if (currentUser) {
          if (currentUser.userRating === "Dislike") return true;
          if (currentUser.userRating === "Like") {
            post.extendedLikesInfo.likesCount = Math.max(
              0,
              post.extendedLikesInfo.likesCount - 1
            );
          }
          currentUser.userRating = "Dislike";
        } else {
          post.extendedLikesInfo.userRatings!.push({
            userId,
            userRating: likeStatus,
          });
        }
        post.extendedLikesInfo.myStatus = likeStatus;
        post.extendedLikesInfo.dislikesCount++;
        break;
      case "None":
        if (!currentUser) return true;
        if (currentUser.userRating === "Like") {
          post.extendedLikesInfo.likesCount = Math.max(
            0,
            post.extendedLikesInfo.likesCount - 1
          );
        } else if (currentUser.userRating === "Dislike") {
          post.extendedLikesInfo.dislikesCount = Math.max(
            0,
            post.extendedLikesInfo.dislikesCount - 1
          );
        }
        currentUser.userRating = likeStatus;
        post.extendedLikesInfo.myStatus = likeStatus;
        break;
      default:
    }

    await post.save();
    return true;
  }
}

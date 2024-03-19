export type PostDbModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: null | string;
    userRatings?: {
      userId: string;
      userRating: string;
    }[];
    newestLikes?: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };
};

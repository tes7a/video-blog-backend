import { BlogModelClass } from "../../db/db";
import { BlogDbModel } from "../../models/blogs/BlogDbModel";
import { BlogWithQueryModel } from "../../models/blogs/BlogWithQueryModel";
import { BlogsOutputMode } from "../../models/blogs/BlogsOutputModel";
import { WithQueryModel } from "../../models/universal/WithQueryModel";

export const blogsQueryRepository = {
  async getBlogs(
    payload: BlogWithQueryModel
  ): Promise<WithQueryModel<BlogsOutputMode[]>> {
    const {
      searchNameTerm,
      sortBy = "createdAt",
      sortDirection = "desc",
      pageSize = 10,
      pageNumber = 1,
    } = payload;

    const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);
    const defaultSearchName = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};

    const blogsCount = await BlogModelClass.countDocuments(defaultSearchName);
    const filteredArray: BlogDbModel[] = await BlogModelClass.find(
      defaultSearchName,
      { projection: { _id: 0 } }
    )
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip(startIndex)
      .limit(Number(pageSize))
      .lean();

    const pagesCount: number = Math.ceil(blogsCount / Number(pageSize));

    return {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: blogsCount,
      items: filteredArray.map((b) => {
        return {
          id: b.id,
          name: b.name,
          description: b.description,
          websiteUrl: b.websiteUrl,
          createdAt: b.createdAt,
          isMembership: b.isMembership,
        };
      }),
    };
  },
};

import { log } from "console";
import { UserModelClass } from "../../db/db";
import { WithQueryModel } from "../../models/universal/WithQueryModel";
import { UsersOutputModel } from "../../models/users/UsersOutputModel";
import { UsersQueryModel } from "../../models/users/UsersQueryModel";

export const usersQueryRepository = {
  async getUsers(
    payload: UsersQueryModel
  ): Promise<WithQueryModel<UsersOutputModel[]>> {
    log(payload, "PAYLOAD");
    const {
      pageNumber = 1,
      pageSize = 10,
      searchEmailTerm,
      searchLoginTerm,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = payload;

    const emailSearchCondition = searchEmailTerm
      ? { email: { $regex: searchEmailTerm, $options: "i" } }
      : {};
    const loginSearchCondition = searchLoginTerm
      ? { login: { $regex: searchLoginTerm, $options: "i" } }
      : {};

    const searchConditions = {
      $or: [emailSearchCondition, loginSearchCondition],
    };

    const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);

    const usersCount = await UserModelClass.countDocuments(searchConditions);

    const sortedUsers = await UserModelClass.find(searchConditions, {
      projection: { _id: 0 },
    })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip(startIndex)
      .limit(Number(pageSize))
      .lean();

    const pagesCount = Math.ceil(usersCount / Number(pageSize));

    return {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: usersCount,
      items: sortedUsers.map((user) => ({
        id: user.id,
        email: user.accountData.email,
        login: user.accountData.login,
        createdAt: user.accountData.createdAt,
      })),
    };
  },
};

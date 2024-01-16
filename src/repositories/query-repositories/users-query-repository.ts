import { UserModelClass } from "../../db";
import {
  UsersOutputModel,
  UsersQueryModel,
  WithQueryModel,
} from "../../models";

export class UsersQueryRepository {
  async getUsers(
    payload: UsersQueryModel
  ): Promise<WithQueryModel<UsersOutputModel[]>> {
    const {
      pageNumber = 1,
      pageSize = 10,
      searchEmailTerm,
      searchLoginTerm,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = payload;

    const emailSearchCondition = searchEmailTerm
      ? { "accountData.email": { $regex: searchEmailTerm, $options: "i" } }
      : {};
    const loginSearchCondition = searchLoginTerm
      ? { "accountData.login": { $regex: searchLoginTerm, $options: "i" } }
      : {};

    const searchConditions = {
      $or: [emailSearchCondition, loginSearchCondition],
    };

    const startIndex: number = (Number(pageNumber) - 1) * Number(pageSize);

    const usersCount = await UserModelClass.countDocuments(searchConditions);

    const sortedUsers = await UserModelClass.find(searchConditions, {
      projection: { _id: 0 },
    })
      .sort({ [`accountData.${sortBy}`]: sortDirection === "asc" ? 1 : -1 })
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
  }
}

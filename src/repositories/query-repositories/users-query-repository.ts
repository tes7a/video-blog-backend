import { log } from "console";
import { UserModelClass } from "../../db/db";
import { WithQueryModel } from "../../models/universal/WithQueryModel";
import { UsersOutputModel } from "../../models/users/UsersOutputModel";
import { UsersQueryModel } from "../../models/users/UsersQueryModel";

export const usersQueryRepository = {
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

    log(sortDirection);
    log([`accountData[${sortBy}]`]);
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
  },
};

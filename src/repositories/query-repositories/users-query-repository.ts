import { usersDb } from "../../db/db";
import { WithQueryModel } from "../../models/universal/WithQueryModel";
import { UsersDbModel } from "../../models/users/UsersDbModel";
import { UsersOutputModel } from "../../models/users/UsersOutputModel";
import { UsersQueryModel } from "../../models/users/UsersQueryModel";

export const usersQueryRepository = {
  async getUsers(
    payload: UsersQueryModel
  ): Promise<WithQueryModel<UsersOutputModel[]>> {
    const defaultSearchLogin = payload.searchLoginTerm
      ? { login: { $regex: payload.searchLoginTerm, $options: "i" } }
      : {};
    const defaultSearchEMail = payload.searchEmailTerm
      ? { email: { $regex: payload.searchEmailTerm, $options: "i" } }
      : {};
    const defaultSortBy = payload.sortBy || "createdAt";
    const defaultSortDirection = payload.sortDirection || "desc";
    const sortDirectionMongoDb = defaultSortDirection === "asc" ? 1 : -1;
    const defaultPageSize = +payload.pageSize! || 10;
    const defaultPageNumber = +payload.pageNumber! || 1;
    const startIndex = (defaultPageNumber - 1) * defaultPageSize;
    const allUsers = await usersDb
      .find(
        { $or: [defaultSearchEMail, defaultSearchLogin] },
        { projection: { _id: 0 } }
      )
      .toArray();

    const sortedUsers = await usersDb
      .find(
        { $or: [defaultSearchEMail, defaultSearchLogin] },
        { projection: { _id: 0 } }
      )
      .sort({ [defaultSortBy]: sortDirectionMongoDb })
      .skip(startIndex)
      .limit(defaultPageSize)
      .toArray();

    const pagesCount = Math.ceil(allUsers.length / defaultPageSize);
    const totalCount = allUsers.length;

    return {
      pagesCount,
      page: defaultPageNumber,
      pageSize: defaultPageSize,
      totalCount,
      items: await this._mapUsers(sortedUsers),
    };
  },

  async _mapUsers(items: UsersDbModel[]): Promise<UsersOutputModel[]> {
    return items.map((user) => {
      return {
        id: user.id,
        email: user.email,
        login: user.login,
        createdAt: user.createdAt,
      };
    });
  },
};

import { usersDb } from "../db/db";
import { WithQueryModel } from "../models/universal/WithQueryModel";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";
import { UsersDbModel } from "../models/users/UsersDbModel";

type ArgumentType = string | undefined;

export const usersRepository = {
  async createUser(newUser: UsersDbModel) {
    await usersDb.insertOne(newUser);
    return await this._mapUser(newUser);
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersDbModel | null> {
    return await usersDb.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },
  async _mapUser(user: UsersDbModel): Promise<UsersCreateOutputModel> {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      createdAt: user.createdAt,
    };
  },
};

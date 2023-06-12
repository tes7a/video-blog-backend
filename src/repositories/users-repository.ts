import { usersDb } from "../db/db";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";
import { UsersDbModel } from "../models/users/UsersDbModel";

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
  async findUserById(id: string): Promise<UsersDbModel | null> {
    return await usersDb.findOne({ id: id });
  },
  async deleteUser(id: string) {
    const { deletedCount } = await usersDb.deleteOne({ id: id });

    return deletedCount === 1;
  },
  async _mapUser(user: UsersDbModel): Promise<UsersCreateOutputModel> {
    return {
      id: user.id,
      email: user.accountData.email,
      login: user.accountData.login,
      createdAt: user.accountData.createdAt,
    };
  },
};

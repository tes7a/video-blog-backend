import { UserModelClass } from "../db/db";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";
import { UsersDbModel } from "../models/users/UsersDbModel";

export const usersRepository = {
  async createUser(newUser: UsersDbModel) {
    await UserModelClass.insertMany([newUser]);
    return await this._mapUser(newUser);
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersDbModel | null> {
    return await UserModelClass.findOne({
      $or: [
        { "accountData.email": loginOrEmail },
        { "accountData.login": loginOrEmail },
      ],
    });
  },
  async findUserById(id: string): Promise<UsersDbModel | null> {
    return await UserModelClass.findOne({ id: id });
  },
  async findByToken(token: string): Promise<UsersDbModel | null> {
    return await UserModelClass.findOne({ token });
  },

  async deleteUser(id: string) {
    const { deletedCount } = await UserModelClass.deleteOne({ id: id });

    return deletedCount === 1;
  },
  async findUserByConfirmCode(code: string): Promise<UsersDbModel | null> {
    return UserModelClass.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  },

  async updateConfirmation(id: string): Promise<boolean> {
    const { matchedCount } = await UserModelClass.updateOne(
      { id: id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );

    return matchedCount === 1;
  },
  async updateToken(id: string, token: string): Promise<boolean> {
    const { matchedCount } = await UserModelClass.updateOne(
      { id: id },
      { $set: { token: token } }
    );

    return matchedCount === 1;
  },
  async refreshConfirmCode(id: string, code: string): Promise<boolean> {
    const { matchedCount } = await UserModelClass.updateOne(
      { id: id },
      { $set: { "emailConfirmation.confirmationCode": code } }
    );

    return matchedCount === 1;
  },

  async setRecoveryCode(id: string, recoveryCode: string): Promise<boolean> {
    const user = await UserModelClass.findOne({ id });
    if (!user) return false;
    user.accountData.recoveryCode = recoveryCode;
    await user.save();
    return true;
  },

  async findRecoveryCode(
    recoveryCode: string
  ): Promise<UsersCreateOutputModel | undefined> {
    const user: UsersDbModel | null = await UserModelClass.findOne({
      "accountData.recoveryCode": recoveryCode,
    });

    if (!user) return undefined;
    return await this._mapUser(user);
  },

  async setNewPassword(
    id: string,
    salt: string,
    hash: string
  ): Promise<boolean> {
    const user = await UserModelClass.findOne({ id });
    if (!user) return false;
    user.accountData.passwordSalt = salt;
    user.accountData.passwordHash = hash;
    await user.save();
    return true;
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

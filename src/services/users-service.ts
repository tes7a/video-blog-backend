import bcrypt from "bcrypt";
import { usersRepository } from "../repositories/users-repository";
import { UsersDbModel } from "../models/users/UsersDbModel";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";

type PayloadCreateUserType = {
  email: string;
  login: string;
  password: string;
};
type PayloadCheckUserType = {
  loginOrEmail: string;
  password: string;
};

export const userService = {
  async createUser(
    payload: PayloadCreateUserType
  ): Promise<UsersCreateOutputModel> {
    const { email, login, password } = payload;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newUser: UsersDbModel = {
      id: new Date().getMilliseconds().toString(),
      email,
      passwordHash,
      passwordSalt,
      login,
      createdAt: new Date().toISOString(),
    };

    return usersRepository.createUser(newUser);
  },
  async checkUserCredentials(
    payload: PayloadCheckUserType
  ): Promise<undefined | UsersDbModel> {
    const user = await usersRepository.findByLoginOrEmail(payload.loginOrEmail);
    if (!user) return undefined;
    const passwordHash = await this._generateHash(
      payload.password,
      user.passwordSalt
    );
    if (user.passwordHash !== passwordHash) return undefined;
    return user;
  },
  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id);
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};

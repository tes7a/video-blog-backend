import bcrypt from "bcrypt";
import { usersRepository } from "../repositories/users-repository";
import { UsersDbModel } from "../models/users/UsersDbModel";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import { ObjectId, WithId } from "mongodb";
import { AuthOutputUserModel } from "../models/auth/AuthOutputUserModel";

export const userService = {
  async createUser(payload: UsersCreateModel): Promise<UsersCreateOutputModel> {
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
  async findUserById(id: string): Promise<UsersDbModel | null> {
    return usersRepository.findUserById(id);
  },
  async findLoggedUser(id: string): Promise<AuthOutputUserModel | undefined> {
    debugger;
    const result = await usersRepository.findUserById(id);
    if (result) {
      const { email, login } = result;
      return {
        email,
        login,
        userId: id,
      };
    }
  },
  async checkUserCredentials(
    payload: AuthLoginModel
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
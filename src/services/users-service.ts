import bcrypt from "bcrypt";
import { usersRepository } from "../repositories/users-repository";
import { UsersDbModel } from "../models/users/UsersDbModel";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";

type payloadType = {
  email: string;
  login: string;
  password: string;
};

export const userService = {
  async createUser(payload: payloadType): Promise<UsersCreateOutputModel> {
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
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};

import bcrypt from "bcrypt";
import { UsersRepository } from "../repositories/users-repository";
import { UserDBModel } from "../models/users/UsersDbModel";
import { UsersCreateOutputModel } from "../models/users/UsersCreatedOutputModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import { AuthOutputUserModel } from "../models/auth/AuthOutputUserModel";

export class UserService {
  usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }
  async createUser(payload: UsersCreateModel): Promise<UsersCreateOutputModel> {
    const { email, login, password } = payload;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const user = new UserDBModel(
      new Date().getMilliseconds().toString(),
      "",
      {
        email,
        passwordHash,
        passwordSalt,
        recoveryCode: "",
        login,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: "",
        expirationDate: new Date(),
        isConfirmed: true,
      }
    );

    return this.usersRepository.createUser(user);
  }

  async findUserById(id: string): Promise<UserDBModel | null> {
    return this.usersRepository.findUserById(id);
  }

  async findLoggedUser(id: string): Promise<AuthOutputUserModel | undefined> {
    const result = await this.usersRepository.findUserById(id);
    if (result) {
      const {
        accountData: { email, login },
      } = result;
      return {
        email,
        login,
        userId: id,
      };
    }
  }

  async updateToken(id: string, token: string): Promise<boolean> {
    return this.usersRepository.updateToken(id, token);
  }

  async checkUserCredentials(
    payload: AuthLoginModel
  ): Promise<undefined | UserDBModel> {
    const user = await this.usersRepository.findByLoginOrEmail(
      payload.loginOrEmail
    );
    if (!user) return undefined;
    if (!user.emailConfirmation?.isConfirmed) return undefined;
    const passwordHash = await this._generateHash(
      payload.password,
      user.accountData.passwordSalt
    );
    if (user.accountData.passwordHash !== passwordHash) return undefined;
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}

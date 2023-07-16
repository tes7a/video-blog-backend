import { add } from "date-fns";
import { UsersDbModel } from "../models/users/UsersDbModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { emailsManager } from "../managers/emails-manager";
import { usersRepository } from "../repositories/users-repository";
import { jwtService } from "./jwt-service";

export const authService = {
  async createUser(payload: UsersCreateModel): Promise<boolean | Error> {
    const { email, login, password } = payload;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const confirmationCode = uuidv4();
    const newUser: UsersDbModel = {
      id: new Date().getMilliseconds().toString(),
      token: "",
      accountData: {
        email,
        passwordHash,
        passwordSalt,
        login,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode,
        expirationDate: add(new Date(), {
          hours: 2,
        }),
        isConfirmed: false,
      },
    };

    try {
      await usersRepository.createUser(newUser);
      await emailsManager.sendEmailConfirmationMessage(email, confirmationCode);
      return true;
    } catch (e) {
      return false;
    }
  },

  async checkUser(value: string) {
    return usersRepository.findByLoginOrEmail(value);
  },

  async confirmCode(code: string): Promise<boolean> {
    const user = await usersRepository.findUserByConfirmCode(code);
    if (user) {
      return await usersRepository.updateConfirmation(user.id);
    }
    return false;
  },

  async resendingMail(email: string): Promise<boolean> {
    try {
      const user = await usersRepository.findByLoginOrEmail(email);
      if (!user) return false;
      if (user.emailConfirmation?.isConfirmed) return false;
      const confirmationCode = uuidv4();
      await usersRepository.refreshConfirmCode(user.id, confirmationCode);
      await emailsManager.sendEmailConfirmationMessage(email, confirmationCode);
      return true;
    } catch (e) {
      return false;
    }
  },
  async checkConfirmationCode(code: string): Promise<boolean | undefined> {
    const user = await usersRepository.findUserByConfirmCode(code);

    if (!user) return true;
    if (user.emailConfirmation?.isConfirmed) return true;
    if (user.emailConfirmation!.expirationDate! < new Date()) return true;
    return false;
  },

  async findByToken(token: string): Promise<UsersDbModel | null> {
    return await usersRepository.findByToken(token);
  },

  async logout(token: string): Promise<boolean> {
    const result = await jwtService.getUserIdByToken(token);
    if (!result) return false;
    const user = await usersRepository.findUserById(result?.userId);
    if (user) {
      return usersRepository.updateToken(user.id, "");
    }
    return false;
  },

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};

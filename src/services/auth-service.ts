import { add } from "date-fns";
import { UsersDbModel } from "../models/users/UsersDbModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { emailsManager } from "../managers/emails-manager";
import { usersRepository } from "../repositories/users-repository";
import { log } from "console";

export const authService = {
  async createUser(payload: UsersCreateModel): Promise<boolean> {
    const { email, login, password } = payload;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    debugger;
    const confirmationCode = uuidv4();

    const newUser: UsersDbModel = {
      id: new Date().getMilliseconds().toString(),
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
    usersRepository.createUser(newUser);
    try {
      emailsManager.sendEmailConfirmationMessage(email, confirmationCode);
      return true;
    } catch (e) {
      return false;
    }
  },

  async confirmCode(code: string): Promise<boolean> {
    const user = await usersRepository.findUserByConfirmCode(code);
    if (!user) return false;
    if (
      user.emailConfirmation?.confirmationCode === code &&
      user.emailConfirmation!.expirationDate! > new Date()
    ) {
      return await usersRepository.updateConfirmation(user.id);
    }
    return false;
  },
  async resendingMail(email: string): Promise<boolean> {
    try {
      const confirmationCode = uuidv4();
      emailsManager.sendEmailConfirmationMessage(email, confirmationCode);
      return await usersRepository.refreshToken(email, confirmationCode);
    } catch (e) {
      return false;
    }
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};

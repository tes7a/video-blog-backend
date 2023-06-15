import { add } from "date-fns";
import { UsersDbModel } from "../models/users/UsersDbModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { emailsManager } from "../managers/emails-manager";
import { usersRepository } from "../repositories/users-repository";

export const authService = {
  async createUser(payload: UsersCreateModel) {
    const { email, login, password } = payload;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

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
      },
    };

    emailsManager.sendEmailConfirmationMessage(email, confirmationCode);
    usersRepository.createUser(newUser);
  },

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};

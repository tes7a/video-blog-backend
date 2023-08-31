import { add } from "date-fns";
import { UserDBModel } from "../models/users/UsersDbModel";
import { UsersCreateModel } from "../models/users/UsersCreateModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { emailsManager } from "../managers/emails-manager";
import { usersRepository } from "../repositories/users-repository";
import { jwtService } from "./jwt-service";
import { deviceRepository } from "../repositories/device-repository";
import { randomUUID } from "crypto";
import { userService } from "./users-service";
import { deviceService } from "./device-service";
import { RequestWithBody } from "../types/types";
import { AuthLoginModel } from "../models/auth/AuthLoginModel";
import { Request } from "express";

class AuthService {
  async createUser(payload: UsersCreateModel): Promise<boolean | Error> {
    const { email, login, password } = payload;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const confirmationCode = uuidv4();
    const user = new UserDBModel(
      new Date().getMilliseconds().toString(),
      "",
      {
        email,
        passwordHash,
        passwordSalt,
        login,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode,
        expirationDate: add(new Date(), {
          hours: 2,
        }),
        isConfirmed: false,
      }
    );

    try {
      await usersRepository.createUser(user);
      await emailsManager.sendEmailConfirmationMessage(email, confirmationCode);
      return true;
    } catch (e) {
      return false;
    }
  }

  async checkUser(value: string) {
    return usersRepository.findByLoginOrEmail(value);
  }

  async confirmCode(code: string): Promise<boolean> {
    const user = await usersRepository.findUserByConfirmCode(code);
    if (user) {
      return await usersRepository.updateConfirmation(user.id);
    }
    return false;
  }

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
  }

  async checkConfirmationCode(code: string): Promise<boolean | undefined> {
    const user = await usersRepository.findUserByConfirmCode(code);

    if (!user) return true;
    if (user.emailConfirmation?.isConfirmed) return true;
    if (user.emailConfirmation!.expirationDate! < new Date()) return true;
    return false;
  }

  async findByToken(token: string): Promise<UserDBModel | null> {
    return await usersRepository.findByToken(token);
  }

  async login(
    req: RequestWithBody<AuthLoginModel>
  ): Promise<{ user: UserDBModel; refreshToken: string } | undefined> {
    const { loginOrEmail, password } = req.body;
    const user = await userService.checkUserCredentials({
      loginOrEmail,
      password,
    });
    if (!user) return undefined;
    const deviceId = randomUUID();
    const refreshToken = await jwtService.createRefreshJWT(user, deviceId);
    const result = await userService.updateToken(user.id, refreshToken);
    if (!result) return undefined;
    const date = await jwtService.getJwtDate(refreshToken);
    await deviceService.createDevice({
      userId: user.id,
      lastActiveDate: date!.toISOString(),
      ip: req.ip,
      deviceId,
      title: req.headers["user-agent"] || ("custom user-agent" as string),
    });

    return {
      user,
      refreshToken,
    };
  }

  async logout(token: string): Promise<boolean> {
    const result = await jwtService.getUserIdByToken(token);
    if (!result) return false;
    const deleted = await deviceRepository.deleteDevice(
      result.deviceId,
      result.userId
    );
    if (!deleted) return false;
    return true;
  }

  async refreshToken(req: Request) {
    const result = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (!result) return undefined;
    const user = await userService.findUserById(result.userId);
    if (!user) return undefined;
    const tokenDate = await jwtService.getJwtDate(req.cookies.refreshToken);
    const isDevice = await deviceService.getDevice(req.params.id, tokenDate!);
    const refreshToken = await jwtService.createRefreshJWT(
      user,
      result.deviceId
    );
    const date = await jwtService.getJwtDate(refreshToken);
    await deviceService.updateDevice({
      userId: user.id,
      lastActiveDate: date!.toISOString(),
      ip: req.ip,
      deviceId: result.deviceId,
      title: req.headers["user-agent"] || ("custom user-agent" as string),
    });

    return { user, isDevice };
  }

  async passwordRecovery(email: string): Promise<boolean> {
    try {
      const user = await usersRepository.findByLoginOrEmail(email);
      if (!user) return false;
      const recoveryCode = uuidv4();
      const update = await usersRepository.setRecoveryCode(
        user.id,
        recoveryCode
      );
      if (!update) return false;
      await emailsManager.passwordRecovery(email, recoveryCode);
      return true;
    } catch (e) {
      return false;
    }
  }

  async changePassword(
    newPassword: string,
    recoveryCode: string
  ): Promise<boolean> {
    const user = await usersRepository.findRecoveryCode(recoveryCode);
    if (!user) return false;
    const passwordNewSalt = await bcrypt.genSalt(10);
    const passwordNewHash = await this._generateHash(
      newPassword,
      passwordNewSalt
    );
    const update = await usersRepository.setNewPassword(
      user.id,
      passwordNewSalt,
      passwordNewHash
    );
    if (!update) return false;
    return true;
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}

export const authService = new AuthService();

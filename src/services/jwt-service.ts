import { UsersDbModel } from "../models/users/UsersDbModel";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import { log } from "console";

export const jwtService = {
  async createJWT(user: UsersDbModel) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "20sec",
    });

    return { accessToken: token };
  },

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result = jwt.verify(token, settings.JWT_SECRET) as {
        userId: string;
      };
      return result.userId;
    } catch (e) {
      log(e);
      return null;
    }
  },
};

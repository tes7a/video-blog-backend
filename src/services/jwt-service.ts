import { UsersDbModel } from "../models/users/UsersDbModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { settings } from "../settings/settings";
import { log } from "console";

export const jwtService = {
  async createJWT(user: UsersDbModel): Promise<{ accessToken: string }> {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "10",
    });

    return { accessToken: token };
  },

  async createRefreshJWT(user: UsersDbModel): Promise<string> {
    return jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "20",
    });
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

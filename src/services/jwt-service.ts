import jwt, { JwtPayload } from "jsonwebtoken";

import { settings } from "../settings/settings";
import { UserDBModel } from "../models";

export class JwtService {
  async createJWT(user: UserDBModel): Promise<{ accessToken: string }> {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      // expiresIn: "10s",
      expiresIn: "1h",
    });

    return { accessToken: token };
  }

  async createRefreshJWT(user: UserDBModel, deviceId: string): Promise<string> {
    return jwt.sign({ userId: user.id, deviceId }, settings.JWT_SECRET, {
      // expiresIn: "20s",
      expiresIn: "1h",
    });
  }

  async getUserIdByToken(
    token: string
  ): Promise<{ userId: string; deviceId: string } | null> {
    try {
      const result = jwt.verify(token, settings.JWT_SECRET) as {
        userId: string;
        deviceId: string;
      };
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getJwtDate(token: string): Promise<Date | undefined> {
    try {
      const decodedToken = jwt.decode(token) as JwtPayload;

      if (decodedToken?.iat) {
        return new Date(decodedToken.iat * 1000);
      }
      return undefined;
    } catch (error) {
      console.log(error);
    }
  }
}

import { UsersDbModel } from "../models/users/UsersDbModel";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import { ObjectId } from "mongodb";
import { log } from "console";

export const jwtService = {
  async createJWT(user: UsersDbModel) {
    debugger;
    //@ts-ignore
    return jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: "6h",
    });
  },

  async getUserIdByToken(token: string) {
    debugger;
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (e) {
      log(e);
      return null;
    }
  },
};

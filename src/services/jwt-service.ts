import { UsersDbModel } from "../models/users/UsersDbModel";
import jwt from "jsonwebtoken";

export const jwtService = {
  async createJWT(user: UsersDbModel) {
    const token = jwt.verify({ userId: user.id }, settings.JWT_SECRET, {});
  },
};

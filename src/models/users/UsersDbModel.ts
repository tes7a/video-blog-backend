import { WithId } from "mongodb";

export type UsersDbModel = {
  id: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  email: string;
  createdAt: string;
};

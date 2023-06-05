import { ObjectId } from "mongodb";

export type AuthOutputUserModel = {
  email: string;
  login: string;
  userId: string;
};

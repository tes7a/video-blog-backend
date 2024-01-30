import mongoose from "mongoose";
import { UserDBModel } from "../../models/users/UsersDbModel";

export const userSchema = new mongoose.Schema<UserDBModel>({
  id: String,
  token: String,
  accountData: {
    login: String,
    passwordHash: String,
    passwordSalt: String,
    recoveryCode: String,
    email: String,
    createdAt: String,
  },
  emailConfirmation: {
    confirmationCode: String,
    expirationDate: String,
    isConfirmed: String,
  },
});

import mongoose from "mongoose";
import { UsersDbModel } from "../../models/users/UsersDbModel";

export const userSchema = new mongoose.Schema<UsersDbModel>({
  id: String,
  token: String,
  accountData: {
    login: String,
    passwordHash: String,
    passwordSalt: String,
    email: String,
    createdAt: String,
  },
  emailConfirmation: {
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean,
  },
});

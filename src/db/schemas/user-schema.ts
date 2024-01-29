import mongoose from "mongoose";
import { UserDBModel } from "../../models/users/UsersDbModel";

export const userSchema = new mongoose.Schema<UserDBModel>({
  id: { type: String, required: true },
  token: { type: String, required: true },
  accountData: {
    login: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    recoveryCode: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
});

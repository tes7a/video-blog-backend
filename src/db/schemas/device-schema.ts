import mongoose from "mongoose";
import { DeviceDbModel } from "../../models/devices/DeviceDbModel";

export const devicesSchema = new mongoose.Schema<DeviceDbModel>({
  ip: String,
  title: String,
  lastActiveDate: String,
  deviceId: String,
  userId: String,
});

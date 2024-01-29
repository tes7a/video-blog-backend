import mongoose from "mongoose";
import { DeviceDbModel } from "../../models/devices/DeviceDbModel";

export const devicesSchema = new mongoose.Schema<DeviceDbModel>({
  ip: { type: String, required: true },
  title:{ type: String, required: true },
  lastActiveDate: { type: String, required: true },
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
});

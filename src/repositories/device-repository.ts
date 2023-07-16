import { devicesDb } from "../db/db";
import { DeviceDbModel } from "../models/devices/DeviceDbModel";
import { DeviceOutputModel } from "../models/devices/DeviceOutputModel";

export const deviceRepository = {
  async getAllDevices(id: string): Promise<DeviceOutputModel[] | null> {
    const devices = await devicesDb.find({ userId: { $regex: id } }).toArray();

    return await this._mapDevices(devices);
  },
  async createDevice(device: DeviceDbModel) {
    await devicesDb.insertOne(device);
  },
  async deleteAllDevices(id: string) {
    return await devicesDb.deleteMany({ userId: id });
  },

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    debugger;
    const { deletedCount } = await devicesDb.deleteOne({
      deviceId: deviceId,
      userId: userId,
    });

    return deletedCount === 1;
  },

  async checkDeviceId(id: string): Promise<boolean> {
    const result = await devicesDb.findOne({ deviceId: id });
    debugger;
    if (result) return true;

    return false;
  },

  async _mapDevices(items: DeviceDbModel[]): Promise<DeviceOutputModel[]> {
    return items.map((i) => ({
      ip: i.ip,
      title: i.title,
      lastActiveDate: i.lastActiveDate,
      deviceId: i.deviceId,
    }));
  },
};

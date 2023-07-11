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

  async deleteDevice(id: string, userId: string): Promise<boolean> {
    const { deletedCount } = await devicesDb.deleteOne({
      id: id,
      userId: userId,
    });

    return deletedCount === 1;
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

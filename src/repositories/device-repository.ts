import { DeviceModelClass } from "../db/db";
import { DeviceDbModel } from "../models/devices/DeviceDbModel";
import { DeviceOutputModel } from "../models/devices/DeviceOutputModel";

export const deviceRepository = {
  async getAllDevices(id: string): Promise<DeviceOutputModel[] | null> {
    const devices = await DeviceModelClass.find({
      userId: { $regex: id },
    }).lean();

    return await this._mapDevices(devices);
  },
  async createDevice(device: DeviceDbModel) {
    const createdDevice = new DeviceModelClass({
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      deviceId: device.deviceId,
      userId: device.userId,
    });
    await createdDevice.save();
  },
  async deleteAllDevices(userId: string, deviceId: string) {
    return await DeviceModelClass.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    });
  },

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    const { deletedCount } = await DeviceModelClass.deleteOne({
      deviceId: deviceId,
      userId: userId,
    });

    return deletedCount === 1;
  },

  async checkDeviceId(id: string): Promise<boolean> {
    const result = await DeviceModelClass.findOne({ deviceId: id });
    if (result) return true;

    return false;
  },

  async getDevice(deviceId: string, date: Date): Promise<DeviceDbModel | null> {
    const result = await DeviceModelClass.findOne({
      deviceId: deviceId,
      lastActiveDate: date,
    });
    if (result) return result;

    return null;
  },

  async updateDevice(device: DeviceDbModel): Promise<boolean> {
    const { matchedCount } = await DeviceModelClass.updateOne(
      { deviceId: device.deviceId },
      {
        $set: {
          lastActiveDate: device.lastActiveDate,
          ip: device.ip,
          deviceId: device.deviceId,
          title: device.title,
        },
      }
    );
    return matchedCount === 1;
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

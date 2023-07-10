import { devicesDb } from "../db/db";
import { DeviceDbModel } from "../models/devices/DeviceDbModel";

export const deviceRepository = {
  async getAllDevices(): Promise<DeviceDbModel | null> {
    return await devicesDb.findOne({});
  },

  async deleteAllDevices() {
    await devicesDb.deleteMany({});
  },

  async deleteDevice(id: string): Promise<boolean> {
    const { deletedCount } = await devicesDb.deleteOne({ id: id });

    return deletedCount === 1;
  },
};

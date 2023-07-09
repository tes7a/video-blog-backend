import { DeviceDbModel } from "../models/devices/DeviceDbModel";
import { deviceRepository } from "../repositories/device-repository";

export const deviceService = {
  async getAllDevices(): Promise<DeviceDbModel[] | null> {
    return await deviceRepository.getAllDevices();
  },

  async deleteAllDevices() {
    await deviceRepository.deleteAllDevices();
  },

  async deleteDevice(id: string): Promise<boolean> {
    return await deviceRepository.deleteDevice(id);
  },
};

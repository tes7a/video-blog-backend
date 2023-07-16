import { DeviceDbModel } from "../models/devices/DeviceDbModel";
import { DeviceOutputModel } from "../models/devices/DeviceOutputModel";
import { deviceRepository } from "../repositories/device-repository";

export const deviceService = {
  async getAllDevices(id: string): Promise<DeviceOutputModel[] | null> {
    return await deviceRepository.getAllDevices(id);
  },

  async createDevice(device: DeviceDbModel) {
    await deviceRepository.createDevice(device);
  },

  async checkDeviceId(id: string): Promise<boolean> {
    return await deviceRepository.checkDeviceId(id);
  },

  async deleteAllDevices(id: string) {
    return await deviceRepository.deleteAllDevices(id);
  },

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    return await deviceRepository.deleteDevice(deviceId, userId);
  },
};

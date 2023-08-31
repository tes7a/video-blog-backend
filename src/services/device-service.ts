import { DeviceDbModel } from "../models/devices/DeviceDbModel";
import { DeviceOutputModel } from "../models/devices/DeviceOutputModel";
import { deviceRepository } from "../repositories/device-repository";

class DeviceService {
  async getAllDevices(id: string): Promise<DeviceOutputModel[] | null> {
    return await deviceRepository.getAllDevices(id);
  }

  async createDevice(device: DeviceDbModel) {
    await deviceRepository.createDevice(device);
  }

  async checkDeviceId(id: string): Promise<boolean> {
    return await deviceRepository.checkDeviceId(id);
  }

  async updateDevice(device: DeviceDbModel): Promise<boolean> {
    return await deviceRepository.updateDevice(device);
  }

  async getDevice(deviceId: string, date: Date): Promise<boolean> {
    const result = await deviceRepository.getDevice(deviceId, date);
    if (!result) return false;
    return true;
  }

  async deleteAllDevices(userId: string, deviceId: string) {
    return await deviceRepository.deleteAllDevices(userId, deviceId);
  }

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    return await deviceRepository.deleteDevice(deviceId, userId);
  }
}

export const deviceService = new DeviceService();

//   async getAllDevices(id: string): Promise<DeviceOutputModel[] | null> {
//     return await deviceRepository.getAllDevices(id);
//   },

//   async createDevice(device: DeviceDbModel) {
//     await deviceRepository.createDevice(device);
//   },

//   async checkDeviceId(id: string): Promise<boolean> {
//     return await deviceRepository.checkDeviceId(id);
//   },

//   async updateDevice(device: DeviceDbModel): Promise<boolean> {
//     return await deviceRepository.updateDevice(device);
//   },

//   async getDevice(deviceId: string, date: Date): Promise<boolean> {
//     const result = await deviceRepository.getDevice(deviceId, date);
//     if (!result) return false;
//     return true;
//   },

//   async deleteAllDevices(userId: string, deviceId: string) {
//     return await deviceRepository.deleteAllDevices(userId, deviceId);
//   },

//   async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
//     return await deviceRepository.deleteDevice(deviceId, userId);
//   },
// };

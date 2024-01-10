import { DeviceDbModel } from "../models/devices/DeviceDbModel";
import { DeviceOutputModel } from "../models/devices/DeviceOutputModel";
import { DeviceRepository } from "../repositories/device-repository";

export class DeviceService {
  constructor(protected deviceRepository: DeviceRepository) {}

  async getAllDevices(id: string): Promise<DeviceOutputModel[] | null> {
    return await this.deviceRepository.getAllDevices(id);
  }

  async createDevice(device: DeviceDbModel) {
    await this.deviceRepository.createDevice(device);
  }

  async checkDeviceId(id: string): Promise<boolean> {
    return await this.deviceRepository.checkDeviceId(id);
  }

  async updateDevice(device: DeviceDbModel): Promise<boolean> {
    return await this.deviceRepository.updateDevice(device);
  }

  async getDevice(deviceId: string, date: Date): Promise<boolean> {
    const result = await this.deviceRepository.getDevice(deviceId, date);
    if (!result) return false;
    return true;
  }

  async deleteAllDevices(userId: string, deviceId: string) {
    return await this.deviceRepository.deleteAllDevices(userId, deviceId);
  }

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    return await this.deviceRepository.deleteDevice(deviceId, userId);
  }
}

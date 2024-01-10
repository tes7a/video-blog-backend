import { Request, Response } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithParams } from "../types/types";
import { DeviceService, JwtService } from "../services";

const { No_Content, OK, Not_Found, Forbidden } = HTTPS_ANSWERS;

export class DevicesController {
  constructor(
    protected deviceService: DeviceService,
    protected jwtService: JwtService
  ) {}

  async getAllDevices(req: Request, res: Response) {
    const result = await this.jwtService.getUserIdByToken(
      req.cookies.refreshToken
    );
    if (result)
      res
        .status(OK)
        .send(await this.deviceService.getAllDevices(result.userId));
  }

  async deleteAllDevices(req: Request, res: Response) {
    const result = await this.jwtService.getUserIdByToken(
      req.cookies.refreshToken
    );
    if (result)
      await this.deviceService.deleteAllDevices(result.userId, result.deviceId);
    res.sendStatus(No_Content);
  }

  async deleteCurrentDevice(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ) {
    const result = await this.jwtService.getUserIdByToken(
      req.cookies.refreshToken
    );
    const deviceId = await this.deviceService.checkDeviceId(req.params.id);
    if (result && deviceId) {
      const response = await this.deviceService.deleteDevice(
        req.params.id,
        result.userId
      );
      if (response) return res.sendStatus(No_Content);
      if (!response) return res.sendStatus(Forbidden);
    }
    return res.sendStatus(Not_Found);
  }
}

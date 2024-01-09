import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithParams } from "../types/types";
import { checkCookieMiddleware } from "../middleware/validation/auth-validation";
import { apiConnectMiddleware } from "../middleware/api-connects-middleware";
import { DeviceService, JwtService } from "../services";

export const devicesRoute = Router({});

const { No_Content, OK, Not_Found, Forbidden } = HTTPS_ANSWERS;

class DevicesController {
  deviceService: DeviceService;
  jwtService: JwtService;

  constructor() {
    this.deviceService = new DeviceService();
    this.jwtService = new JwtService();
  }

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

const devicesControllerInstance = new DevicesController();

devicesRoute.get(
  "/devices",
  checkCookieMiddleware,
  devicesControllerInstance.getAllDevices.bind(devicesControllerInstance)
);

devicesRoute.delete(
  "/devices",
  checkCookieMiddleware,
  devicesControllerInstance.deleteAllDevices.bind(devicesControllerInstance)
);

devicesRoute.delete(
  "/devices/:id",
  apiConnectMiddleware,
  checkCookieMiddleware,
  devicesControllerInstance.deleteCurrentDevice.bind(devicesControllerInstance)
);

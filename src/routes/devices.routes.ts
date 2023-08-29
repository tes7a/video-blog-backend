import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { RequestWithParams } from "../types/types";
import { checkCookieMiddleware } from "../middleware/validation/auth-validation";
import { apiConnectMiddleware } from "../middleware/api-connects-middleware";
import { deviceService, jwtService } from "../services";

export const devicesRoute = Router({});

const { No_Content, OK, Not_Found, Forbidden } = HTTPS_ANSWERS;

class DevicesController {
  async getAllDevices(req: Request, res: Response) {
    const result = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (result)
      res.status(OK).send(await deviceService.getAllDevices(result.userId));
  }

  async deleteAllDevices(req: Request, res: Response) {
    const result = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (result)
      await deviceService.deleteAllDevices(result.userId, result.deviceId);
    res.sendStatus(No_Content);
  }

  async deleteCurrentDevice(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ) {
    const result = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    const deviceId = await deviceService.checkDeviceId(req.params.id);
    if (result && deviceId) {
      const response = await deviceService.deleteDevice(
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
  devicesControllerInstance.getAllDevices
);

devicesRoute.delete(
  "/devices",
  checkCookieMiddleware,
  devicesControllerInstance.deleteAllDevices
);

devicesRoute.delete(
  "/devices/:id",
  apiConnectMiddleware,
  checkCookieMiddleware,
  devicesControllerInstance.deleteCurrentDevice
);

import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { deviceService } from "../services/device-service";
import { RequestWithParams } from "../types/types";
import { checkCookieMiddleware } from "../middleware/validation/auth-validation";
import { jwtService } from "../services/jwt-service";
import { apiConnectMiddleware } from "../middleware/api-connects-middleware";

export const devicesRoute = Router({});
const { No_Content, OK, Not_Found, Forbidden } = HTTPS_ANSWERS;

devicesRoute.get(
  "/devices",
  checkCookieMiddleware,
  async (req: Request, res: Response) => {
    const result = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (result)
      res.status(OK).send(await deviceService.getAllDevices(result.userId));
  }
);

devicesRoute.delete(
  "/devices",
  checkCookieMiddleware,
  async (req: Request, res: Response) => {
    const result = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (result) await deviceService.deleteAllDevices(result.userId, result.deviceId);
    res.sendStatus(No_Content);
  }
);

devicesRoute.delete(
  "/devices/:id",
  apiConnectMiddleware,
  checkCookieMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const result = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    const deviceId = await deviceService.checkDeviceId(req.params.id);
    if (result && deviceId) {
      const response = await deviceService.deleteDevice(req.params.id, result.userId);
      if (response) return res.sendStatus(No_Content);
      if (!response) return res.sendStatus(Forbidden);
    }
    return res.sendStatus(Not_Found);
  }
);

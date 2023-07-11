import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { deviceService } from "../services/device-service";
import { RequestWithParams } from "../types/types";
import { inputValidationForCookieMiddleware } from "../middleware/validation/auth-validation";
import { jwtService } from "../services/jwt-service";

export const devicesRoute = Router({});
const { No_Content, OK, Not_Found, Forbidden } = HTTPS_ANSWERS;

devicesRoute.get(
  "/devices",
  inputValidationForCookieMiddleware,
  async (req: Request, res: Response) => {
    const id = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (id) res.status(OK).send(await deviceService.getAllDevices(id));
  }
);

devicesRoute.delete(
  "/devices",
  inputValidationForCookieMiddleware,
  async (req: Request, res: Response) => {
    const id = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (id) await deviceService.deleteAllDevices(id);
    res.sendStatus(No_Content);
  }
);

devicesRoute.delete(
  "/devices/:id",
  inputValidationForCookieMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const userId = await jwtService.getUserIdByToken(req.cookies.refreshToken);
    if (userId) {
      debugger;
      const result = await deviceService.deleteDevice(req.params.id, userId);
      if (result) return res.sendStatus(No_Content);
      if (!result) return res.sendStatus(Forbidden);
    }
    return res.sendStatus(Not_Found);
  }
);

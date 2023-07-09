import { Request, Response, Router } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";
import { deviceService } from "../services/device-service";
import { RequestWithParams } from "../types/types";

export const devicesRoute = Router({});
const { No_Content, OK, Not_Found } = HTTPS_ANSWERS;

devicesRoute.get("/devices", async (req: Request, res: Response) => {
  /// need or don't need send user id for filter your correct devices???
  res.status(OK).send(await deviceService.getAllDevices());
});

devicesRoute.delete("/devices", async (req: Request, res: Response) => {
  /// need or don't need send user id for filter your correct devices???
  await deviceService.deleteAllDevices();
  res.sendStatus(No_Content);
});

devicesRoute.delete(
  "/devices/:id",
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    //need to create response with 403 status ???
    const result = await deviceService.deleteDevice(req.params.id);
    if (result) res.sendStatus(No_Content);

    return res.sendStatus(Not_Found);
  }
);

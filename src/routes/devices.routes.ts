import { Router } from "express";
import { checkCookieMiddleware } from "../middleware/validation/auth-validation";
import { apiConnectMiddleware } from "../middleware/api-connects-middleware";
import { devicesController } from "../compositions";

export const devicesRoute = Router({});

devicesRoute.get(
  "/devices",
  checkCookieMiddleware,
  devicesController.getAllDevices.bind(devicesController)
);

devicesRoute.delete(
  "/devices",
  checkCookieMiddleware,
  devicesController.deleteAllDevices.bind(devicesController)
);

devicesRoute.delete(
  "/devices/:id",
  apiConnectMiddleware,
  checkCookieMiddleware,
  devicesController.deleteCurrentDevice.bind(devicesController)
);

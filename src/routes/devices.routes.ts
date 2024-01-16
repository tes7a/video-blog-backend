import { Router } from "express";
import { devicesController } from "../compositions";
import { apiConnectMiddleware, checkCookieMiddleware } from "../middleware";

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

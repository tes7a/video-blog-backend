import { Router } from "express";
import { testingController } from "../compositions";

export const testingRoute = Router({});

// Reset the database for testing
testingRoute.delete(
  "/all-data",
  testingController.deleteAll.bind(testingController)
);

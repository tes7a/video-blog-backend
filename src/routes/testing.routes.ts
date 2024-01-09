import { Request, Response, Router } from "express";

import {
  BlogModelClass,
  CommentModelClass,
  DeviceModelClass,
  PostModelClass,
  UserModelClass,
} from "../db/db";

export const testingRoute = Router({});

class TestingController {
  async deleteAll(req: Request, res: Response) {
    await Promise.all([
      BlogModelClass.deleteMany({}),
      PostModelClass.deleteMany({}),
      UserModelClass.deleteMany({}),
      CommentModelClass.deleteMany({}),
      DeviceModelClass.deleteMany({}),
    ]);
    return res.sendStatus(204);
  }
}

const testingControllerInstance = new TestingController();

// Reset the database for testing
testingRoute.delete(
  "/all-data",
  testingControllerInstance.deleteAll.bind(testingControllerInstance)
);

import { Request, Response, Router } from "express";

import {
  BlogModelClass,
  CommentModelClass,
  DeviceModelClass,
  PostModelClass,
  UserModelClass,
} from "../db/db";

export const testingRoute = Router({});

// Reset the database for testing
testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  await Promise.all([
    BlogModelClass.deleteMany({}),
    PostModelClass.deleteMany({}),
    UserModelClass.deleteMany({}),
    CommentModelClass.deleteMany({}),
    DeviceModelClass.deleteMany({}),
  ]);
  return res.sendStatus(204);
});

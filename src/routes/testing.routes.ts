import { Request, Response, Router } from "express";

import { blogsDb, commentsDb, devicesDb, postsDb, usersDb } from "../db/db";

export const testingRoute = Router({});

// Reset the database for testing
testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  // videos.length = 0;
  await Promise.all([
    blogsDb.deleteMany({}),
    postsDb.deleteMany({}),
    usersDb.deleteMany({}),
    commentsDb.deleteMany({}),
    devicesDb.deleteMany({}),
  ]);
  return res.sendStatus(204);
});

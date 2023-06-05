import { Request, Response, Router } from "express";

import { blogsDb, commentsDb, postsDb, usersDb } from "../db/db";

export const testingRoute = Router({});

// Reset the database for testing
testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  // videos.length = 0;
  Promise.all([
    blogsDb.deleteMany({}),
    postsDb.deleteMany({}),
    usersDb.deleteMany({}),
    commentsDb.deleteMany({}),
  ]);
  return res.sendStatus(204);
});

import { Request, Response, Router } from "express";
import { videos } from "../db/videos.db";

import { blogsDb, postsDb } from "../db/db";

export const testingRoute = Router({});

// Reset the database for testing
testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  videos.length = 0;
  await blogsDb.deleteMany({});
  await postsDb.deleteMany({});
  return res.sendStatus(204);
});

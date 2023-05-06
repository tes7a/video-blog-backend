import { Request, Response, Router } from "express";
import { videos } from "../db/videos.db";
import { blogs } from "../db/blogs.db";
import { posts } from "../db/posts.db";

export const testingRoute = Router({});

// Reset the database for testing
testingRoute.delete("/all-data", (req: Request, res: Response) => {
  videos.length = 0;
  blogs.length = 0;
  posts.length = 0;
  return res.sendStatus(204);
});

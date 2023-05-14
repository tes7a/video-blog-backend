import bodyParser from "body-parser";
import { videosRoute } from "./routes/video.routes";
import { testingRoute } from "./routes/testing.routes";
import { blogsRoute } from "./routes/blogs.routes";
import { postsRoute } from "./routes/posts.routes";
import { runDb } from "./db/db";

const express = require("express");
export const app = express();
app.use(bodyParser.json());
const port = process.env.port || 3000;

app.use("/videos", videosRoute);
app.use("/testing", testingRoute);
app.use("/blogs", blogsRoute);
app.use("/posts", postsRoute);

const starApp = async () => {
  await runDb();
  if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
};

starApp();

import bodyParser from "body-parser";
import { testingRoute } from "./routes/testing.routes";
import { blogsRoute } from "./routes/blogs.routes";
import { postsRoute } from "./routes/posts.routes";
import { runDb } from "./db/db";
import { usersRoute } from "./routes/users.routes";
import { authRoute } from "./routes/auth.routes";

const express = require("express");
export const app = express();
app.use(bodyParser.json());
const port = process.env.port || 3000;

app.use("/auth", authRoute);
app.use("/testing", testingRoute);
app.use("/blogs", blogsRoute);
app.use("/posts", postsRoute);
app.use("/users", usersRoute);

const starApp = async () => {
  await runDb();
  if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
};

starApp();

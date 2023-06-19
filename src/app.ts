import bodyParser from "body-parser";
import { authRoute } from "./routes/auth.routes";
import { testingRoute } from "./routes/testing.routes";
import { blogsRoute } from "./routes/blogs.routes";
import { postsRoute } from "./routes/posts.routes";
import { usersRoute } from "./routes/users.routes";
import { commentsRoute } from "./routes/comments.routes";

const express = require("express");
export const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/testing", testingRoute);
app.use("/blogs", blogsRoute);
app.use("/posts", postsRoute);
app.use("/users", usersRoute);
app.use("/comments", commentsRoute);
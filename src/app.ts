import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {
  authRoute,
  blogsRoute,
  commentsRoute,
  devicesRoute,
  postsRoute,
  testingRoute,
  usersRoute,
} from "./routes";

const express = require("express");
export const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/testing", testingRoute);
app.use("/blogs", blogsRoute);
app.use("/posts", postsRoute);
app.use("/users", usersRoute);
app.use("/comments", commentsRoute);
app.use("/security", devicesRoute);

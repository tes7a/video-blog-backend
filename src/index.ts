import bodyParser from "body-parser";
import { Request, Response } from "express";
import { testingRoute, videosRoute } from "./routes/video.routes";

const express = require("express");
const app = express();
app.use(bodyParser({}));
const port = 3000;

app.use("/videos", videosRoute);
app.use("/testing", testingRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

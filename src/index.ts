import bodyParser from "body-parser";
import { Request, Response } from "express";
import { videosRoute } from "./routes/video.route";

const express = require("express");
const app = express();
app.use(bodyParser({}));
const port = 3000;

app.use("/videos", videosRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

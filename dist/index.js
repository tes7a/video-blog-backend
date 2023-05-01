"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const video_routes_1 = require("./routes/video.routes");
const express = require("express");
const app = express();
app.use(body_parser_1.default.json());
const port = 3000;
app.use("/videos", video_routes_1.videosRoute);
app.use("/testing", video_routes_1.testingRoute);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

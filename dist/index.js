"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const video_route_1 = require("./routes/video.route");
const express = require("express");
const app = express();
app.use((0, body_parser_1.default)({}));
const port = 3000;
app.use("/videos", video_route_1.videosRoute);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

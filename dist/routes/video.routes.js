"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoute = void 0;
const express_1 = require("express");
const validators_1 = require("../utils/validators");
exports.videosRoute = (0, express_1.Router)({});
let videos = [
    {
        id: 0,
        title: "About my Life",
        author: "Costas",
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: "2023-04-27T17:17:21.510Z",
        publicationDate: "2023-04-27T17:17:21.510Z",
        availableResolutions: ["P144"],
    },
    {
        id: 1,
        title: "Video Blog №1",
        author: "Costas",
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: "2023-05-27T17:17:21.510Z",
        publicationDate: "2023-05-27T17:17:21.510Z",
        availableResolutions: ["P144"],
    },
    {
        id: 2,
        title: "Video Blog №2",
        author: "Costas",
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: "2023-06-27T17:17:21.510Z",
        publicationDate: "2023-06-27T17:17:21.510Z",
        availableResolutions: ["P144"],
    },
];
exports.videosRoute.get("/", (req, res) => {
    res.status(200).send(videos);
});
exports.videosRoute.get("/:id", (req, res) => {
    let video = null;
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            video = videos[i];
        }
    }
    if (!video)
        return res.sendStatus(404);
    res.status(200).send(video);
});
exports.videosRoute.put("/:id", (req, res) => {
    let video = videos.find((v) => v.id === +req.params.id);
    if (video) {
        if ((0, validators_1.validateField)(req.body.title, 40) &&
            (0, validators_1.validateField)(req.body.author, 20)) {
            (video.title = req.body.title),
                (video.author = req.body.author),
                res.status(201).send(video);
        }
    }
    // if(validator(req.body.title, 40)) {
    // } else if(validator(req.body.author, 20)) {
    // }
    res.sendStatus(404);
});
exports.videosRoute.delete("/:id", (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(204);
        }
    }
    res.sendStatus(404);
});

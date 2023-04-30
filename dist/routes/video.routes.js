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
    return res.status(200).send(videos);
});
exports.videosRoute.get("/:id", (req, res) => {
    const video = videos.find((v) => v.id === +req.params.id);
    if (!video)
        return res.sendStatus(404);
    return res.status(200).send(video);
});
exports.videosRoute.put("/:id", (req, res) => {
    let video = videos.find((v) => v.id === +req.params.id);
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate, } = req.body;
    if (video) {
        if ((0, validators_1.FieldValidate)(title, 40) && (0, validators_1.FieldValidate)(author, 20)) {
            if (publicationDate && typeof publicationDate === "string") {
                const date = new Date(publicationDate);
                video.publicationDate = date.toISOString();
            }
            else if (availableResolutions &&
                (0, validators_1.includeResolutionValidate)(availableResolutions)) {
                video.availableResolutions = availableResolutions;
            }
            else if (typeof canBeDownloaded === "boolean") {
                video.canBeDownloaded = canBeDownloaded;
            }
            else if (minAgeRestriction) {
                if ((0, validators_1.AgeValidate)(minAgeRestriction))
                    video.minAgeRestriction = minAgeRestriction;
            }
            video.title = title;
            video.author = author;
            res.status(201).send(video);
            return;
        }
    }
    const invalidTitle = (0, validators_1.errorMessageValidate)(title, 40, "Title");
    const invalidAuthor = (0, validators_1.errorMessageValidate)(author, 20, "Author");
    if (invalidTitle || invalidAuthor) {
        res.status(400).send(invalidTitle || invalidAuthor);
        return;
    }
    return res.sendStatus(404);
});
exports.videosRoute.delete("/:id", (req, res) => {
    if (videos.find((v) => v.id === +req.params.id)) {
        videos.splice(videos.findIndex((v) => v.id === +req.params.id), 1);
        return res.sendStatus(204);
    }
    return res.sendStatus(404);
});

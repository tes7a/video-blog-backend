"use strict";
// Reset the database for testing
videosRoute.delete("/all-date", (req, res) => {
    if (videos) {
        videos = [];
        return res.sendStatus(201);
    }
    return res.sendStatus(404);
});

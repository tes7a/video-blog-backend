import { Request, Response, Router } from "express";
import { validator } from "../utils/validator";

export const videosRoute = Router({});

const videos = [
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
    createdAt: "2023-04-27T17:17:21.510Z",
    publicationDate: "2023-04-27T17:17:21.510Z",
    availableResolutions: ["P144"],
  },
  {
    id: 2,
    title: "Video Blog №2",
    author: "Costas",
    canBeDownloaded: true,
    minAgeRestriction: 18,
    createdAt: "2023-04-27T17:17:21.510Z",
    publicationDate: "2023-04-27T17:17:21.510Z",
    availableResolutions: ["P144"],
  },
];

videosRoute.get("/", (req: Request, res: Response) => {
  res.status(200).send(videos);
});

videosRoute.get("/:id", (req: Request, res: Response) => {
  let video = null;
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === +req.params.id) {
      video = videos[i];
    }
  }
  if (!video) return res.sendStatus(404);
  res.status(200).send(video);
});

videosRoute.put("/:id", (req: Request, res: Response) => {
  console.log();

  let video = null;
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === +req.params.id) video = videos[i];
  }
  if (validator(req.body.title, 40) && validator(req.body.author, 20)) {
    video = {
      title: req.body.title,
      author: req.body.author,
      //... any params
    };
    res.status(201).send(video);
  }

  res.sendStatus(404);
});

videosRoute.delete("/:id", (req: Request, res: Response) => {
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === +req.params.id) {
      videos.splice(i, 1);
      res.sendStatus(204);
    }
  }

  res.sendStatus(404);
});
//some comments for test commit

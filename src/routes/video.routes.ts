import { Request, Response, Router } from "express";
import { validateField } from "../utils/validators";

export const videosRoute = Router({});

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
  let video = videos.find((v) => v.id === +req.params.id);
  if (video) {
    if (
      validateField(req.body.title, 40) &&
      validateField(req.body.author, 20)
    ) {
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

videosRoute.delete("/:id", (req: Request, res: Response) => {
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === +req.params.id) {
      videos.splice(i, 1);
      res.sendStatus(204);
    }
  }

  res.sendStatus(404);
});

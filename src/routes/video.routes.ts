import { Request, Response, Router } from "express";
import {
  AgeValidate,
  errorMessageValidate,
  FieldValidate,
  includeResolutionValidate,
} from "../utils/validators";
import {
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { VideoURIParamsModel } from "../models/VideoURIParamsModel";
import { VideoUpdateModel } from "../models/VideoUpdateModel";
import { ErrorResponseModel } from "../models/ErrorResponseModel";

export const videosRoute = Router({});

type VideosType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  createdAt: string;
  publicationDate: string;
  availableResolutions: string[];
};

let videos: VideosType[] = [
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

videosRoute.get("/", (req: Request, res: Response<VideosType[]>) => {
  return res.status(200).send(videos);
});

videosRoute.get(
  "/:id",
  (req: RequestWithParams<VideoURIParamsModel>, res: Response) => {
    const video = videos.find((v) => v.id === +req.params.id);
    if (!video) return res.sendStatus(404);
    return res.status(200).send(video);
  }
);

videosRoute.put(
  "/:id",
  (
    req: RequestWithParamsAndBody<VideoURIParamsModel, VideoUpdateModel>,
    res: Response<VideoUpdateModel | ErrorResponseModel>
  ) => {
    let video = videos.find((v) => v.id === +req.params.id);
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;
    if (video) {
      if (FieldValidate(title, 40) && FieldValidate(author, 20)) {
        if (publicationDate && typeof publicationDate === "string") {
          const date = new Date(publicationDate);
          video.publicationDate = date.toISOString();
        } else if (
          availableResolutions &&
          includeResolutionValidate(availableResolutions)
        ) {
          video.availableResolutions = availableResolutions;
        } else if (typeof canBeDownloaded === "boolean") {
          video.canBeDownloaded = canBeDownloaded;
        } else if (minAgeRestriction) {
          if (AgeValidate(minAgeRestriction))
            video.minAgeRestriction = minAgeRestriction;
        }
        video.title = title;
        video.author = author;
        res.status(201).send(video);
        return;
      }
    }

    const invalidTitle = errorMessageValidate(
      title,
      40,
      "Title"
    ) as ErrorResponseModel;
    const invalidAuthor = errorMessageValidate(
      author,
      20,
      "Author"
    ) as ErrorResponseModel;
    if (invalidTitle || invalidAuthor) {
      res.status(400).send(invalidTitle || invalidAuthor);
      return;
    }

    return res.sendStatus(404);
  }
);

videosRoute.delete(
  "/:id",
  (req: RequestWithParams<VideoURIParamsModel>, res: Response) => {
    if (videos.find((v) => v.id === +req.params.id)) {
      videos.splice(
        videos.findIndex((v) => v.id === +req.params.id),
        1
      );
      return res.sendStatus(204);
    }

    return res.sendStatus(404);
  }
);

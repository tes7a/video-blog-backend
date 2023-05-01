import { Request, Response, Router } from "express";
import {
  AgeValidate,
  errorMessageValidate,
  FieldValidate,
  includeResolutionValidate,
} from "../utils/validators";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../types";
import { VideoURIParamsModel } from "../models/VideoURIParamsModel";
import { VideoUpdateModel } from "../models/VideoUpdateModel";
import { ErrorResponseModel } from "../models/ErrorResponseModel";
import { VideoCreateModel } from "../models/VideoCreateModel";

export type VideosType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: string[] | null;
};

export let videos: VideosType[] = [
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

export const videosRoute = Router({});
export const testingRoute = Router({});

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

videosRoute.post(
  "/",
  (
    req: RequestWithBody<VideoCreateModel>,
    res: Response<VideoUpdateModel | ErrorResponseModel>
  ) => {
    const { title, author, availableResolutions } = req.body;
    let errorMessage;
    if (FieldValidate(title, 40) && FieldValidate(author, 20)) {
      const createdVideo = {
        id: +new Date(),
        author,
        title,
        availableResolutions:
          availableResolutions &&
          includeResolutionValidate(availableResolutions)
            ? availableResolutions
            : null,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
      };
      videos.push(createdVideo);
      return res.status(201).send(createdVideo);
    }
    errorMessage =
      (errorMessageValidate(author, 20, "Author") as ErrorResponseModel) ||
      (errorMessageValidate(title, 40, "Title") as ErrorResponseModel);

    if (errorMessage) {
      return res.status(400).send(errorMessage);
    }
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
          video.publicationDate = new Date(publicationDate).toISOString();
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

// Reset the database for testing
testingRoute.delete("/all-date", (req: Request, res: Response) => {
  if (videos) {
    videos = [];
    return res.sendStatus(201);
  }
  return res.sendStatus(404);
});

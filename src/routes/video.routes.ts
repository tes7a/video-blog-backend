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
    errorMessage = errorMessageValidate(
      {
        valueTitle: title,
        valueAuthor: author,
        valueResolution: availableResolutions,
      },
      {
        lengthTitle: 40,
        lengthAuthor: 20,
      },
      {
        title: "title",
        author: "author",
        availableResolutions: "availableResolutions",
      }
    );
    if (FieldValidate(title, 40) && FieldValidate(author, 20)) {
      const nextDay = new Date();
      nextDay.setDate(new Date().getDate() + 1);
      const createdVideo = {
        id: +new Date(),
        author,
        title,
        availableResolutions:
          availableResolutions &&
          includeResolutionValidate(availableResolutions)
            ? availableResolutions
            : null,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: nextDay.toISOString(),
      };
      videos.push(createdVideo);
      return res.status(201).send(createdVideo);
    }

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
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;
    let video = videos.find((v) => v.id === +req.params.id);
    let errorMessage;
    errorMessage = errorMessageValidate(
      {
        valueTitle: title,
        valueAuthor: author,
        valueResolution: availableResolutions,
        valueAge: minAgeRestriction,
        valueCanBeDownloaded: canBeDownloaded,
      },
      {
        lengthTitle: 40,
        lengthAuthor: 20,
      },
      {
        title: "title",
        author: "author",
        availableResolutions: "availableResolutions",
        minAgeRestriction: "minAgeRestriction",
        canBeDownloaded: "canBeDownloaded",
      }
    );
    if (video) {
      if (errorMessage.errorsMessages.length > 0) {
        return res.status(400).send(errorMessage);
      }
      if (errorMessage.errorsMessages) {
        if (publicationDate && typeof publicationDate === "string") {
          video.publicationDate = new Date(publicationDate).toISOString();
        }
        video.availableResolutions = availableResolutions
          ? availableResolutions
          : video.availableResolutions;
        video.canBeDownloaded = canBeDownloaded
          ? canBeDownloaded
          : video.canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction
          ? minAgeRestriction
          : video.minAgeRestriction;

        video.title = title;
        video.author = author;
        res.status(204).send(video);
        return;
      }
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
testingRoute.delete("/all-data", (req: Request, res: Response) => {
  videos = [];
  return res.sendStatus(204);
});

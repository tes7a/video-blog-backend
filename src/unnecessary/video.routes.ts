// import { Request, Response, Router } from "express";
// import { errorMessageValidate } from "../utils/validators";
// import {
//   RequestWithBody,
//   RequestWithParams,
//   RequestWithParamsAndBody,
// } from "../types";
// import { VideosType, videos } from "../db/videos.db";
// import { VideoCreateModel } from "../models/videos-models/VideoCreateModel";
// import { VideoUpdateModel } from "../models/videos-models/VideoUpdateModel";
// import { URIParamsModel } from "../models/universal/URIParamsModel";

// export const videosRoute = Router({});

// videosRoute.get("/", (req: Request, res: Response<VideosType[]>) => {
//   return res.status(200).send(videos);
// });

// videosRoute.get(
//   "/:id",
//   (req: RequestWithParams<URIParamsModel>, res: Response) => {
//     const video = videos.find((v) => v.id === +req.params.id);
//     if (!video) return res.sendStatus(404);
//     return res.status(200).send(video);
//   }
// );

// videosRoute.post(
//   "/",
//   (
//     req: RequestWithBody<VideoCreateModel>,
//     res: Response<VideoUpdateModel | any>
//   ) => {
//     const { title, author, availableResolutions } = req.body;
//     let errorMessage;
//     errorMessage = errorMessageValidate(
//       {
//         valueTitle: title,
//         valueAuthor: author,
//         valueResolution: availableResolutions,
//       },
//       {
//         lengthTitle: 40,
//         lengthAuthor: 20,
//       },
//       {
//         title: "title",
//         author: "author",
//         availableResolutions: "availableResolutions",
//       }
//     );
//     if (errorMessage.errorsMessages!.length > 0) {
//       return res.status(400).send(errorMessage);
//     }
//     const nextDay = new Date();
//     nextDay.setDate(new Date().getDate() + 1);
//     const createdVideo = {
//       id: +new Date(),
//       author,
//       title,
//       availableResolutions: availableResolutions ? availableResolutions : null,
//       canBeDownloaded: false,
//       minAgeRestriction: null,
//       createdAt: new Date().toISOString(),
//       publicationDate: nextDay.toISOString(),
//     };
//     videos.push(createdVideo);
//     return res.status(201).send(createdVideo);
//   }
// );

// videosRoute.put(
//   "/:id",
//   (
//     req: RequestWithParamsAndBody<URIParamsModel, VideoUpdateModel>,
//     res: Response<VideoUpdateModel | any>
//   ) => {
//     const {
//       title,
//       author,
//       availableResolutions,
//       canBeDownloaded,
//       minAgeRestriction,
//       publicationDate,
//     } = req.body;
//     let video = videos.find((v) => v.id === +req.params.id);
//     let errorMessage;
//     errorMessage = errorMessageValidate(
//       {
//         valueTitle: title,
//         valueAuthor: author,
//         valueResolution: availableResolutions,
//         valueAge: minAgeRestriction,
//         valueCanBeDownloaded: canBeDownloaded,
//         valueDate: publicationDate,
//       },
//       {
//         lengthTitle: 40,
//         lengthAuthor: 20,
//       },
//       {
//         title: "title",
//         author: "author",
//         availableResolutions: "availableResolutions",
//         minAgeRestriction: "minAgeRestriction",
//         canBeDownloaded: "canBeDownloaded",
//         publicationDate: "publicationDate",
//       }
//     );
//     if (errorMessage.errorsMessages.length > 0) {
//       return res.status(400).send(errorMessage);
//     }
//     if (video) {
//       video.publicationDate = publicationDate
//         ? new Date(publicationDate).toISOString()
//         : video.publicationDate;
//       video.availableResolutions = availableResolutions
//         ? availableResolutions
//         : video.availableResolutions;
//       video.canBeDownloaded = canBeDownloaded
//         ? canBeDownloaded
//         : video.canBeDownloaded;
//       video.minAgeRestriction = minAgeRestriction
//         ? minAgeRestriction
//         : video.minAgeRestriction;

//       video.title = title;
//       video.author = author;
//       res.status(204).send(video);
//       return;
//     }

//     return res.sendStatus(404);
//   }
// );

// videosRoute.delete(
//   "/:id",
//   (req: RequestWithParams<URIParamsModel>, res: Response) => {
//     if (videos.find((v) => v.id === +req.params.id)) {
//       videos.splice(
//         videos.findIndex((v) => v.id === +req.params.id),
//         1
//       );
//       return res.sendStatus(204);
//     }

//     return res.sendStatus(404);
//   }
// );

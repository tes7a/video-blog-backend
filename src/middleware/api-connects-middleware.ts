import { log } from "console";
import { NextFunction, Request, Response } from "express";
import { HTTPS_ANSWERS } from "../utils/https-answers";

interface RequestLog {
  ip: string;
  url: string;
  date: Date;
}

const requestLogs: RequestLog[] = [];

export const apiConnectMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ip, url } = req;
  const currentDate = new Date();

  const countOfConnections =
    requestLogs.filter(
      (r) =>
        r.ip === ip &&
        r.url === url &&
        r.date >= new Date(currentDate.getTime() - 10000)
    ).length + 1;
  log(countOfConnections);

  const limitationNumber = 5;
  requestLogs.push({
    ip,
    url,
    date: currentDate,
  });

  if (countOfConnections > limitationNumber)
    return res.sendStatus(HTTPS_ANSWERS.Too_Many_Requests);

  next();
};

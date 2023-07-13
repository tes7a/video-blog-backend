import { NextFunction, Request, Response } from "express";

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

  const filteredLogs = requestLogs.filter(
    (log) =>
      log.ip === ip &&
      log.url === url &&
      log.date >= new Date(currentDate.getTime() - 10000)
  );

  requestLogs.push({
    ip,
    url,
    date: currentDate,
  });

  next();
};

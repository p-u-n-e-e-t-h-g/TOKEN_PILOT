import type { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
    console.log(`${time} ${req.method} ${req.originalUrl}`);
  });

  next();
}

import type { NextFunction, Request, Response } from "express";

export function logger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    const timestamp = new Date(startTime).toISOString();

    console.log(
      `[${timestamp}]\n${req.method} ${req.originalUrl}\nStatus: ${res.statusCode}\nDuration: ${durationMs}ms`
    );
  });

  next();
}

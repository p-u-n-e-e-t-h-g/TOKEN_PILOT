import { Router } from "express";

export const healthRoute = Router();

healthRoute.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "TokenPilot",
    timestamp: new Date().toISOString()
  });
});

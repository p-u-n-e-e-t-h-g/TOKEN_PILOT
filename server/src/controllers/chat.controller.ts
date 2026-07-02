import type { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chat.service.js";

export const chatController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await chatService.create(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};


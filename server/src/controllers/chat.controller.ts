import type { Request, Response } from "express";
import { env } from "../config/env.js";
import type { ChatService } from "../services/chat.service.js";

type ChatRequestBody = {
  prompt?: unknown;
};

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  async handleChat(req: Request, res: Response): Promise<void> {
    try {
      const { prompt } = req.body as ChatRequestBody;
      const normalizedPrompt = typeof prompt === "string" ? prompt.trim() : "";

      if (!normalizedPrompt) {
        res.status(400).json({
          success: false,
          message: "Prompt is required."
        });
        return;
      }

      const result = await this.chatService.handleChat(normalizedPrompt);
      res.json(result);
    } catch (error) {
      console.error((error as Error).stack ?? error);
      res.status(500).json({
        success: false,
        message: env.DEBUG_MODE ? (error as Error).message : "Unexpected error."
      });
    }
  }
}

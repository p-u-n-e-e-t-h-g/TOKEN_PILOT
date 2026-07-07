import { Router } from "express";
import type { ChatController } from "../controllers/chat.controller.js";

export function createChatRoute(chatController: ChatController): Router {
  const router = Router();

  router.post("/", chatController.handleChat.bind(chatController));

  return router;
}

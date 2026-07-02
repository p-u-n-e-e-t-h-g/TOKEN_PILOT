import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";

export const chatRoute = Router();

chatRoute.post("/", chatController.create);


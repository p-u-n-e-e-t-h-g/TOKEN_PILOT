import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { createChatRoute } from "./routes/chat.route.js";
import { healthRoute } from "./routes/health.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { ChatController } from "./controllers/chat.controller.js";
import { ChatService } from "./services/chat.service.js";
import { RequestAnalyzerService } from "./services/RequestAnalyzerService.js";
import { OllamaProvider } from "./providers/OllamaProvider.js";

const provider = new OllamaProvider();
const requestAnalyzerService = new RequestAnalyzerService(provider);
const chatService = new ChatService(requestAnalyzerService);
const chatController = new ChatController(chatService);

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/health", healthRoute);
app.use("/chat", createChatRoute(chatController));

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`TokenPilot server listening on port ${env.PORT}`);
});

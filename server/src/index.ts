import cors from "cors";
import express from "express";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { env } from "./config/env.js";
import { createChatRoute } from "./routes/chat.route.js";
import { createAgentRoute } from "./routes/agent.route.js";
import { healthRoute } from "./routes/health.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { ChatController } from "./controllers/chat.controller.js";
import { AgentController } from "./controllers/agent.controller.js";
import { ChatService } from "./services/chat.service.js";
import { AgentService } from "./services/agent.service.js";
import { RequestAnalyzerService } from "./services/RequestAnalyzerService.js";
import { OllamaProvider } from "./providers/OllamaProvider.js";
import { ProviderRegistry } from "./registry/ProviderRegistry.js";
import { DecisionEngine } from "./decision/DecisionEngine.js";

type ProviderConfig = {
  providerName: string;
  model: string;
  supportsVision: boolean;
  supportsReasoning: boolean;
  supportsLongContext: boolean;
  supportsWeb: boolean;
  isLocal: boolean;
  estimatedLatencyMs: number;
  estimatedCostPerMillionTokens: number;
  maxContext: number;
};

const providersConfigPath = resolve(process.cwd(), "config", "providers.json");
const providersConfig = JSON.parse(readFileSync(providersConfigPath, "utf8")) as ProviderConfig[];

const providerRegistry = new ProviderRegistry();
const ollamaProvider = new OllamaProvider();

for (const config of providersConfig) {
  if (config.providerName === "Ollama") {
    providerRegistry.register(ollamaProvider, config);
  }
}

const requestAnalyzerService = new RequestAnalyzerService(ollamaProvider);
const decisionEngine = new DecisionEngine(providerRegistry);
const chatService = new ChatService(requestAnalyzerService, decisionEngine, providerRegistry);
const agentService = new AgentService(decisionEngine, providerRegistry);
const chatController = new ChatController(chatService);
const agentController = new AgentController(agentService);

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/health", healthRoute);
app.use("/chat", createChatRoute(chatController));
app.use("/agent", createAgentRoute(agentController));

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`TokenPilot server listening on port ${env.PORT}`);
});

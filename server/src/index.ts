import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { chatRoute } from "./routes/chat.route.js";
import { healthRoute } from "./routes/health.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/health", healthRoute);
app.use("/chat", chatRoute);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`TokenPilot server listening on port ${env.PORT}`);
});

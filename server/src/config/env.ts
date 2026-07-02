import dotenv from "dotenv";

dotenv.config();

const API_KEYS = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
  OLLAMA_API_KEY: process.env.OLLAMA_API_KEY ?? ""
};

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  API_KEYS,
  DEBUG_MODE: process.env.DEBUG_MODE === "true"
};

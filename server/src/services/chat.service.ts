import type { ChatRequest } from "../types/index.js";

export const chatService = {
  async create(_request: ChatRequest) {
    return {
      message: "Hello from TokenPilot"
    };
  }
};

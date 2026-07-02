import type { ChatRequest, ChatResponse, ProviderInfo } from "../types/index.js";

export interface Provider {
  info: ProviderInfo;
  chat(request: ChatRequest): Promise<ChatResponse>;
}


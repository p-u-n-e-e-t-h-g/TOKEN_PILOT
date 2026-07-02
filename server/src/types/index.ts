export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  provider?: string;
  model?: string;
};

export type ChatResponse = {
  content: string;
  provider: string;
  model: string;
};

export type ProviderInfo = {
  id: string;
  name: string;
  models: string[];
};


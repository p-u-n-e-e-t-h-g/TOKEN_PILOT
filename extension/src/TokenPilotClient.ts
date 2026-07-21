export type AgentEditPayload = {
  instruction: string;
  language: string;
  selection: string;
};

export type AgentEditResult = {
  replacement: string;
};

export class TokenPilotClient {
  constructor(private readonly baseUrl = "http://localhost:3001") {}

  async edit(payload: AgentEditPayload): Promise<AgentEditResult> {
    const response = await fetch(`${this.baseUrl}/agent/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`TokenPilot request failed: ${response.status} ${message}`);
    }

    return (await response.json()) as AgentEditResult;
  }
}

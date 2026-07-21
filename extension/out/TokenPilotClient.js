"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPilotClient = void 0;
class TokenPilotClient {
    baseUrl;
    constructor(baseUrl = "http://localhost:3001") {
        this.baseUrl = baseUrl;
    }
    async edit(payload) {
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
        return (await response.json());
    }
}
exports.TokenPilotClient = TokenPilotClient;

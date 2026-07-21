import type { Request, Response } from "express";
import { env } from "../config/env.js";
import type { AgentService, AgentEditRequest } from "../services/agent.service.js";

type AgentEditBody = Partial<AgentEditRequest>;

export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  async handleEdit(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as AgentEditBody;
      const instruction = typeof body.instruction === "string" ? body.instruction.trim() : "";
      const language = typeof body.language === "string" ? body.language.trim() : "";
      const selection = typeof body.selection === "string" ? body.selection.trim() : "";

      if (!instruction || !language || !selection) {
        res.status(400).json({
          success: false,
          message: "instruction, language, and selection are required."
        });
        return;
      }

      const result = await this.agentService.edit({ instruction, language, selection });
      res.json(result);
    } catch (error) {
      console.error((error as Error).stack ?? error);
      res.status(500).json({
        success: false,
        message: env.DEBUG_MODE ? (error as Error).message : "Unexpected error."
      });
    }
  }
}

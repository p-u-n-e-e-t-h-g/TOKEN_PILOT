import { Router } from "express";
import type { AgentController } from "../controllers/agent.controller.js";

export function createAgentRoute(agentController: AgentController): Router {
  const router = Router();

  router.post("/edit", agentController.handleEdit.bind(agentController));

  return router;
}

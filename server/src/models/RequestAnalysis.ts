import { Difficulty } from "./Difficulty.js";
import { TaskType } from "./TaskType.js";

export interface RequestAnalysis {
  task: TaskType;
  language: string;
  difficulty: Difficulty;
  needsWeb: boolean;
  needsVision: boolean;
  estimatedTokens: number;
  preferredCapabilities: string[];
  requiresReasoning: boolean;
  requiresLongContext: boolean;
  confidence: number;
  reason: string;
}

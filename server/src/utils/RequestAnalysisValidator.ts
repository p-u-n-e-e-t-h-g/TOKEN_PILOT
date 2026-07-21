import { Difficulty } from "../models/Difficulty.js";
import { TaskType } from "../models/TaskType.js";
import type { RequestAnalysis } from "../models/RequestAnalysis.js";

export function validateRequestAnalysis(value: unknown): value is RequestAnalysis {
  if (typeof value !== "object" || value === null) {
    throw new Error("Request analysis must be a JSON object.");
  }

  const candidate = value as Record<string, unknown>;

  if (!Object.values(TaskType).includes(candidate.task as TaskType)) {
    throw new Error(
      `Invalid request analysis: task must be one of ${Object.values(TaskType).join(", ")}.`
    );
  }

  if (!Object.values(Difficulty).includes(candidate.difficulty as Difficulty)) {
    throw new Error("Invalid request analysis: difficulty must be easy, medium, or hard.");
  }

  if (typeof candidate.language !== "string") {
    throw new Error("Invalid request analysis: language must be a string.");
  }

  if (typeof candidate.confidence !== "number" || candidate.confidence < 0 || candidate.confidence > 1) {
    throw new Error("Invalid request analysis: confidence must be a number between 0 and 1.");
  }

  if (
    typeof candidate.estimatedTokens !== "number" ||
    !Number.isInteger(candidate.estimatedTokens) ||
    candidate.estimatedTokens <= 0 ||
    candidate.estimatedTokens > 4000
  ) {
    throw new Error("Invalid request analysis: estimatedTokens must be an integer between 1 and 4000.");
  }

  if (!Array.isArray(candidate.preferredCapabilities) || candidate.preferredCapabilities.length === 0) {
    throw new Error("Invalid request analysis: preferredCapabilities must be a non-empty array of strings.");
  }

  if (!candidate.preferredCapabilities.every((item) => typeof item === "string" && item.trim().length > 0)) {
    throw new Error("Invalid request analysis: preferredCapabilities must contain only non-empty strings.");
  }

  if (typeof candidate.requiresReasoning !== "boolean") {
    throw new Error("Invalid request analysis: requiresReasoning must be a boolean.");
  }

  if (typeof candidate.requiresLongContext !== "boolean") {
    throw new Error("Invalid request analysis: requiresLongContext must be a boolean.");
  }

  if (typeof candidate.confidence !== "number" || candidate.confidence < 0 || candidate.confidence > 1) {
    throw new Error("Invalid request analysis: confidence must be a number between 0 and 1.");
  }

  if (typeof candidate.reason !== "string" || candidate.reason.trim().length === 0) {
    throw new Error("Invalid request analysis: reason must be a non-empty string.");
  }

  return true;
}

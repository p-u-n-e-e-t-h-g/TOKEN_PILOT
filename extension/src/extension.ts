import * as vscode from "vscode";
import { ImproveCodeCommand } from "./ImproveCodeCommand.js";
import { TokenPilotClient } from "./TokenPilotClient.js";

export function activate(context: vscode.ExtensionContext): void {
  const command = new ImproveCodeCommand(new TokenPilotClient());
  const register = (commandId: string, preset?: "Explain Code" | "Refactor Code" | "Generate Tests" | "Add Comments" | "Optimize Performance" | "Fix Bug") => {
    const disposable = vscode.commands.registerCommand(commandId, () => command.execute(preset));
    context.subscriptions.push(disposable);
  };

  register("tokenpilot.improveSelectedCode");
  register("tokenpilot.explainCode", "Explain Code");
  register("tokenpilot.refactorCode", "Refactor Code");
  register("tokenpilot.generateTests", "Generate Tests");
  register("tokenpilot.addComments", "Add Comments");
  register("tokenpilot.optimizePerformance", "Optimize Performance");
  register("tokenpilot.fixBug", "Fix Bug");
}

export function deactivate(): void {}

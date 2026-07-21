"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImproveCodeCommand = void 0;
const vscode = __importStar(require("vscode"));
class ImproveCodeCommand {
    client;
    constructor(client) {
        this.client = client;
    }
    async execute(preset) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage("TokenPilot: No active editor found.");
            return;
        }
        const documentUri = editor.document.uri;
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        if (!selectedText.trim()) {
            vscode.window.showWarningMessage("TokenPilot: Please select code first.");
            return;
        }
        const instruction = preset ??
            (await vscode.window.showInputBox({
                title: "TokenPilot",
                prompt: "Describe how TokenPilot should transform the selected code",
                placeHolder: "Explain Code, Refactor Code, Generate Tests, Add Comments, Optimize Performance, Fix Bug"
            }));
        if (!instruction) {
            return;
        }
        const result = await this.client.edit({
            instruction,
            language: editor.document.languageId,
            selection: selectedText
        });
        const preview = await this.createPreviewDocument(editor.document.languageId, editor.document.getText(), editor.selection, result.replacement);
        await vscode.commands.executeCommand("vscode.diff", editor.document.uri, preview.uri, "TokenPilot Preview");
        const confirmation = await vscode.window.showInformationMessage("Apply TokenPilot changes?", { modal: true }, "Apply", "Cancel");
        if (confirmation !== "Apply") {
            return;
        }
        const reopenedDocument = await vscode.workspace.openTextDocument(documentUri);
        const freshEditor = await vscode.window.showTextDocument(reopenedDocument, {
            preview: false,
            preserveFocus: false
        });
        freshEditor.selection = selection;
        freshEditor.revealRange(selection);
        try {
            await freshEditor.edit((editBuilder) => {
                editBuilder.replace(selection, result.replacement);
            });
        }
        catch {
            const edit = new vscode.WorkspaceEdit();
            edit.replace(documentUri, selection, result.replacement);
            await vscode.workspace.applyEdit(edit);
            const confirmedEditor = vscode.window.activeTextEditor;
            if (confirmedEditor && confirmedEditor.document.uri.toString() === documentUri.toString()) {
                confirmedEditor.selection = selection;
                confirmedEditor.revealRange(selection);
            }
        }
    }
    async createPreviewDocument(languageId, originalFileText, selection, replacement) {
        const originalFileLines = originalFileText.split(/\r?\n/);
        const before = originalFileLines.slice(0, selection.start.line);
        const after = originalFileLines.slice(selection.end.line + 1);
        const selectedStartLine = originalFileLines[selection.start.line] ?? "";
        const selectedEndLine = originalFileLines[selection.end.line] ?? selectedStartLine;
        const beforeSelection = selectedStartLine.slice(0, selection.start.character);
        const afterSelection = selectedEndLine.slice(selection.end.character);
        const replacementLines = replacement.split(/\r?\n/);
        const replacementBlock = replacementLines.length === 1
            ? `${beforeSelection}${replacementLines[0]}${afterSelection}`
            : [
                `${beforeSelection}${replacementLines[0]}`,
                ...replacementLines.slice(1, -1),
                `${replacementLines[replacementLines.length - 1]}${afterSelection}`
            ];
        const updatedLines = [
            ...before,
            ...(Array.isArray(replacementBlock) ? replacementBlock : [replacementBlock]),
            ...after
        ];
        return vscode.workspace.openTextDocument({
            content: updatedLines.join("\n"),
            language: languageId
        });
    }
}
exports.ImproveCodeCommand = ImproveCodeCommand;

declare module "vscode" {
  export interface ExtensionContext {
    subscriptions: { dispose(): void }[];
  }

  export interface Position {
    line: number;
    character: number;
  }

  export interface Selection {
    start: Position;
    end: Position;
  }

  export interface TextDocument {
    languageId: string;
    getText(selection?: Selection): string;
  }

  export interface TextEditorEdit {
    replace(selection: Selection, newText: string): void;
  }

  export interface TextEditor {
    document: TextDocument;
    selection: Selection;
    edit(callback: (editBuilder: TextEditorEdit) => void): Thenable<boolean>;
  }

  export interface QuickPickItem {
    label: string;
  }

  export interface ShowInputBoxOptions {
    title?: string;
    prompt?: string;
    placeHolder?: string;
  }

  export interface MessageItem {
    title: string;
  }

  export interface Uri {}

  export interface Window {
    activeTextEditor?: TextEditor;
    showWarningMessage(message: string): Thenable<void>;
    showInputBox(options?: ShowInputBoxOptions): Thenable<string | undefined>;
    showInformationMessage(
      message: string,
      options: { modal: true },
      ...items: string[]
    ): Thenable<string | undefined>;
  }

  export interface Workspace {
    openTextDocument(options: { content: string; language: string }): Thenable<TextDocument>;
  }

  export namespace commands {
    function registerCommand(id: string, callback: () => void | Thenable<void>): { dispose(): void };
    function executeCommand(command: string, ...rest: unknown[]): Thenable<unknown>;
  }

  export const window: Window;
  export const workspace: Workspace;
}


// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "xz-generate-id" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerTextEditorCommand(
    "xz-generate-id.generate",
    () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        return;
      }
      activeTextEditor.edit((editBuilder) => {
        activeTextEditor.selections?.forEach((selection) => {
          editBuilder.replace(
            selection,
            Math.random().toString(36).slice(2, 10)
          );
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

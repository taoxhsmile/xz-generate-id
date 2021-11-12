import * as vscode from "vscode";
import registerExtensions from "./extensions/index";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "xz-generate-id" is now active!'
  );

  // 注册扩展功能
  registerExtensions(context);
}

export function deactivate() {}

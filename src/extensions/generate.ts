import * as vscode from "vscode";

// 生成唯一随机id
export default vscode.commands.registerTextEditorCommand(
  "xz-generate-id.generate",
  () => {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor) {
      return;
    }
    activeTextEditor.edit((editBuilder) => {
      activeTextEditor.selections?.forEach((selection) => {
        editBuilder.replace(selection, Math.random().toString(36).slice(2, 10));
      });
    });
  }
);

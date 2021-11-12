import * as vscode from "vscode";
import * as t from "@babel/types";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { isValidDocumentLanguage } from "../utils";

// 移除未使用的定义
export default vscode.commands.registerTextEditorCommand(
  "xz-generate-id.rm-js-nouse",
  () => {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor) {
      return;
    }

    if (!isValidDocumentLanguage(activeTextEditor.document)) {
      return;
    }

    const code = activeTextEditor.document.getText();

    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    traverse(ast, {
      VariableDeclaration(path) {
        const { node } = path;
        const { declarations } = node;

        node.declarations = declarations.filter((declaration) => {
          const { id } = declaration;
          // scope.getBinding(name) 获取当前所有绑定
          // scope.getBinding(name).referenced 绑定是否被引用
          // scope.getBinding(name).constantViolations 获取当前所有绑定修改
          // scope.getBinding(name).referencePaths  获取当前所有绑定路径
          if (t.isObjectPattern(id)) {
            id.properties = id.properties.filter((property) => {
              const binding = path.scope.getBinding((property as any).key.name);
              return !!binding?.referenced;
            });
            return id.properties.length > 0;
          } else {
            const binding = path.scope.getBinding((id as any).name);
            return !!binding?.referenced;
          }
        });

        if (node.declarations.length === 0) {
          path.remove();
        }
      },
      ImportDeclaration(path) {
        const { node } = path;
        const { specifiers } = node;
        if (!specifiers.length) return;
        node.specifiers = specifiers.filter((specifier) => {
          const { local } = specifier;
          const binding = path.scope.getBinding(local.name);
          return !!binding?.referenced;
        });
        if (node.specifiers.length === 0) {
          path.remove();
        }
      },
      FunctionDeclaration(path) {
        const { node } = path;
        const { id } = node;
        const binding = path.scope.getBinding(id!.name);
        if (!binding?.referenced) {
          path.remove();
        }
      },
    });

    activeTextEditor.edit((editBuilder) => {
      editBuilder.replace(
        new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(activeTextEditor.document.lineCount + 1, 0)
        ),
        generate(ast).code
      );
    });
  }
);

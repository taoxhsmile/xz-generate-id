import * as vscode from "vscode";
import generateExtension from "./generate";
import rmJsNouseExtension from "./rmJsNouse";

export default function registerExtensions(context: vscode.ExtensionContext) {
  context.subscriptions.push(generateExtension);
  context.subscriptions.push(rmJsNouseExtension);
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import childProcess from "node:child_process";
import util from "node:util";

const exec = util.promisify(childProcess.exec);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-react-compiler-preview" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "vscode-react-compiler-preview.showPreview",
    async () => {
      try {
        const fileUri = vscode.window.activeTextEditor?.document.uri;
        if (fileUri === undefined) {
          return;
        }
        const folder = vscode.workspace.getWorkspaceFolder(fileUri);
        if (!folder) {
          return;
        }
        const { stdout, stderr } = await exec(
          `(cd ${folder.uri.fsPath} && ./node_modules/.bin/babel ${fileUri.fsPath})`,
        );
        if (stderr) {
          vscode.window.showErrorMessage(stderr);
          return;
        }

        const document = await vscode.workspace.openTextDocument({
          content: stdout,
          language: "javascript",
        });
        await vscode.window.showTextDocument(document, {
          viewColumn: vscode.ViewColumn.Beside,
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed\n",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

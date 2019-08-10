// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SlowBuffer } from 'buffer';
import { stringify } from 'querystring';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "addconlog" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.CreateConsoleLogs', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let skip = false;
			let startFn = 0;
			let readText = document.getText();
			let start = readText.indexOf("(");
			while(start > 0){
				let idx2 = start;
				let idx = start;
				let limit = 0;
				while (idx2 > 0 && limit < 70)
				{
					limit++;
					let data = readText[idx2];
					let stdata = readText.substring(idx2,idx - idx2);
					if (data === '.' || data === ')' || data === '}'){
						skip = true;
						break;
					}
					if(data === ' '){
						startFn = idx2 + 1;
						let rts = readText[idx2 - 1];
						if(rts === '=' || rts === 'f' || rts === 'r' || rts === 'h' || rts === 'n'){
							skip = true;
						}
						break;
					}
					idx2--;
				}
				let eol = readText.indexOf("\n", idx);
				let restOf = readText.substring(start, eol - start);
				if (restOf.indexOf("{") < 0){
					skip = true;
				}
				if(skip){
					start = readText.indexOf("(", eol);
					skip = false;
					continue;
				}
				let sta = readText.substring(startFn,idx - startFn);
				let app = "console.log(\"" + sta + "\";\r\n";
				let p = editor.document.positionAt(eol);	
				editor.edit(editBuilder => {
					
					editBuilder.insert(p, app);
					eol += app.length;
					start = readText.indexOf("(", eol);
				});
				//readText = insert(readText,app,eol );
				
			
			}
			//let selection = editor.selection;

			// Get the word within the selection
/* 			let word = document.getText(selection);
			let reversed = word.split('').reverse().join('');
			editor.edit(editBuilder => {
				editBuilder.replace(selection, reversed);
			});
 */		}

		
	});
	
	context.subscriptions.push(disposable);
}
function insert(base: string, argument: string, index: number): string{
	const first = base.substring(0, index);
	const second = base.substring(index, base.length - index);
	return first + argument + second;
}
// this method is called when your extension is deactivated
export function deactivate() {}

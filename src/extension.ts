// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SlowBuffer } from 'buffer';
import { stringify } from 'querystring';
import fs = require('fs');
import path = require('path');

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
		let fs = require('fs');
		// Display a message box to the user
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			
			let readText = document.getText();
			let tracking = 0;
			let lines = mysplit(readText, "\n");
			let ch:Checked = {track: tracking, check: false, fn: "" };
			for(let idx = 0; idx < lines.length; idx++ ){
				let line = lines[idx];
				if(line.length < 2){
					continue;
				}
					ch = check(line, idx, lines);
					
					idx = ch.track;
					if(ch.check){
						ch.track += 1;
						idx = ch.track;
						let app = "console.log(\"" + ch.fn + "\");\r\n";

						let os = getIndex(lines, ch.track, readText);
						let newText = insert(readText, os, app);
						readText = newText;
						lines = mysplit(readText,"\n");
					}

			}
			fs.writeFile(document.fileName, readText);
			
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

function mysplit(base: string, delim: string): string [] {
	let list = [];
	let idr = base.indexOf("\n");
	let st = 0;
	while(idr > 0){
		list.push(base.substring(st, idr + 1));
		st = idr + 1;
		idr = base.indexOf("\n", st);
	}
	return list;
}
function insert(base: string, pos: number, ins: string): string{
	let f = base.substring(0, pos);
	let e = base.substring(pos, base.length);
	return f + ins + e;
}
function getIndex(lines: string[], idx: number, base: string): number{
	let len = 0;
	for(let i = 0; i < idx; i++){
		len += lines[i].length;
	}
	return len;
}
interface Checked {
	track: number;
	check: boolean;
	fn: string;
}
function check(l: string, tracking: number, lines: string[]): Checked {
	let ch:Checked = {track: tracking, check: false, fn: "" };
	if(l.indexOf("interface") >= 0){
		while(ch.track < lines.length){
			let ll = lines[ch.track];
			if(ll.indexOf("}") > 0){
				return ch;
			}
			ch.track += 1;
		}
	}
	if(l.indexOf("/*") >= 0){
		while(tracking < lines.length){
			l = lines[ch.track];
			if(l.indexOf("*/") < 0){
				ch.track+= 1;
			}
			else{
				return ch;
			}
		}
		
	}
	if(l.indexOf("//") >= 0){
		return ch;
	}
	if(l.indexOf("class") >= 0){
		return ch;
	}
	if(l.indexOf("constructor") >= 0){
		return ch;
	}
	if(l.indexOf("if") >= 0){
		return ch;
	}
	if(l.indexOf("for") >= 0){
		return ch;
	}
	if(l.indexOf("while") >= 0){
		return ch;
	}
	if(l.indexOf("=") >= 0){
		return ch;
	}
	if(l.indexOf("const") >= 0){
		return ch;
	}
	if(l.indexOf("let") >= 0){
		return ch;
	}
	if(l.indexOf("(") < 1){
		return ch;
	}
	
	ch.check = true;
	let startfn = l.indexOf("(");
	let ids = l.indexOf("private ");
	if(ids > 0){
		ids+= 8;
		ch.fn = l.substring(ids, startfn);
		return ch;
	}
	
	ids = l.indexOf("public ");
	if(ids > 0){
		ids += 7;
		ch.fn = l.substring(ids, startfn);
		return ch;
	}
	let firstPart = l.substring(0, startfn);
	ch.fn = firstPart.replace(" ", "");
	if(l.indexOf("{")){	
		return ch;
	}
	let ll = lines[tracking + 1];
	if(ll.indexOf("{")){
		ch.track += 1;
	}

	return ch;

}
// this method is called when your extension is deactivated
export function deactivate() {}

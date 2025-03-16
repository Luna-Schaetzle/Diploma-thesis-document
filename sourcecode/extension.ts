// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios, { create } from 'axios';
import * as vscode from 'vscode';
import { createStatusbarItem } from './statusBar';
// import { codeComplete } from './codeCompletation';
import { luminaraChat } from './luminaraChat';
import { luminaraChatOllama } from './luminaraChatOllama';
import { createInlineChat } from './inline_chat';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "luminara-coworker" is now active!');
	
	const disposable = vscode.commands.registerCommand('luminara-coworker.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from luminara_coworker!');
	});
			
	createStatusbarItem(context);
	luminaraChat(context);
	luminaraChatOllama(context);
	createInlineChat(context);



	context.subscriptions.push(disposable);
}





// This method is called when your extension is deactivated
export function deactivate() {}





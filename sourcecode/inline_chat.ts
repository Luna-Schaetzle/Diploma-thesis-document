import * as vscode from 'vscode';
import axios from 'axios';

export async function createInlineChat(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('luminara_coworker.startInlineChat', () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('Open a file to start the inline chat.');
      return;
    }

    const position = editor.selection.active;

    // Create a Webview Panel
    const panel = vscode.window.createWebviewPanel(
      'inlineChat', // Identifier
      'Inline Chat', // Title
      vscode.ViewColumn.Beside, // Position
      {
        enableScripts: true, // Allow JavaScript
        retainContextWhenHidden: true, // Keep the webview state
      }
    );

    panel.webview.html = getWebviewContent();

    // Position the chat panel near the cursor
    editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);

    const BASE_PROMPT = 'Only give code answers to programming questions';
    let prompt = BASE_PROMPT;

    // Handle messages from the Webview
    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'sendMessage') {
          const payload = {
            model: 'qwen2.5-coder:0.5b',
            prompt: message.text
            };  

          try {
            const response = await axios.post('http://10.10.11.11:5005/ask_programming_bot', payload );
            const reply = await response.data.choices[0].text;

            editor.edit((editBuilder) => {
              reply.split('```').forEach((reply: string) => {
                editBuilder.insert(position, `\n  # ${reply} \n`);
              });
            });

            // Send the reply to the webview to display it
            panel.webview.postMessage({
              command: 'displayReply',
              text: reply.split('```').map((reply: string) => reply)
            });

          } catch (error) {
            vscode.window.showErrorMessage('Failed to get response from the server.');
          }
        }
      },
      undefined,
      context.subscriptions
    );

    // Dispose of the panel when closed
    panel.onDidDispose(() => {
      vscode.window.showInformationMessage('Chat closed.');
    });
  });

  context.subscriptions.push(disposable);
}

// Webview HTML content
function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inline Chat</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          background: #f3f3f3;
          color: #000;
          height: 100vh;
          overflow: hidden;
        }
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          background: white;
        }
        .messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          background: #f9f9f9;
          border-bottom: 1px solid #ddd;
        }
        .message {
          margin-bottom: 10px;
          padding: 5px 10px;
          border-radius: 5px;
          background: #007acc;
          color: white;
          max-width: 80%;
        }
        .bot-reply {
          margin-bottom: 10px;
          padding: 5px 10px;
          border-radius: 5px;
          background: #28a745; /* Green background for bot replies */
          color: white;
          max-width: 80%;
        }
        .input-box {
          display: flex;
          padding: 10px;
          background: #f3f3f3;
          border-top: 1px solid #ddd;
        }
        .input-box input {
          flex: 1;
          padding: 10px;
          font-size: 14px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-right: 5px;
        }
        .input-box button {
          padding: 10px 15px;
          font-size: 14px;
          color: white;
          background-color: #007acc;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .input-box button:hover {
          background-color: #005f9e;
        }
        .mode-switch {
          padding: 10px;
          background: #007acc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          align-self: flex-end;
          margin: 10px;
        }
        .mode-switch:hover {
          background: #005f9e;
        }
        .dark-mode {
          background: #1e1e1e;
          color: #c7c7c7;
        }
        .dark-mode .messages {
          background: #2e2e2e;
          border-bottom: 1px solid #555;
        }
        .dark-mode .input-box {
          background: #2e2e2e;
          border-top: 1px solid #555;
        }
        .dark-mode .input-box input {
          background: #3e3e3e;
          color: #c7c7c7;
          border: 1px solid #555;
        }
      </style>
    </head>
    <body>
      <button class="mode-switch" id="modeSwitch">Switch to Dark Mode</button>
      <div class="chat-container">
        <div class="messages" id="messages"></div>
        <div class="input-box">
          <input type="text" id="input" placeholder="Type your message..." />
          <button id="send">Send</button>
        </div>
      </div>
      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('send').addEventListener('click', () => {
          const input = document.getElementById('input');
          const message = input.value.trim();
          if (message) {
            vscode.postMessage({ command: 'sendMessage', text: message });

            // Add user message to chat display
            const messagesDiv = document.getElementById('messages');
            const newMessage = document.createElement('div');
            newMessage.className = 'message';
            newMessage.textContent = message;
            messagesDiv.appendChild(newMessage);

            // Scroll to the latest message
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            input.value = '';
          }
        });

        document.getElementById('modeSwitch').addEventListener('click', () => {
          const body = document.body;
          const modeSwitch = document.getElementById('modeSwitch');

          if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            modeSwitch.textContent = 'Switch to Dark Mode';
          } else {
            body.classList.add('dark-mode');
            modeSwitch.textContent = 'Switch to Light Mode';
          }
        });

        // Handle display of bot reply messages
        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'displayReply') {
            const messagesDiv = document.getElementById('messages');
            const newReply = document.createElement('div');
            newReply.className = 'bot-reply';
            newReply.textContent = message.text;
            messagesDiv.appendChild(newReply);

            // Scroll to the latest message
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
        });
      </script>
    </body>
    </html>
  `;
}

import { applyChange } from "./applyChanges";

export function initializeCode(editor: any) {
  const initialCode = `<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Document</title>
        <style>
        
            ::-webkit-scrollbar {
            width: 10px;
            }
    
            ::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 8px;
            }
    
            ::-webkit-scrollbar-track {
            background-color: black
            }
            body {
                font-family: Arial, Helvetica, sans-serif;
                margin: 0;
                padding: 4rem;
                box-sizing: border-box;
                text-align: center;
                background-color: rgb(50,50,50);
                color: white;
            }
        </style>
    </head>
    <body>
        <h1>Welcome to DevRoulette!</h1>
        <p>Edit the code here to get started!</p>
    </body>
    </html>`;

  const initialChange = {
    from: {
      line: 0,
      ch: 0,
      sticky: null,
    },
    to: {
      line: 0,
      ch: 0,
      sticky: null,
    },
    text: initialCode,
    removed: "",
    origin: "paste",
  };

  applyChange(editor, initialChange);
}

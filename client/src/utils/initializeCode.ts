import { applyChange } from "./applyChanges";

export function initializeCode(editor: any) {
  const initialCode = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>DevRoulette Playground</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 4rem;
            box-sizing: border-box;
            text-align: center;
            background-color: #1a1a1a;
            color: #ffffff;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        h1 {
            margin-bottom: 1.5rem;
            font-size: 2.5rem;
        }

        .tip {
            background: #2d2d2d;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 2rem;
        }

        code {
            color: #61dafb;
            background: #2d2d2d;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎲 Let's Code Together!</h1>
        <p>This is your shared workspace. Try editing the HTML, CSS, or add some JavaScript!</p>
        <div class="tip">
            <p>Quick tip: Add <code>&lt;script&gt;</code> tags to include JavaScript</p>
        </div>
    </div>
</body>
</html>
  `;

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

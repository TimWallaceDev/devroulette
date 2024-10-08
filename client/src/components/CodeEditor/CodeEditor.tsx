// src/CodeEditor.js
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import "./CodeEditor.scss";

interface CodeEditorProps {
    code: string,
    setCode: React.Dispatch<React.SetStateAction<string>>
}

const CodeEditor = (props: CodeEditorProps) => {
    const code = props.code
    const setCode = props.setCode

    return (
        <div className="code-editor">
            <h1>HTML Code Editor</h1>
            <CodeMirror
                value={code}
                options={{
                    lineNumbers: true,
                    mode: 'javascript',
                    theme: 'default',
                }}
                onBeforeChange={(editor: any, data: any, value: any) => {
                    console.log(value)
                    editor;
                    data;
                    setCode(value);
                }}
                
            />

            <iframe  className="iframe" srcDoc={code} title="Code Output"/>
        </div>
    );
};

export default CodeEditor;

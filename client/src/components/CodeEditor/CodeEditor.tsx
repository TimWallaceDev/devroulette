// src/CodeEditor.js
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import "./CodeEditor.scss";
import { CodeData } from '../../pages/Code/Code';

interface CodeEditorProps {
    code: CodeData,
    setCode: React.Dispatch<React.SetStateAction<CodeData>>
    peerId: string
}

const CodeEditor = (props: CodeEditorProps) => {
    const {code, setCode, peerId} = props

    return (
        <div className="code-editor">
            <h1>HTML Code Editor</h1>
            <CodeMirror
                value={code.code}
                options={{
                    lineNumbers: true,
                    mode: 'javascript',
                    theme: 'default',
                }}
                onBeforeChange={(editor: any, data: any, value: any) => {
                    editor;
                    data;
                    const newCode = {author: peerId, code: value}
                    setCode(newCode)
                    console.log("I updated the code", value)
                }}


            />

            <iframe  className="iframe" srcDoc={code.code} title="Code Output"/>
        </div>
    );
};

export default CodeEditor;

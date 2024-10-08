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

    const runCode = () => {
        try {
            // Using eval (caution advised)
            eval(code);
        } catch (error) {
            console.error('Error executing code:', error);
            alert('Error executing code: ' + error);
        }
    };

    // function handleCodeChange(instance: any){
    //     const updatedCode = instance.getValue()
    //     console.log(updatedCode)
    //     setCode(updatedCode)
    // }

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
                    setCode(value);
                    // handleCodeChange(editor)
                }}
                
            />

            <iframe  className="iframe" srcDoc={code} title="Code Output"/>
        </div>
    );
};

export default CodeEditor;

import React, { useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import "./darkmode.scss";
import 'codemirror/mode/javascript/javascript';
import "./CodeEditor.scss";
import { CodeData } from '../../pages/Code/Code';


interface CodeEditorProps {
    code: CodeData,
    setCode: React.Dispatch<React.SetStateAction<CodeData>>
    peerId: string
}

const CodeEditor = (props: CodeEditorProps) => {
    const { code, setCode, peerId } = props

    useEffect(() => {

        const iFrame = document.querySelector('.iframe') as HTMLIFrameElement
        // iFrame.srcdoc = code.code
        if (iFrame && iFrame.contentWindow) {

            iFrame.style.opacity = "0"; // Hide iframe during update
            const iframeDocument = iFrame.contentDocument || iFrame.contentWindow.document;

            iframeDocument.open();
            iframeDocument.write(code.code);
            iframeDocument.close();

            // Fade the iframe back in after the update
            iFrame.style.opacity = "1";
        }
    })

    return (
        <div className="code-editor">
            {/* <h1>HTML Code Editor</h1> */}
            <iframe className="iframe" title="Code Output" />
            <CodeMirror
                className='IDE'
                value={code.code}
                options={{
                    lineNumbers: true,
                    mode: 'javascript',
                    theme: '3024-night',
                }}
                onBeforeChange={(editor: any, data: any, value: any) => {
                    editor;
                    data;
                    const newCode = { author: peerId, code: value }
                    setCode(newCode)
                }}


            />

        </div>
    );
};

export default CodeEditor;

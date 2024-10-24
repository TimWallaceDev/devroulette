import React, { useEffect, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import "./darkmode.scss";
import 'codemirror/mode/javascript/javascript';
import "./CodeEditor.scss";
import { CodeData } from '../../pages/Code/Code';
import { ChangeObject } from '../../interface';


interface CodeEditorProps {
    code: CodeData,
    setCode: React.Dispatch<React.SetStateAction<CodeData>>
    peerId: string
    setChanges: React.Dispatch<React.SetStateAction<ChangeObject | null>>
    editorRef: React.MutableRefObject<any>
}



const CodeEditor = (props: CodeEditorProps) => {
    const { code, setCode, peerId, setChanges, editorRef } = props
    

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

    const getChangeSet = (change: ChangeObject) => {
        return {
            from: { line: change.from.line, ch: change.from.ch },
            to: { line: change.to.line, ch: change.to.ch },
            text: change.text,
            removed: change.removed
        };
    };

    const applyChange = (editor: any, change: ChangeObject) => {
        // Get the CodeMirror instance from the editor
        console.log(editor)
        let cm;
        if (editorRef.current){
            cm = editorRef.current.editor;
        }

        // Replace the text at the specified position
        cm.replaceRange(
            change.text,
            change.from,
            change.to
        );
    };

    function updateEditor(){
        const changes: ChangeObject = {
            "from": {
                "line": 21,
                "ch": 9
            },
            "to": {
                "line": 21,
                "ch": 9
            },
            "text": "s",
            "removed": ""
        }

        applyChange(editorRef, changes)
    }

    return (

        <div className="code-editor">
            {/* <h1>HTML Code Editor</h1> */}
            <button onClick={updateEditor}>Update</button>
            <iframe className="iframe" title="Code Output" />
            <CodeMirror
                ref={editorRef}
                className='IDE'
                value={code.code}
                options={{
                    lineNumbers: true,
                    mode: 'htmlmixed',
                    theme: '3024-night',
                }}
                onBeforeChange={(editor, data: any, value: any) => {
                    editor;
                    data;
                    const newCode = { author: peerId, code: value }
                    setCode(newCode)
                    // console.log("onbeforechage")
                }}
                onChange={(editor, data, value) => {
                    // data contains the change information
                    editor;
                    value;
                    console.log(data)
                    const changes = getChangeSet(data);
                    console.log('Changes to send:', changes);
                    setChanges(changes)
                }}
                
            />

        </div>
    );
};

export default CodeEditor;

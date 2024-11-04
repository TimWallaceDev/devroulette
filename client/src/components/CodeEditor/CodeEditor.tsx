import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import "./darkmode.scss";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed'
import "./CodeEditor.scss";
import { CodeEditorProps } from '../../interface';
import { ChangeObject } from '../../interface';
import { useEffect } from 'react';


const CodeEditor = (props: CodeEditorProps) => {
    const {code,  setCode, setChanges, editorRef } = props

    const getChangeSet = (change: ChangeObject) => {
        return {
            from: { line: change.from.line, ch: change.from.ch },
            to: { line: change.to.line, ch: change.to.ch },
            text: change.text,
            removed: change.removed,
        };
    };

    return (

        <div className="code-editor">
            <CodeMirror
                // value = {code.code}
                ref={editorRef}
                className='IDE'
                options={{
                    lineNumbers: true,
                    mode: 'htmlmixed',
                    theme: "3024-night",
                    lineWrapping: true,
                }}
                onChange={(editor, data, value) => {
                    // data contains the change information
                    editor;
                    value;
                    if (data.origin !== 'remote') {
                        const changes = getChangeSet(data);
                        setChanges(changes)
                    }
                    console.log(data)
                    setCode({author: "me", code: value})
                }}
            />
        </div>
    );
};

export default CodeEditor;

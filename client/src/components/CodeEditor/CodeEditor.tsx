import { useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import "./darkmode.scss";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed'
import "./CodeEditor.scss";
import { CodeEditorProps } from '../../interface';
import { ChangeObject } from '../../interface';


const CodeEditor = (props: CodeEditorProps) => {
    const { code, setCode, peerId, setChanges, editorRef } = props

    const cursorPosRef = useRef<{line: number, ch: number} | null>(null);

    const getChangeSet = (change: ChangeObject) => {
        return {
            from: { line: change.from.line, ch: change.from.ch },
            to: { line: change.to.line, ch: change.to.ch },
            text: change.text,
            removed: change.removed
        };
    };

    return (

        <div className="code-editor">
            <CodeMirror
                ref={editorRef}
                className='IDE'
                value={code.code}
                options={{
                    lineNumbers: true,
                    mode: 'htmlmixed',
                    theme: "3024-night",
                    lineWrapping: true,
                }}
                
                onBeforeChange={(editor, data: any, value: any) => {
                    editor;
                    data;
                    const newCode = { author: peerId, code: value }
                    setCode(newCode)
                }}
                onChange={(editor, data, value) => {
                    // data contains the change information
                    editor;
                    value;
                    if (data.origin !== 'remote') {
                        const changes = getChangeSet(data);
                        setChanges(changes)
                    }
                }}
                onCursorActivity={(editor) => {
                    // Update cursor position reference
                    const cursor = editor.getCursor();
                    cursorPosRef.current = { line: cursor.line, ch: cursor.ch };
                }}
            />

        </div>
    );
};

export default CodeEditor;

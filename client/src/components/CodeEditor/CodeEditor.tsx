import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import "./darkmode.scss";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed'
import "./CodeEditor.scss";
import { CodeEditorProps } from '../../interface';
import { ChangeObject } from '../../interface';

const CodeEditor = (props: CodeEditorProps) => {
    const { codeRef, setCodeTrigger, editorRef, dataConn } = props


    const getChangeSet = (change: ChangeObject) => {
        return {
          from: { line: change.from.line, ch: change.from.ch },
          to: { line: change.to.line, ch: change.to.ch },
          text: change.text, // Join the text array into a single string with newlines
          removed: change.removed, // Join the removed text array into a single string with newlines
        };
      };

    return (

        <div className="code-editor">
            <CodeMirror
                
                ref={editorRef}
                className='IDE'
                options={{
                    lineNumbers: true,
                    mode: 'htmlmixed',
                    theme: "3024-night",
                    lineWrapping: true,
                    indentAuto: false,
                    smartIndent: false
                }}
                onChange={(editor, data, value) => {
                    editor;
                    value;
                    if (data.origin !== 'remote') {
                        const changes = getChangeSet(data) as ChangeObject;
                        dataConn?.send(changes)
                    }
                    codeRef.current = {author: "me", code: value}
                    setCodeTrigger(prev => !prev)
                }}
            />
        </div>
    );
};

export default CodeEditor;

export interface ChangeObject {
    from: { line: number; ch: number };
    to: { line: number; ch: number };
    text: string;
    removed: string;
}

export interface CodeEditorProps {
    code: CodeData,
    setCode: React.Dispatch<React.SetStateAction<CodeData>>
    peerId: string
    setChanges: React.Dispatch<React.SetStateAction<ChangeObject | null>>
    editorRef: React.MutableRefObject<any>
}

export interface CodeData {
    author: string,
    code: string
}

export interface ChangeObject {
    from: { line: number; ch: number };
    to: { line: number; ch: number };
    text: string;
    removed: string;
}
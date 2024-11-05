export interface HomeProps{
    setUsername: React.Dispatch<React.SetStateAction<string | null>>
}

export interface CodeProps{
    username: string | null
}

export interface ChangeObject {
    from: { line: number; ch: number };
    to: { line: number; ch: number };
    text: string;
    removed: string;
}

export interface CodeEditorProps {
    peerId: string
    setChanges: React.Dispatch<React.SetStateAction<ChangeObject | null>>
    editorRef: React.MutableRefObject<any>
    codeRef: React.MutableRefObject<any>
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

export interface PeerChatProps {
    peerId: string,
    setPeerId: React.Dispatch<React.SetStateAction<string>>
    changes: ChangeObject | null,
    editorRef: React.MutableRefObject<any>
    codeRef:React.MutableRefObject<any>
    username: string
}
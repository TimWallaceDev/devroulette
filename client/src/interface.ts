export interface HomeProps{
    setUsername: React.Dispatch<React.SetStateAction<string | null>>
}

export interface CodeProps{
    username: string | null,
    setUsername: React.Dispatch<React.SetStateAction<string | null>>
}

export interface ChangeObject {
    from: { line: number; ch: number };
    to: { line: number; ch: number };
    text: string | string[];
    removed: string | string[];
}

export interface CodeEditorProps {
    peerId: string
    setChanges: React.Dispatch<React.SetStateAction<ChangeObject[]>>
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
    text: string | string[];
    removed: string | string[];
}

export interface PeerChatProps {
    peerId: string,
    setPeerId: React.Dispatch<React.SetStateAction<string>>
    changes: ChangeObject[],
    setChanges: React.Dispatch<React.SetStateAction<ChangeObject[]>>
    editorRef: React.MutableRefObject<any>
    codeRef:React.MutableRefObject<any>
    username: string | null
}
import { DataConnection } from "peerjs";

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
    editorRef: React.MutableRefObject<any>
    codeRef: React.MutableRefObject<any>
    setCodeTrigger: React.Dispatch<React.SetStateAction<boolean>>
    dataConn: DataConnection | null
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
    username: string | null
}
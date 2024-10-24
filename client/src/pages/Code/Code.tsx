import "./Code.scss";
import PeerChat from "../../components/PeerChat/PeerChat";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { useRef, useState } from "react";
import { template } from "../../components/CodeEditor/template.tsx";
import { CodeData, ChangeObject } from "../../interface.ts";


export function Code() {

    const [peerId, setPeerId] = useState('');

    const [code, setCode] = useState<CodeData>({author: "default", code: JSON.parse(template)});

    const [changes, setChanges] = useState<ChangeObject | null>(null)

    const editorRef = useRef<any>();

    return (
        <main className="code">
            <div className="editor">
                <CodeEditor code={code} setCode={setCode} peerId={peerId} setChanges={setChanges} editorRef={editorRef}/>
            </div>
            <div className="chat">
                <PeerChat code={code} setCode={setCode}  peerId={peerId} setPeerId={setPeerId} changes={changes} editorRef={editorRef}/>
            </div>
        </main>
    )
}
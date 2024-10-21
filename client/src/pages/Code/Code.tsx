import "./Code.scss";
import PeerChat from "../../components/PeerChat/PeerChat";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { useState } from "react";

export interface CodeData {
    author: string,
    code: string
}


export function Code() {

    const [peerId, setPeerId] = useState('');

    const [code, setCode] = useState<CodeData>({author: "default", code: ""});

    return (
        <main className="code">
            <div className="editor">
                <CodeEditor code={code} setCode={setCode} peerId={peerId}/>
            </div>
            <div className="chat">
                <PeerChat code={code} setCode={setCode}  peerId={peerId} setPeerId={setPeerId}/>
            </div>
            <div className="test">
                {code.code}
            </div>
        </main>
    )
}
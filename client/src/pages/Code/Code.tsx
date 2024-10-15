import "./Code.scss";
import PeerChat from "../../components/PeerChat/PeerChat";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { useState } from "react";


export function Code() {

    const [code, setCode] = useState("")

    return (
        <main className="code">
            <div className="editor">
                <CodeEditor code={code} setCode={setCode}/>
            </div>
            <div className="chat">
                <PeerChat code={code} setCode={setCode}/>
            </div>
            <div className="test">
                {code}
            </div>
        </main>
    )
}
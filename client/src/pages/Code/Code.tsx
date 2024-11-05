import "./Code.scss";
import PeerChat from "../../components/PeerChat/PeerChat";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { useRef, useState } from "react";
import { CodeData, ChangeObject, CodeProps } from "../../interface.ts";
import { Iframe } from "../../components/Iframe/Iframe.tsx";
import { useNavigate } from "react-router-dom";


export function Code(props: CodeProps) {

    const username = props.username
    const navigate = useNavigate()

    if (!username){
        navigate("/")
    }

    const [peerId, setPeerId] = useState('');
    const [changes, setChanges] = useState<ChangeObject | null>(null)

    const code = useRef<CodeData>({ author: "default", code:"" });
    const editorRef = useRef<any>();

    return (
        <main className="code">

            <Iframe code={code.current} />

            <div className="editor">
                <CodeEditor 
                // code={code.current} 
                codeRef={code} 
                peerId={peerId} 
                setChanges={setChanges} 
                editorRef={editorRef} 
                />
            </div>
            <div className="chat">
                <PeerChat
                    // code={code.current}
                    codeRef={code}
                    peerId={peerId}
                    setPeerId={setPeerId}
                    changes={changes}
                    editorRef={editorRef}
                    username={username}
                />
            </div>
        </main>
    )
}
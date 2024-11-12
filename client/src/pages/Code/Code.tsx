import "./Code.scss";
import PeerChat from "../../components/PeerChat/PeerChat";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { useEffect, useRef, useState } from "react";
import { CodeData, ChangeObject, CodeProps } from "../../interface.ts";
import { Iframe } from "../../components/Iframe/Iframe.tsx";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export function Code(props: CodeProps) {
  const { username, setUsername } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) {
        setUsername(user.displayName);
      } else {
        setUsername("");
        navigate("/");
      }
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  const [peerId, setPeerId] = useState("");
  const [changes, setChanges] = useState<ChangeObject[]>([]);

  const code = useRef<CodeData>({ author: "default", code: "" });
  const [codeTrigger, setCodeTrigger] = useState<boolean>(false);
  const editorRef = useRef<any>();

  return (
    <main className="code">
      <PanelGroup autoSaveId="example" direction="horizontal">
        <Panel>
          <Iframe code={code} codeTrigger={codeTrigger} />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div className="editor">
            <CodeEditor
              codeRef={code}
              peerId={peerId}
              setChanges={setChanges}
              setCodeTrigger={setCodeTrigger}
              editorRef={editorRef}
            />
          </div>
        </Panel>
        <PanelResizeHandle style={{ width: "2px", backgroundColor: "black" }} />
        <Panel defaultSize={25}>
          <div className="chat">
            <PeerChat
              codeRef={code}
              peerId={peerId}
              setPeerId={setPeerId}
              changes={changes}
              setChanges={setChanges}
              editorRef={editorRef}
              username={username}
            />
          </div>
        </Panel>
      </PanelGroup>
    </main>
  );
}

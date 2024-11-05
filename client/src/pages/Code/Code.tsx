import "./Code.scss";
import PeerChat from "../../components/PeerChat/PeerChat";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { useEffect, useRef, useState } from "react";
import { CodeData, ChangeObject, CodeProps } from "../../interface.ts";
import { Iframe } from "../../components/Iframe/Iframe.tsx";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function Code(props: CodeProps) {
  const {username, setUsername} = props;
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
          setChanges={setChanges}
          editorRef={editorRef}
          username={username}
        />
      </div>
    </main>
  );
}

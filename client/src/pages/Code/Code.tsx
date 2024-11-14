import "./Code.scss";
import PeerChat from "../../components/PeerChat/PeerChat";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { useEffect, useRef, useState } from "react";
import { CodeData, ChangeObject, CodeProps } from "../../interface.ts";
import { Iframe } from "../../components/Iframe/Iframe.tsx";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Peer, { DataConnection } from "peerjs";
import { applyChange } from "../../utils/applyChanges.ts";
import axios from "axios";
import { initializeCode } from "../../utils/initializeCode.ts";

export function Code(props: CodeProps) {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [pairId, setPairId] = useState<string | null>(null);
  const [pairUsername, setPairUsername] = useState<string | null>(null);
  const [dataConn, setDataConn] = useState<DataConnection | null>(null);
  const first = useRef(false);

  const [peerId, setPeerId] = useState("");

  const code = useRef<CodeData>({ author: "default", code: "" });
  const [codeTrigger, setCodeTrigger] = useState<boolean>(false);
  const editorRef = useRef<any>();

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

  useEffect(() => {

    if (!username){
      return
    }

    function setupCall() {
      const newPeer = new Peer({
        host: "devroulette.com",
        path: "/myapp",
        secure: true,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "stun:stun.relay.metered.ca:80",
            },
            {
              urls: "turn:global.relay.metered.ca:80",
              username: "769714b823ddd9f98f95239e",
              credential: "aJVT5OtRSvp9Jg46",
            },
            {
              urls: "turn:global.relay.metered.ca:80?transport=tcp",
              username: "769714b823ddd9f98f95239e",
              credential: "aJVT5OtRSvp9Jg46",
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: "769714b823ddd9f98f95239e",
              credential: "aJVT5OtRSvp9Jg46",
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: "769714b823ddd9f98f95239e",
              credential: "aJVT5OtRSvp9Jg46",
            },
          ],
        },
      });

      //TODO check for symmetrical NAT

      newPeer.on("open", async (id) => {
        setPeerId(id);
      });

      // Handle incoming data connection (for code updates)
      newPeer.on("connection", (conn) => {
        conn.on("data", (data: any) => {
          if (data.type === "change") {
            const change = data.change as ChangeObject;
            applyChange(editorRef, change);
          } else if (data.type === "username") {
            setPairUsername(data.username);
          }
        });

        conn.on("open", () => {
          if (first.current) {
            conn.send({
              type: "change",
              change: {
                from: {
                  line: 0,
                  ch: 0,
                  sticky: null,
                  xRel: -1,
                  outside: -1,
                },
                to: {
                  line: 0,
                  ch: 0,
                  sticky: "before",
                  xRel: 28.662506103515625,
                },
                text: code.current.code,
                removed: "",
                origin: "remote",
              },
            });
          }
          else {
            conn.send({ type: "username", username: username });
          }
        });

        setDataConn(conn);
        setPairId(conn.peer);
      });

      newPeer.on("close", () => {
        newPeer.destroy();
      });

      setPeer(newPeer);
      return newPeer;
    }

    const newPeer = setupCall();

    return () => {
      newPeer.destroy();
    };
  }, [username]);

  useEffect(() => {
    if (!peer || !peerId || !username) {
      return;
    }
    async function checkPairServer(peerId: string, username: string) {
      try {
        const response = await axios.post("https://devroulette.com/pair", {
          peerId: peerId,
          username: username,
        });
        const data = response.data;
        if (data.message == "You're first in line") {
          first.current = true;
          console.log("first");
          initializeCode(editorRef);
        } else if (data.message == "You've been matched") {
          setPairId(data.pairId);
          setPairUsername(data.pairUsername);
        }
        return data;
      } catch (err) {
        console.log(err);
        //TODO add error message
      }
    }

    checkPairServer(peerId, username);
  }, [peerId, username]);

  //call the other peer
  useEffect(() => {
    if (!pairId) {
      return;
    }
    createDataConnection(pairId);
  }, [pairId]);

  function createDataConnection(peerId: string) {
    if (peer) {
      const dataConn = peer.connect(peerId);
      dataConn.on("data", (data: any) => {
        if (data.type === "change") {
          const change = data.change as ChangeObject;
          applyChange(editorRef, change);
        } else if (data.type === "username") {
          setPairUsername(data.username);
        }
      });
      setDataConn(dataConn);
    }
  }

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
              setCodeTrigger={setCodeTrigger}
              editorRef={editorRef}
              dataConn={dataConn}
            />
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={25}>
          <div className="chat">
            <PeerChat
              peerId={peerId}
              username={username}
              pairUsername={pairUsername}
            />
          </div>
        </Panel>
      </PanelGroup>
    </main>
  );
}

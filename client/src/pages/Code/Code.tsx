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
    function setupCall() {
      console.log("inside setupcall");
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
      }); // Create a new Peer instance

      //TODO check for symmetrical NAT

      newPeer.on("open", async (id) => {
        console.log("Opened new peer");
        setPeerId(id); // Set the peer ID when the peer is opened
      });

      // Handle incoming data connection (for code updates)
      newPeer.on("connection", (conn) => {
        console.log("Data connection established for code sync");
        conn.on("data", (data: unknown) => {
          const change = data as ChangeObject;
          applyChange(editorRef, change);
        });

        conn.on("open", () => {
          if (first.current) {
            conn.send({
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
            });
          }
        });

        setDataConn(conn);
        setPairId(conn.peer);
      });

      newPeer.on("close", () => {
        newPeer.destroy();
      });

      setPeer(newPeer); // Set the peer instance to state
      console.log("new peer set");
      // Cleanup on component unmount
      return newPeer;
    }

    const newPeer = setupCall();

    return () => {
      console.log("cleaning up peer");
      newPeer.destroy();
    };
  }, []);

  useEffect(() => {
    if (!peer || !peerId || !username) {
      return;
    }
    console.log("checking pair server");
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
          console.log("youve been matcheds");
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

  useEffect(() => {
    if (!pairId) {
      return;
    }
    createDataConnection(pairId);
  }, [pairId]);

  function createDataConnection(peerId: string) {
    if (peer) {
      const dataConn = peer.connect(peerId);
      dataConn.on("data", (data) => {
        const changes = data as ChangeObject;
        applyChange(editorRef, changes);
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
        <PanelResizeHandle style={{ width: "2px", backgroundColor: "black" }} />
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

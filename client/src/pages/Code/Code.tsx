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

  const { username, setUsername, email, setEmail } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) {
        setUsername(user.displayName);
        setEmail(user.email)
      } else {
        setUsername("");
        setEmail("")
        navigate("/");
      }
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  useEffect(() => {

    if (!username || !email){
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
      try {
        axios.post("https://devroulette.com/disconnect", {
          peerId: peerId,
        });
      }
      catch(err){
        console.log(err)
      }
      newPeer.destroy();
    };
  }, [username, email]);

  useEffect(() => {
    if (!peer || !peerId || !username || !email) {
      return;
    }
    async function checkPairServer(peerId: string, username: string, email: string) {
      try {
        const response = await axios.post("https://devroulette.com/pair", {
          peerId: peerId,
          username: username,
          email: email
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
        navigate("/")
      }
    }

    checkPairServer(peerId, username, email);
  }, [peerId, username, email]);

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

      dataConn.on('error', (err) => {
        console.error('Connection error:', err);
        // Notify the user and remove the peer from the queue on the server
        console.log(err)
        window.location.reload()
      });
      dataConn.on("data", (data: any) => {
        if (data.type === "change") {
          const change = data.change as ChangeObject;
          applyChange(editorRef, change);
        } else if (data.type === "username") {
          setPairUsername(data.username);
        }
      });

      dataConn.on('open', () => {
        console.log('Data connection opened successfully');
        // Perform any additional setup or logic when the connection is established
      });
      setDataConn(dataConn);
      setTimeout(() => {
        console.log("testing connection")
        if (!dataConn.open){
          window.location.reload()
        }
      }, 5000)
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

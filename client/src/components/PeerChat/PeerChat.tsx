import { useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import axios from "axios";
import "./PeerChat.scss";
import { ChangeObject, PeerChatProps } from "../../interface";
import { applyChange } from "../../functions/applyChanges";
import { initializeCode } from "../../functions/initializeCode";
import { ProjectSuggestion } from "../ProjectSuggestion/ProjectSuggestion";

const PeerChat = (props: PeerChatProps) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [pairId, setPairId] = useState<string | null>(null);
  const [pairUsername, setPairUsername] = useState<string | null>(null);
  const [dataConn, setDataConn] = useState<DataConnection | null>(null);
  const first = useRef(false);
  const processing = useRef<boolean>(false);

  const {
    username,
    codeRef,
    peerId,
    setPeerId,
    changes,
    setChanges,
    editorRef,
  } = props;

  useEffect(() => {
    if (processing.current) {
      return;
    }

    if (dataConn && changes.length > 0) {
      processing.current = true;
      const [firstChange, ...restOfChanges] = changes;
      dataConn.send(firstChange);
      setChanges(restOfChanges);
      processing.current = false;
    }
  }, [changes]);

  useEffect(() => {
    function setupCall() {
      console.log("inside setupcall");
      const newPeer = new Peer({
        host: "devroulette.com",
        path: "/myapp",
        // secure: true,
        config: {
          iceServers: [
            { url: "stun:stun.l.google.com:19302" }, // A commonly used free STUN server
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
              text: codeRef.current.code,
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
      newPeer.destroy(); // Destroy the peer when the component is unmounte
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
    // TODO
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

  function next() {
    window.location.reload();
  }

  return (
    <div className="peerchat">


      <div className="users">
        <h3 className="users__heading">Current Users: </h3>
        <div className="online-user">
          <span className="online-user__status"></span>
          <span className="online-user__username">{username}</span>
        </div>
        <div className="online-user">
          <span
            className={
              pairUsername
                ? "online-user__status"
                : "online-user__status online-user__status--offline"
            }
          ></span>
          <span className="online-user__username">
            {pairUsername ? pairUsername : "looking for partner"}
          </span>
        </div>
      </div>

      <ProjectSuggestion />

      <button onClick={next} className="next-dev">
        Next Dev
      </button>
    </div>
  );
};

export default PeerChat;

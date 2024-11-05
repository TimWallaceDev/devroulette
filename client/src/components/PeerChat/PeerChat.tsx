import { useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import axios from "axios";
import "./PeerChat.scss";
import { ChangeObject, PeerChatProps } from "../../interface";
import { applyChange } from "../../functions/applyChanges";
import { initializeCode } from "../../functions/initializeCode";

const PeerChat = (props: PeerChatProps) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [pairId, setPairId] = useState<string | null>(null);
  const [pairUsername, setPairUsername] = useState<string | null>(null);
  const [dataConn, setDataConn] = useState<DataConnection | null>(null);
  const first = useRef(false);

  const { username, codeRef, peerId, setPeerId, changes, editorRef } = props;

  useEffect(() => {
    if (dataConn) {
      dataConn.send(changes);
    }
  }, [changes]);

  useEffect(() => {
    function setupCall() {
      const newPeer = new Peer({
        host: "devroulette.com",
        path: "/myapp",
        secure: true,
        config: {
          iceServers: [
            { url: "stun:stun.l.google.com:19302" }, // A commonly used free STUN server
          ],
        },
      }); // Create a new Peer instance

      //TODO check for symmetrical NAT

      newPeer.on("open", async (id) => {
        setPeerId(id); // Set the peer ID when the peer is opened
      });

      // Handle incoming data connection (for code updates)
      newPeer.on("connection", (conn) => {
        console.log("Data connection established for code sync");
        conn.on("data", (data: unknown) => {
          console.log("imcomming");
          const change = data as ChangeObject;
          applyChange(editorRef, change);
        });

        conn.on("open", () => {
          if (first.current) {
            console.log("need to send mi code", codeRef.current.code);
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

      setPeer(newPeer); // Set the peer instance to state
      // Cleanup on component unmount
      return () => {
        newPeer.destroy(); // Destroy the peer when the component is unmounted
      };
    }

    setupCall();
  }, []);

  useEffect(() => {
    if (!peer || !peerId) {
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
    if (username) {
      checkPairServer(peerId, username);
    }
  }, [peerId]);

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
        console.log("incoming");
        const changes = data as ChangeObject;
        applyChange(editorRef, changes);
      });
      setDataConn(dataConn);
    }
  }

  return (
    <div className="peerchat">
      <div className="online-user">
        <span className="online-user__status"></span>
        <span className="online-user__username">YOU: {username}</span>
      </div>
      <div className="online-user">
        <span className="online-user__status"></span>
        <span className="online-user__username">
          PARTNER: {pairUsername ? pairUsername : "looking for partner"}
        </span>
      </div>
    </div>
  );
};

export default PeerChat;

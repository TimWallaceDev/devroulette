import { useEffect, useRef, useState } from "react";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import axios from "axios";
import "./PeerChat.scss";
import { ChangeObject, PeerChatProps } from "../../interface";

const PeerChat = (props: PeerChatProps) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [pairId, setPairId] = useState<string | null>(null);
  const [dataConn, setDataConn] = useState<DataConnection | null>(null);

  const { code, peerId, setPeerId, changes, editorRef } = props;

  const initalCode: ChangeObject = {
    from: {
      line: 0,
      ch: 0,
    },
    to: {
      line: 0,
      ch: 0,
    },
    text: `<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Document</title>
  <style>
  
      ::-webkit-scrollbar {
      width: 10px;
      }

      ::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 8px;
      }

      ::-webkit-scrollbar-track {
      background-color: black
      }
      body {
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 4rem;
          box-sizing: border-box;
          text-align: center;
          background-color: rgb(50,50,50);
          color: white;
      }
  </style>
</head>
<body>
  <h1>Welcome to DevRoulette!</h1>
  <p>Edit the code here to get started!</p>
</body>
</html>`,
    removed: "",
  };

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

      newPeer.on("connection", (conn) => {
        console.log("Data connection established for code sync");

        conn.on("data", (data: unknown) => {
          const change = data as ChangeObject;
          applyChange(editorRef, change);
        });

        setDataConn(conn);
      });

      setPeer(newPeer); // Set the peer instance to state
      // Cleanup on component unmount
      return () => {
        newPeer.destroy(); // Destroy the peer when the component is unmounted
      };
    }

    setupCall();
  }, []);

  function initializeCode() {
    if (!editorRef.current) {
      return;
    } else {
      applyChange(editorRef, initalCode);
    }
  }

  useEffect(() => {
    if (!peer || !peerId) {
      return;
    }
    async function checkPairServer(peerId: string) {
      try {
        const response = await axios.post("https://devroulette.com/pair", {
          peerId: peerId,
        });
        const data = response.data;
        if (data.message == "You're first in line") {
          console.log("first");
          initializeCode();
        } else if (data.message == "You've been matched") {
          setPairId(data.pairId);
        //    TODO send initial code to partner
        }
        return data;
      } catch (err) {
        console.log(err);
        //TODO add error message
      }
    }
    checkPairServer(peerId);
  }, [peerId]);

  useEffect(() => {
    if (!pairId) {
      return;
    }
    // callPeer(pairId)
    createDataConnection(pairId);
  }, [pairId]);

  function createDataConnection(peerId: string) {
    if (peer) {
      const dataConn = peer.connect(peerId);
      dataConn.on("data", (data) => {
        const changes = data as ChangeObject;
        applyChange(editorRef, changes);
      });

      // TODO send initial code to pair
      const latestCode = code.code
      const initialChange: ChangeObject = {
        from: {
          line: 0,
          ch: 0,
        },
        to: {
          line: 0,
          ch: 0,
        },
        text: latestCode,
        removed: "",
      };
      dataConn.send(initialChange)
    }
  }

  // Function to apply change
  const applyChange = (editor: any, change: ChangeObject) => {
    let cm;
    if (editor.current !== null) {
      cm = editor.current.editor;
    } else {
      cm = editorRef.current.editor;
    }

    try {
      // Apply the change
      cm.operation(() => {
        cm.replaceRange(change.text, change.from, change.to, "remote");
      });
    } catch (err) {
      console.error("Error applying changes:", err);
    }
  };

  if (!pairId) {
    return <h1>Looking for partner</h1>;
  }

  return (
    // <div className="peerchat">
    //     <video className="peerchat__video" ref={localVideoRef} autoPlay playsInline muted style={{ width: '200px', height: 'auto', border: '1px solid black' }} />
    //     <video className="peerchat__video" ref={remoteVideoRef} autoPlay playsInline style={{ width: '200px', height: 'auto', border: '1px solid black' }} />
    // </div>
    <>Paired up!</>
  );
};

export default PeerChat;

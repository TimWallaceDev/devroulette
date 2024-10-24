import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import axios from "axios"
import "./PeerChat.scss";
import { CodeData } from '../../pages/Code/Code';
import { ChangeObject } from '../../interface';

interface PeerChatProps {
    code: CodeData,
    setCode: React.Dispatch<React.SetStateAction<CodeData>>,
    peerId: string,
    setPeerId: React.Dispatch<React.SetStateAction<string>>
    changes: ChangeObject | null,
    editorRef: React.MutableRefObject<any>
}

const PeerChat = (props: PeerChatProps) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [pairId, setPairId] = useState<string | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [dataConn, setDataConn] = useState<DataConnection | null>(null)

    const localVideoRef = useRef<HTMLVideoElement | null>(null); // Reference for the local video element
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null); // Reference for the remote video element

    const { peerId, setPeerId, changes, editorRef } = props

    useEffect(() => {
        if (dataConn) {

            dataConn.send(changes)

        }
    }, [changes])

    useEffect(() => {
        async function getMedia() {
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(videoStream)

                //start the local video 
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = videoStream
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        }

        getMedia();
    }, []);

    useEffect(() => {
        if (!stream) {
            return;
        }
        function setupCall() {
            console.log("setting up call")
            const newPeer = new Peer({
                host: 'devroulette.com',
                path: '/myapp',
                secure: true,
                config: {
                    'iceServers': [
                        { url: 'stun:stun.l.google.com:19302' }, // A commonly used free STUN server
                    ]
                }
            }); // Create a new Peer instance

            newPeer.on('open', async (id) => {
                setPeerId(id); // Set the peer ID when the peer is opened
                console.log('My peer ID is:', id);
            });

            newPeer.on('call', (call: MediaConnection) => {
                console.log("----------- call incoming! - ------------")
                if (stream) {
                    call.answer(stream); // Answer the call with your media stream (if you want to send your stream)
                }
                else {
                    console.log("---------- no stream yet to reply with-----------------")
                }
                console.log("connection id: ", call.peer)
                setPairId(call.peer)

                call.on('stream', (remoteStream) => {
                    // Properly set the remote stream for the video element
                    console.log("stream incoming")
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream; // This should be a MediaStream
                        remoteVideoRef.current.muted = true
                    }
                    else {
                        console.log("no remote video ref")
                    }
                });
            });

            // Handle incoming data connection (for code updates)
            newPeer.on('connection', (conn) => {
                console.log("Data connection established for code sync");

                conn.on('data', (data: unknown) => {

                    console.log("incomming data: ", data)
                    const change = data as ChangeObject
                    applyChange(editorRef, change)

                    // Update CodeMirror with incoming code changes
                });

                setDataConn(conn)
            });

            setPeer(newPeer); // Set the peer instance to state
            // Cleanup on component unmount
            return () => {
                newPeer.destroy(); // Destroy the peer when the component is unmounted
            };
        }

        setupCall()
    }, [stream])

    useEffect(() => {
        if (!stream || !peer || !peerId) {
            return;
        }
        async function checkPairServer(peerId: string) {
            try {
                const response = await axios.post("https://devroulette.com/pair", { peerId: peerId })
                const data = response.data
                if (data.message == "You're first in line") {
                    console.log("first")
                }
                else if (data.message == "You've been matched") {
                    console.log("calling: ", data.pairId)
                    setPairId(data.pairId)
                }
                return data
            } catch (err) {
                console.log(err)
            }
        }
        checkPairServer(peerId)
    }, [peerId])

    useEffect(() => {
        if (!pairId) {
            return;
        }
        callPeer(pairId)
        createDataConnection(pairId)

    }, [pairId])

    const callPeer = (peerId: string) => {

        if (peer) {
            console.log("----------- calling peer ----------------")
            if (stream && peer) {
                const call = peer.call(peerId, stream);
                call.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream; // Set remote video source
                    }
                });
            }
        }
        else {
            console.log("Call failed. There was no local peer")
        }
    };

    function createDataConnection(peerId: string) {
        if (peer) {
            const dataConn = peer.connect(peerId)
            dataConn.on("data", data => {
                console.log("incomming data received", data)
                const changes = data as ChangeObject
                applyChange(editorRef, changes)
            })
        }
    }

    const applyChange = (editor: any, change: ChangeObject) => {
        // Get the CodeMirror instance from the editor
        console.log("editor passed to apply change function: ", editor)
        console.log("changes", change)
        let cm;
        if (editor.current !== null) {
            cm = editor.current.editor;
        }
        else {
            cm = editorRef.current.editor
        }
        console.log({cm})

        //turn off the onChange listener
        // const doc = cm.doc;
        // const originalOnChange = doc.on('change');
        // doc.off('change');

        // Replace the text at the specified position
        console.log("onchange listener off")
        try {

            cm.replaceRange(
                change.text,
                change.from,
                change.to,
                'remote'
            );
        } catch (err) {
            console.log(err)
            console.log("error applying changes")
        }
        console.log("changes complete")

        // doc.on('change', originalOnChange);
        console.log("update successful!")
    };

    return (
        <div className="peerchat">
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px', height: 'auto', border: '1px solid black' }} />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', height: 'auto', border: '1px solid black' }} />
        </div>
    );
};

export default PeerChat;

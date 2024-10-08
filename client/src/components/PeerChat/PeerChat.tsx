import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import axios from "axios"
import "./PeerChat.scss";
// import CodeEditor from '../CodeEditor/CodeEditor';

interface PeerChatProps {
    code: string,
    setCode: React.Dispatch<React.SetStateAction<string>>
}

const PeerChat = (props: PeerChatProps) => {
    const [peerId, setPeerId] = useState('');
    const [peer, setPeer] = useState<Peer | null>(null);
    const [pairId, setPairId] = useState<string | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [dataConn, setDataConn] = useState<DataConnection | null>(null)

    const localVideoRef = useRef<HTMLVideoElement | null>(null); // Reference for the local video element
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null); // Reference for the remote video element

    const code = props.code

    useEffect(() => {
        console.log("code has been updated. sending it to the homie")
        if (dataConn) {
            dataConn.send(code)
        }
    }, [code])

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

                conn.on('data', (data) => {
                    console.log("Received code:", data);
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
                else {
                    console.log("idk")
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
                peer.connect("data")
            }
        }
        else {
            console.log("Call failed. There was no local peer")
        }
    };


    return (
        <div className="peerchat">
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px', height: 'auto', border: '1px solid black' }} />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', height: 'auto', border: '1px solid black' }} />
        </div>
    );
};

export default PeerChat;

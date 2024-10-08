import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import axios from "axios"

const PeerChat = () => {
    const [peerId, setPeerId] = useState('');
    const [peer, setPeer] = useState<Peer | null>(null);
    // const [messages, setMessages] = useState<string[]>([]);
    // const [connection, setConnection] = useState<DataConnection | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null)

    const localVideoRef = useRef<HTMLVideoElement | null>(null); // Reference for the local video element
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null); // Reference for the remote video element

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
        function setupCall() {
            console.log("setting up call")
            const newPeer = new Peer({
                host: 'devroulette.com',
                path: '/myapp',
                secure: true
            }); // Create a new Peer instance

            async function checkPairServer(peerId: string){
                const response = await axios.post("https://devroulette.com/pair", {peerId: peerId})
                return response.data
            }

            newPeer.on('open', (id) => {
                setPeerId(id); // Set the peer ID when the peer is opened
                console.log('My peer ID is:', id);
                //send peer id to the pair API
                const check = checkPairServer(id)
                console.log({check})

                //if partner, call them

                //otherwise wait
            });

            // Handle incoming connections
            // newPeer.on('connection', (conn) => {
            //     setConnection(conn);
            //     conn.on('data', (data) => {
            //         setMessages((prevMessages) => [...prevMessages, data as unknown as string]); // Update messages on receiving data
            //     });
            // });

            newPeer.on('call', (call: MediaConnection) => {
                console.log("----------- call incoming! - ------------")
                if (stream) {
                    call.answer(stream); // Answer the call with your media stream (if you want to send your stream)
                }
                else {
                    console.log("---------- no stream yet to reply with-----------------")
                }

                call.on('stream', (remoteStream) => {
                    // Properly set the remote stream for the video element
                    if (remoteVideoRef.current) {
                        if (remoteVideoRef.current.srcObject) {
                            remoteVideoRef.current.srcObject = remoteStream; // This should be a MediaStream
                        }
                    }
                });
            });

            setPeer(newPeer); // Set the peer instance to state

            // Cleanup on component unmount
            return () => {
                newPeer.destroy(); // Destroy the peer when the component is unmounted
            };
        }

        setupCall()
    }, [stream])

    if (!peer) {
        return "loading"
    }

    // const connectToPeer = (otherPeerId: string) => {
    //     const conn = peer.connect(otherPeerId);
    //     setConnection(conn);
    //     conn.on('open', () => {
    //         console.log('Connected to peer:', otherPeerId);
    //         conn.on('data', (data) => {
    //             setMessages((prevMessages) => [...prevMessages, data as unknown as string]); // Update messages on receiving data
    //         });
    //     });
    // };

    // const sendMessage = (message: string) => {
    //     if (connection) {
    //         connection.send(message); // Send the message through the established connection
    //         setMessages((prevMessages) => [...prevMessages, message]); // Update messages to include the sent message
    //     }
    // };

    const callPeer = (peerId: string) => {
        console.log("----------- calling peer ----------------")
        if (stream) {
            const call = peer.call(peerId, stream);
            call.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream; // Set remote video source
                }
            });
        }
    };

    return (
        <div>
            <h1>Peer ID: {peerId}</h1>
            {/* <div>
                <input
                    type="text"
                    placeholder="Connect to peer ID"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement
                            connectToPeer(target.value);
                            target.value = ''; // Clear the input
                        }
                    }}
                />
            </div>
            <div>
                <h2>Messages:</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Type a message"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement
                            sendMessage(target.value);
                            target.value = ''; // Clear the input
                        }
                    }}
                />
            </div> */}
            <video ref={localVideoRef} autoPlay playsInline style={{ width: '300px', height: 'auto', border: '1px solid black' }} />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', height: 'auto', border: '1px solid black' }} />
            <input
                type="text"
                placeholder="video to peer ID"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement
                        callPeer(target.value);
                        target.value = ''; // Clear the input
                    }
                }}
            />
        </div>
    );
};

export default PeerChat;

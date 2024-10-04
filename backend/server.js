// server.js
const { PeerServer } = require('peer');

const peerServer = PeerServer({
    port: 9000,   // Server will run on port 9000
    path: '/myapp',
    cors: {
        origin: '*', // Replace '*' with your frontend URL in production for security
        methods: ['GET', 'POST', 'OPTIONS', 'WebSocket']
    }
});

peerServer.on('connection', (client) => {
	console.log(`Client connected: ${client.id}`)
})

peerServer.on('disconnect', (client) => {
	console.log(`Client disconnected: ${client.id}`)
})

peerServer.on("error", (error) => {
    console.log("error has occured: ", error)
})

console.log("Peer server listening on port 9000")

import express from 'express'
const app = express()
const PORT = process.env.PORT || 9001

app.use(express.json())

const queue = []

app.get("/join", (req, res) => {
    //get the Peer id
    const peerId = ""
    if (queue.length === 0 ){
        queue.push(peerId)
        res.status(202).json({message: "You're first in line"})
    }
    else {
        const pair = queue.pop()
        res.status(200).json({message: "You've been matched", pairId: pair})
    }
})

app.listen(PORT, () => {
    console.log("Pairing server is running on http://localhost:", PORT)
})
// server.js
const { PeerServer } = require('peer');
const express = require('express');
const cors = require('cors')

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

const app = express()
const PORT = process.env.PORT || 9001

app.use(express.json())
app.use(cors())

const queue = []

app.post("/pair", (req, res) => {
    //get the Peer id
    let peerId;
    let username
    try {
        peerId = req.body.peerId
        username = req.body.username
        console.log("peerId server found is: ", peerId)
    }catch(err){
        console.log("no peer id found")
        res.status(400).json({message: "no peer id or no username found in request to pairing server"})
    }
    if (queue.length === 0 ){
        queue.push({peerId, username})
        res.status(202).json({message: "You're first in line"})
    }
    else {
        const pair = queue.pop()
        res.status(200).json({message: "You've been matched", pairId: pair.pairId, pairUsername: pair.username})
    }
})

app.listen(PORT, () => {
    console.log("Pairing server is running on http://localhost:", PORT)
})
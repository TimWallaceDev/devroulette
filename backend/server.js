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

console.log("server listening on port 9000")

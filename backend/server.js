// server.js
const { PeerServer } = require('peer');
// const https = require('https');
const fs = require('fs');

// Load your SSL certificate and key
const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
};

// Create an HTTPS server
// const server = https.createServer(options);

const peerServer = PeerServer({
    // server: server,
    ssl: options,
    port: 9000,   // Server will run on port 9000
    path: '/myapp',
    cors: {
        origin: '*', // Replace '*' with your frontend URL in production for security
        methods: ['GET', 'POST']
    }
});

peerServer.on("error", (error) => {
    console.log(error)
})

console.log("server listening on port 9000")

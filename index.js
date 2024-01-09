// Import packages
const express = require('express');
const http = require('http'); // Add this line
const path = require('path');
const socketIO = require('socket.io');
const cors = require('cors')

// Middlewares
const app = express();
cors({credentials: true, origin: true})
app.use(cors())
app.use(express.json());




// Create an HTTP server using the Express app
const server = http.createServer(app); // Replace 'app' with your Express app instance



// Import routes pages
const WebSocket = require('./routes/socketIO');
const listApp = require('./routes/app');
const api = require('./routes/api');

// Configuração do Socket.IO
const io = socketIO(server);
WebSocket.Init(io)



// Statics
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
// app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))


// Routes
app.use('/api', api);
app.use('/', listApp);




// connection
const port = process.env.PORT || 9437;
server.listen(port, () =>
  console.log(`Listening to port http://localhost:${port} Node.js v${process.versions.node}!`)
);

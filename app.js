const express = require('express');
const logger = require('./helpers/loghelper');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const kafkaHelper = require('./helpers/kafkahelper');
const kafkaConsumer = require('./helpers/kafkaconsumer');
const WebSocket = require('ws');
const http = require('http');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

kafkaConsumer.on('message', function (message) {
    console.log(JSON.parse(message.value));
    wss.clients.forEach(function each(client) {
        client.send(message.value);
    });
});


// Middlewares
app.use(express.json());
app.use(session({
    genid: (req) => {
        return uuidv4()
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.get("/getSessionId", async (req, res) => {
    res.send(req.sessionID);
});

app.get('/chat', async (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post("/sendmessage", async (req, res) => {
    kafkaHelper.sendMessage(req.body.msg, req.sessionID);
    logger.info(req.body.msg);
});

server.listen(8000);

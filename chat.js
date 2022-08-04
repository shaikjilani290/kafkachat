const express = require('express');
const socketio = require('socket.io');
const kafka = require('kafka-node');
const app = express();
let namespaces = require('./models/namespaces'); 


app.use(express.static(__dirname + '/views'));

const expressServer = app.listen(process.env.PORT||9000);
const io = socketio(expressServer);

io.on('connection', (socket)=>{
    let nsData = namespaces.map((data)=>{
        return {
            img: data.img,
            endpoint: data.endpoint
        };
    });
    socket.emit('nsList', nsData);
});

namespaces.forEach((namespace)=>{

    io.of(namespace.endpoint).on('connection', (nsSocket)=>{
        const username = nsSocket.handshake.query.username;
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback)=>{
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomTitle);
            updateUsersInRoom(namespace, roomTitle);
            nsSocket.join(roomToJoin);
            /*io.of(namespace.endpoint).in(roomToJoin).clients((error, clients)=>{
                numberOfUsersCallback(clients.length);
            });*/
            const nsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle == roomToJoin;
            });
            nsSocket.emit('chatHistory', nsRoom.history);
            updateUsersInRoom(namespace, roomToJoin);
        });
        nsSocket.on('newMessage', (msg)=>{
           
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            }
            
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle == roomTitle;
            });
            const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
            const Producer = kafka.Producer,
            producer = new Producer(client),
            payloads = [
                { topic: 'test', messages:msg.text, partition: 0 },
            
            ];
            producer.on('ready', function () {
             producer.send(payloads, function (err, data) {
                console.log(data);
             });
            });
            
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg);
        });
    });
});

function updateUsersInRoom(namespace, roomToJoin){
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients)=>{
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    });
}

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')

// const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors:{
        origin: "*"
    }
});



// Run when client connects
io.on('connection', socket => {
    socket.on('join', ({ room }) => {
        const user = userJoin(socket.id, room);

        socket.join(user.room);

        console.log(user)

        console.log(getRoomUsers('okbuddy'))
    });

    // Listen for chatMessage
    socket.on('word', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('msg', {msg});
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        console.log(user)
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
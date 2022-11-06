//This is the server for MyChat Application

const app = require('express')();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:3000/",
      methods: ["GET", "POST"]
    }
  });
const port = process.env.PORT || 3000;

app.use(cors())
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  });

// const io = require('socket.io')(5500)

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name =>{
        console.log("New user : ", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });


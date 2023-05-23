const express       = require('express');
const cors          = require('cors');
const bodyParser    = require('body-parser');
const app           = express();
const swaggerUi     = require('swagger-ui-express')
const swaggerFile   = require('./swagger_output.json')
const port          = 8000;
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/uploads',express.static(__dirname + '/uploads'));
const router = require('./routes');
app.use("/api", router.api);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
const path = require('path');
app.use(express.static(path.resolve(__dirname, 'client')));
app.get('/sample', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://${swaggerFile.host}/swagger`);
});
  
// socket io intregate

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    }
});
const {userJoin,getCurrentUser,userLeave,getRoomUsers } = require("./utils/users");
const formatMessage = require("./utils/messages");
const botName = "ChatCord Bot";
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
      // console.log("joinRoom",socket.id, username, room)
      const user = userJoin(socket.id, username, room);
      socket.join(user.room);

      // Welcome current user
      socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

      // Broadcast when a user connects
      socket.broadcast.to(user.room).emit("message",formatMessage(botName, `${user.username} has joined the chat`));

      // Send users and room info
      io.to(user.room).emit("roomUsers", {room: user.room,users: getRoomUsers(user.room)});
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      let user = getCurrentUser(socket.id);
      if(!user){
        const user = userJoin(socket.id, msg.username, msg.room);
        socket.join(user.room);
      }
      user = getCurrentUser(socket.id);
      if(user){
        io.to(user.room).emit("message", formatMessage(user.username, msg));
      }
    });

    // Typing for chatMessage
    socket.on("typing", (msg) => {
      let user = getCurrentUser(socket.id);
      // console.log("Typing",user,socket.id,msg,"===========")
      if(!user){
        const user = userJoin(socket.id, msg.username, msg.room);
        socket.join(user.room);
      }
      user = getCurrentUser(socket.id);
      if(user){
        if(msg==false){
          socket.broadcast.to(user.room).emit("typing",formatMessage(user.username,msg));
        }else{
          socket.broadcast.to(user.room).emit("typing",formatMessage(user.username,msg.status,msg.username));
        }
      }
    });

    // Check room user
    socket.on("checkRoom", (msg) => {
      let user = getCurrentUser(socket.id);
      let st = false
      if(!user){
        st = msg
        const user = userJoin(socket.id, msg.username, msg.room);
        socket.join(user.room);
      }
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      console.log("Disconnect",user)
      if (user) {
        io.to(user.room).emit("message",formatMessage(botName, `${user.username} has left the chat`));
        // Send users and room info
        io.to(user.room).emit("roomUsers", {room: user.room,users: getRoomUsers(user.room)});
      }
    });
  });  
const express       = require('express');
const cors          = require('cors');
const bodyParser    = require('body-parser');
const app           = express();
const swaggerUi     = require('swagger-ui-express')
const swaggerFile   = require('./swagger_output.json')
const port          = 8000;
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded( { extended : true } ));
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
      console.log(socket.id, username, room)
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
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit("message",formatMessage(botName, `${user.username} has left the chat`)
        );
        // Send users and room info
        io.to(user.room).emit("roomUsers", {room: user.room,users: getRoomUsers(user.room)});
      }
    });
  });  
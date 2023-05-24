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
app.set('view engine', 'ejs')
app.get('/sample',async (req, res) => {
    let ChatRoomModel  =      Model.ChatRoom
    let GroupModel     =      Model.Group
    rooms  = await ChatRoomModel.findAll({})
    groups = await GroupModel.findAll({})
    res.render(__dirname+'/views/index.ejs',{rooms:rooms,groups:groups});
});
app.get('/sample1',async (req, res) => {
  let type            =     req.query.type
  let ChatRoomModel   =     Model.ChatRoom
  let GroupModel      =     Model.Group
  let chatroom_id     =     req.query.chatroom_id
  // console.log("###",chatroom_id)
  let str = '<option value="">Select</option>'
  if(type=="Group"){
    let gr_query={}
    gr_query['where'] = {}
    gr_query['where']['id'] = chatroom_id
    gr_query['include'] = [
      {
        model:Model.User,
        attributes:["id","first_name","user_id"],
        required:true
      },{
        model:Model.GroupsParticipant,
        attributes:["id","user_id"],
        include:{
          model:Model.User,
          attributes:["id","user_id","first_name"],
          required:true
        },
        required:false
      }
    ]
    groups = await GroupModel.findOne(gr_query)
    if(groups){
      str += '<option value='+groups.User.id+'>'+groups.User.first_name+'</option>'
      for (let i = 0; i < groups['GroupsParticipants'].length; i++) {
        if(groups.User.id!=groups['GroupsParticipants'][i].User.id){
          str += '<option value='+groups['GroupsParticipants'][i].User.id+'>'+groups['GroupsParticipants'][i].User.first_name+'</option>'
        }
      }
    }
  }else{
    let rm_query={}
    rm_query['where'] = {}
    rm_query['where']['id'] = chatroom_id
    rm_query['include'] = [
      {
        model:Model.ChatRoomParticipant,
        include:{
          model:Model.User,
          attributes:["id","first_name","user_id"],
          required:true
        },
        required:true
      },{
        model:Model.User,
        attributes:["id","first_name","user_id"],
        required:true
      }
    ]
    rooms  = await ChatRoomModel.findOne(rm_query)
    if(rooms){
      str += '<option value='+rooms.User.id+'>'+rooms.User.first_name+'</option>'
      // console.log(rooms,rooms.ChatRoomParticipants.User)
      for (let i = 0; i < rooms.ChatRoomParticipants.length; i++) {
        str += '<option value='+rooms['ChatRoomParticipants'][i].User.id+'>'+rooms['ChatRoomParticipants'][i].User.first_name+'</option>'
      }
    }
  }
  response = {'data':str}
  res.send(response);
});
app.get('/samplechat',async (req, res) => {
  let UserModel   =     Model.User
  let hostlink = swaggerFile.host
  // console.log(req.query.user_id)
  let username = await UserModel.findOne({where:{id:req.query.user_id}})
  res.render(__dirname+'/views/chat.ejs',{data:req.query,hostlink:hostlink,username:username.first_name});
});
let Model                 =      require("./models");
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

let ChatRoomHistoryModel  =      Model.ChatRoomHistory
let GroupChatModel        =      Model.GroupChat
io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ username, room ,chattype}) => {
      console.log( username, room ,chattype)
      const user = userJoin(socket.id, username, room,chattype);
      socket.join(user.room);

      // Welcome current user
      // socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

      let query={}
      query['where'] = {}
      if(chattype=="Individual"){
        query['include'] = [
            {
              model:Model.User,
              attributes:["id","first_name","user_id"],
              required:true
            }
        ]
        let History =  await ChatRoomHistoryModel.findAll(query)
        for (let i = 0; i < History.length; i++) {
          socket.emit("message", formatMessage(History[i].User.first_name,History[i]));
        }
      }else{
        let History =  await GroupChatModel.findAll(query)
        for (let i = 0; i < History.length; i++) {
          socket.emit("message", formatMessage(History[i].User.first_name,History[i]));
        }
      }
      // Broadcast when a user connects
      // socket.broadcast.to(user.room).emit("message",formatMessage(botName, `${user.username} has joined the chat`));

      // Send users and room info
      io.to(user.room).emit("roomUsers", {room: user.room,users: getRoomUsers(user.room)});
    });

    // Listen for chatMessage
    socket.on("chatMessage", async (msg) => {
      // console.log(msg)
      let user = getCurrentUser(socket.id);
      user = getCurrentUser(socket.id);
      if(user){
        console.log("###",user)
        let resResp = null
        if(user.chattype  ==  "Individual"){
          resResp = await ChatRoomHistoryModel.create(msg)
        }else{
          resResp = await GroupChatModel.create(msg)
        }
        io.to(user.room).emit("message", formatMessage(user.username,resResp));
      }
    });

    // Typing for chatMessage
    socket.on("typing", (msg) => {
      let user = getCurrentUser(socket.id);
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
        const user = userJoin(socket.id, msg.username, msg.room,msg.chattype);
        socket.join(user.room);
      }
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      console.log("Disconnect",user)
      if (user) {
        // io.to(user.room).emit("message",formatMessage(botName, `${user.username} has left the chat`));
        // Send users and room info
        io.to(user.room).emit("roomUsers", {room: user.room,users: getRoomUsers(user.room)});
      }
    });
  });  
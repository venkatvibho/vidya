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
    groups = await GroupModel.findAll({where:{is_deleted:true}})
    res.render(__dirname+'/views/home.ejs',{rooms:rooms,groups:groups});
});
const {userJoin,getCurrentUser,userLeave,getRoomUsers,getOptionsList,RoomUsersList,MessagesList } = require("./utils/users");
const formatMessage = require("./utils/messages");
app.get('/sample1',async (req, res) => {
  let response = await getOptionsList(req)
  res.send(response);
});
app.get('/samplechat',async (req, res) => {
  let UserModel   =     Model.User
  let hostlink = swaggerFile.host
  let username = await UserModel.findOne({where:{id:req.query.user_id}})
  res.render(__dirname+'/views/sample.ejs',{data:req.query,hostlink:hostlink,username:username.first_name});
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
let Model                       =      require("./models");
let botName                     =      "ChatCord Bot";
let ChatRoomHistoryModel        =      Model.ChatRoomHistory
let GroupChatModel              =      Model.GroupChat
let ChatRoomHistoryViewedModel  =      Model.ChatRoomHistoryViewed
let ChatRoomParticipantModel    =      Model.ChatRoomParticipant
let GroupsParticipantModel      =      Model.GroupsParticipant
let GroupChatViewedModel        =      Model.GroupChatViewed
io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ username, room ,chattype,user_id}) => {
      console.log("#######refrshRemaining",username)
      console.log( username, room ,chattype)
      const user = userJoin(socket.id, username, room,chattype,user_id);
      socket.join(user.room);

      // Welcome current user
      // socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

      let query={}
      query['where'] = {}
      query['attributes']= {}
      let chatroom = await room.split('_')
      if(chattype=="Individual"){
        query['where']['chatroom_id'] = chatroom[0]
        try{
          await ChatRoomHistoryViewedModel.update({is_viewed:true},{where:{chatroom_id:chatroom[0],is_viewed:false,user_id:user_id}})
        }catch(err){
          console.log(err)
        }
        let History =  await MessagesList(chattype,query,user_id)
        for (let i = 0; i < History.length; i++) {
          socket.emit("message", formatMessage(History[i].User.first_name,History[i],null,0));
        }
      }else{
        query['where']['group_id'] = chatroom[0]
        try{
          await GroupChatViewedModel.update({is_viewed:true},{where:{group_id:chatroom[0],is_viewed:false,user_id:user_id}})
        }catch(err){
          console.log(err)
        }
        let History = await MessagesList(chattype,query,user_id)
        console.log(History)
        for (let i = 0; i < History.length; i++) {
          socket.emit("message", formatMessage(History[i].User.first_name,History[i],null,0));
        }
      }

      // Broadcast when a user connects
      // socket.broadcast.to(user.room).emit("message",formatMessage(botName, `${user.username} has joined the chat`));
      socket.broadcast.to(user.room).emit("refrshRemaining",true)

      // Send users and room info
      io.to(user.room).emit("roomUsers", {room: user.room,users: getRoomUsers(user.room)});
    });

    // Typing for refresh chatMessage
    socket.on("refrshRemaining", async (udetails) => {
      console.log("#######refrshRemaining",udetails)
      let username    = await udetails.username
      let room = await udetails.room
      let user_id = await udetails.user_id
      let chattype = await udetails.chattype
      let chatroom_id = await udetails.chatroom_id
      let query={}
      query['where'] = {}
      query['attributes']= {}
      if(chattype=="Individual"){
        query['where']['chatroom_id'] = chatroom_id
        try{
          await ChatRoomHistoryViewedModel.update({is_viewed:true},{where:{is_viewed:false,user_id:user_id}})
        }catch(err){
          console.log(err)
        }
        let History =  await MessagesList(chattype,query,user_id)
        for (let i = 0; i < History.length; i++) {
          socket.emit("message", formatMessage(History[i].User.first_name,History[i],null,0));
        }
      }else{
        query['where']['group_id'] = chatroom_id
        try{
          await GroupChatViewedModel.update({is_viewed:true},{where:{is_viewed:false,user_id:user_id}})
        }catch(err){
          console.log(err)
        }
        let History = await MessagesList(chattype,query,user_id)
        for (let i = 0; i < History.length; i++) {
          socket.emit("message", formatMessage(History[i].User.first_name,History[i],null,0));
        }
      }
    });

    // Listen for chatMessage
    socket.on("chatMessage", async (msg) => {
      console.log("#######chatMessage",msg)
      try{
        if(!msg.is_image){
          msg['is_image'] = false
        }else{
          msg['is_image'] = true
        }
      }catch(err){
        msg['is_image'] = false
      }
      let user = getCurrentUser(socket.id);
      if(user){
        let resResp = null
        let query={}
        query['where'] = {}
        query['attributes']= {}
        let is_viewed = false
        let AllRoomUsers = await RoomUsersList(user.room)
        if(user.chattype  ==  "Individual"){
          resResp = await ChatRoomHistoryModel.create(msg)
          let Paricipants = await ChatRoomParticipantModel.findAll({where:{chatroom_id:msg.chatroom_id}},"id user_id")
          for (let i = 0; i < Paricipants.length; i++){
            if(user.user_id!=Paricipants[i].user_id){
              try{
                if(AllRoomUsers.includes(Paricipants[i].user_id)){ 
                  is_viewed = true
                }else{
                  is_viewed = false 
                }
                await ChatRoomHistoryViewedModel.create({is_viewed:is_viewed,chatroom_id:msg.chatroom_id,chat_room_history_id:resResp.id,user_id:user.user_id})
              }catch(err){
                console.log(err)
              }
            }
          }
          query['where']['id'] = resResp.id
        }else{
          resResp = await GroupChatModel.create(msg)
          let Paricipants = await GroupsParticipantModel.findAll({where:{group_id:msg.group_id}},"id user_id")
          for (let i = 0; i < Paricipants.length; i++){
            if(user.user_id!=Paricipants[i].user_id){
              try{
                if(AllRoomUsers.includes(Paricipants[i].user_id)){ 
                  is_viewed = true
                }else{
                  is_viewed = false 
                }
                await GroupChatViewedModel.create({is_viewed:is_viewed,group_id:msg.group_id,group_chat_id:resResp.id,user_id:user.user_id})
              }catch(err){
                console.log(err)
              }
            }
          }
          query['where']['id'] = resResp.id
        }
        resResp = await MessagesList(user.chattype,query,msg.user_id)
        io.to(user.room).emit("message", formatMessage(user.username,resResp[0],null,0));
      }
    });

    // Typing for chatMessage
    socket.on("typing", (msg) => {
      let user = getCurrentUser(socket.id);
      console.log(user)
      if(user){
        if(msg==false){
          socket.broadcast.to(user.room).emit("typing",formatMessage(user.username,msg,null,0));
        }else{
          socket.broadcast.to(user.room).emit("typing",formatMessage(user.username,msg.status,msg.username,0));
        }
      }
    });

    // Check room user
    socket.on("checkRoom", (msg) => {
      let user = getCurrentUser(socket.id);
      let st = false
      if(!user){
        console.log(socket.id)
        st = msg
        const user = userJoin(socket.id, msg.username,msg.room,msg.chattype,msg.user_id);
        socket.join(user.room);
      }
    });

    // Runs when client disconnects
    socket.on("RemoveUser", () => {
      const user = userLeave(socket.id);
      console.log("Disconnect",user)
      if (user) {
        // io.to(user.room).emit("message",formatMessage(botName, `${user.username} has left the chat`));
        // Send users and room info
        io.to(user.room).emit("roomUsers", {room: user.room,users: getRoomUsers(user.room)});
      }
    });
  });

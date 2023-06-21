const users = [];

// Join user to chat
function userJoin(id, username, room ,chattype,user_id) {
  const user = { id, username, room ,chattype,user_id};
  // try{
  //   users = userLeaveBasedOnUid(user_id,room)
  // }catch(err){
  //   // console.log("#### Remove User",err)
  // }
  users.push(user);
  return user;
}

// User leaves chat
function userLeaveBasedOnUid(user_id,room) {
  const index = users.findIndex(user => user.user_id === user_id && user.room === room);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get current user
function getCurrentUser(id) {
  // console.log(users)
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// Get room users
function RoomUsersList(room) {
  let AllUs = users.filter(user => user.room === room);
  let ListUser = []
  if(AllUs){
    for (let i = 0; i < AllUs.length; i++) {
      ListUser.push(AllUs[i].user_id)
    }
  }
  console.log("Users List",ListUser)
  return ListUser
}

const getOptionsList = async (req)=> {
  let Model           =     require("../models");
  let type            =     req.query.type
  let ChatRoomModel   =     Model.ChatRoom
  let GroupModel      =     Model.Group
  let chatroom_id     =     req.query.chatroom_id
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
          attributes:["id","user_id","first_name","photo_1"],
          required:true
        },
        required:false
      }
    ]
    groups = await GroupModel.findOne(gr_query)
    if(groups){
      // str += '<option value='+groups.User.id+'>'+groups.User.first_name+'</option>'
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
      // str += '<option value='+rooms.User.id+'>'+rooms.User.first_name+'</option>'
      // console.log(rooms,rooms.ChatRoomParticipants.User)
      for (let i = 0; i < rooms.ChatRoomParticipants.length; i++) {
        str += '<option value='+rooms['ChatRoomParticipants'][i].User.id+'>'+rooms['ChatRoomParticipants'][i].User.first_name+'</option>'
      }
    }
  }
  return {'data':str}
}

const MessagesList = async (chattype,query,user_id)=> {
  let Model                       =      require("../models");
  let Sequelize                   =      require("sequelize");
  let Op                          =      Sequelize.Op;
  let ChatRoomHistoryModel        =      Model.ChatRoomHistory
  let GroupChatModel              =      Model.GroupChat
  let ChatRoomHistoryViewedModel  =      Model.ChatRoomHistoryViewed
  let History = {}
  if(chattype=="Individual"){
    // query['attributes']['include'] = [
    //   [
    //       Sequelize.literal(`(SELECT COUNT(id) FROM public.chat_room_history_viewed WHERE is_viewed=true AND chat_room_history_id="ChatRoomHistory"."id" AND user_id=${user_id})`),'is_viewed'
    //   ]
    // ]
    query['include'] = [
        {
          model:Model.User,
          attributes:["id","first_name","photo_1"],
          required:true
        },
        {
          model:Model.ChatRoom,
          attributes:["id"],
          include:{
            model:Model.ChatRoomParticipant,
            where:{user_id:{[Op.ne]:user_id}},
            required:true
          },
          required:true
        },
        {
          model:Model.ChatRoomHistoryViewed,
          attributes:["user_id","is_viewed"],
          where:{user_id:{[Op.ne]:user_id}},
          include:{
            model:Model.User,
            attributes:["id","first_name"],
            required:true
          },
          required:false
        }
    ]
    query['order'] =[ ['id', 'ASC']]
    History =  await ChatRoomHistoryModel.findAll(query)
  }else{
    // query['attributes']['include'] = [
    //   [
    //       Sequelize.literal(`(SELECT COUNT(id) FROM public.group_chat_viewed WHERE is_viewed=true AND group_chat_id="GroupChatViewed"."id" AND user_id=${user_id})`),'is_viewed'
    //   ]
    // ]
    query['include'] = [
      {
        model:Model.User,
        attributes:["id","first_name"],
        required:true
      },
      {
        model:Model.Group,
        attributes:["id","title"],
        include:{
          model:Model.GroupsParticipant,
          where:{user_id:{[Op.ne]:user_id}},
          required:false
        },
        required:true
      },
      {
        model:Model.GroupChatViewed,
        attributes:["user_id","is_viewed"],
        where:{user_id:{[Op.ne]:user_id}},
        include:{
          model:Model.User,
          attributes:["id","first_name"],
          required:false
        },
        required:false
      }
    ]
    query['order'] =[ ['id', 'ASC']]
    History =  await GroupChatModel.findAll(query)
  }
  return History
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getOptionsList,
  RoomUsersList,
  MessagesList
};

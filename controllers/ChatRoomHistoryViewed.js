const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.ChatRoomHistoryViewed

const create = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistoryViewed']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["chatroom_id","chat_room_history_ids"], 
        "properties": { 
          "chatroom_id": { 
            "type": "number",
            "description":"Take id from ChatRoom"
          },
          "chat_room_history_ids": { 
            "type": "array",
            "description":"Take id from ChatRoomHistory"
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  try{
    let ChatIds = []
    if(req.body.chat_room_history_ids){
      for (const sid of req.body.chat_room_history_ids) {  
        ChatIds.push(sid)
      }
    }else{
      let query      =  {}
      query['attributes']= {}
      query['exclude']= ["replied_chat_room_history_id","message","is_deleted","chatroom_id","updatedAt","createdAt","user_id","is_viewed","send_type"]
      query['attributes']['include'] = [
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.chat_room_history_viewed WHERE chat_room_history_id="ChatRoomHistory"."id" AND user_id=${req.user.id})`),'isViewed'
        ]
      ]
      query['where'] =  {}
      query['where']['chatroom_id'] = req.body.chatroom_id
      let MsgList = await Model.ChatRoomHistory.findAll(query)
      if(MsgList){
        for (const msgid of MsgList) {  
          if(msgid.isViewed==0){
            ChatIds.push(msgid.id)
          }
        }
      }
    }
    if(ChatIds){
      for (const id of ChatIds) {  
        let FinalObj = {}
        FinalObj.user_id = req.user.id
        FinalObj.chat_room_history_id = id
        try{
          await ThisModel.create(FinalObj)
        }catch(err){
          console.log(err)
        }
      }
    }
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }catch(err){
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.User,
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },
    {
      model:Model.Activity,
      include:{
        model:Model.MasterActivity,
        attributes:["id","title","icon","is_active"],
        required:true
      },
      required:true
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistoryViewed']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      query['distinct'] = true
      query['order'] =[ ['id', 'DESC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistoryViewed']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistoryViewed']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
          }
        } 
      } 
    }
  */
  return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
    records = await ThisModel.findByPk(req.params.id);
    await Helper.SuccessValidation(req,res,records,'Updated successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const remove = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistoryViewed']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistoryViewed']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
    let theArray = req.params.ids 
    if(!Array.isArray(theArray)){theArray = theArray.split(",");}
    for (let index = 0; index < theArray.length; ++index) {
      const rowid = theArray[index];
      await ThisModel.destroy({where:{id:rowid}}).then((response) => {}).catch((err) => {});
    }
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
}


module.exports = {create,list, view, update, remove, bulkremove};
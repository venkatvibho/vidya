const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.ChatRoomHistory

const create = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistory']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["chatroom_id","message","send_type","replied_chat_room_history_id"], 
        "properties": { 
          "chatroom_id": { 
            "type": "number",
            "deascription":"Take id from ChatRoom"
          },
          "message": { 
            "type": "string",
            "deascription":"Enter message here"
          },
          "replied_chat_room_history_id": { 
            "type": "number",
            "deascription":"Take id from ChatRoomHistoryList"
          },
          "send_type": { 
            "type": "array",
            "enum":["Sent","Share","Forward","Replay"]
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  await body('send_type').isIn(["Sent","Share","Forward","Replay"]).withMessage('Marital Status must be Sent | Share | Forward | Replay').run(req)
  if(req.body.send_type=="Forward" || req.body.send_type=="Replay"){
    await body('replied_chat_room_history_id').notEmpty().withMessage('replied_chat_room_history_id is required').custom(async (value, req) => {
      try {
      const user = await ThisModel.findByPk(req.body.replied_chat_room_history_id)
        if (!user) {
          return Promise.reject('invalid replied_chat_room_history_id')
        }
      } catch (e) {
        return Promise.reject(e)
      }
    })
    .normalizeEmail()
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    req.body['user_id'] = req.user.id
    req.body['is_deleted'] = false
    return await ThisModel.create(req.body).then(async(doc) => {
      await Helper.SuccessValidation(req,res,doc,'Added successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.User,
      attributes:["id","first_name"],
      required:true
    },
    {
      model:Model.ChatRoom,
      attributes:["id"],
      include:{
        model:Model.ChatRoomParticipant,
        where:{user_id:{[Op.ne]:req.user.id}},
        required:true
      },
      required:true
    },
    {
      model:Model.ChatRoomHistoryViewed,
      attributes:["user_id","is_viewed"],
      where:{user_id:{[Op.ne]:req.user.id}},
      include:{
        model:Model.User,
        attributes:["id","first_name"],
        required:true
      },
      required:false
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistory']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['chatroom_id'] = {in: 'query',type:'number',required:true}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['where']['chatroom_id'] = req.query.chatroom_id
      query['include'] = await commonGet(req, res,{})
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      // query['distinct'] = true
      query['order'] =[ ['id', 'ASC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistory']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistory']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "first_name": { 
            "type": "string",
          },
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
  // #swagger.tags = ['ChatRoomHistory']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['ChatRoomHistory']
  // #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
    let theArray = req.params.ids 
    if(!Array.isArray(theArray)){theArray = theArray.split(",");}
    for (let index = 0; index < theArray.length; ++index) {
      const rowid = theArray[index];
      await ThisModel.destroy({where:{id:rowid}}).then((response) => {}).catch((err) => {});
    }
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
}


module.exports = {create,list, view, update, remove, bulkremove};
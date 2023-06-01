const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.ChatRoom

const create = async (req, res) => {
  // #swagger.tags = ['ChatRoom']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "participants": { 
            "type": "array",
            "description":"Enter userids like:[1,2,3]"
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  // await body('participants').isArray({min:1}).withMessage('Min of 1 participant required.').run(req)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    req.body['user_id'] = req.user.id
    let participants = []
    if(req.body.participants){
      participants = req.body.participants
      delete req.body.participants
    }
    return await ThisModel.create(req.body).then(async(doc) => {
      await Model.ChatRoomParticipant.create({user_id:req.user.id,chatroom_id:doc.id})
      if(participants){
        for (const uid of participants) {  
          try{
            await Model.ChatRoomParticipant.create({user_id:uid,chatroom_id:doc.id})
          }catch(err){
            console.log(err)
          }
        }
      }
      await Helper.SuccessValidation(req,res,doc,'Added successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const commonGet = async (req,res,whereInclude) => {
  let poll_created_for_me = null
  if(req.query.poll_created_for_me){
    poll_created_for_me = req.query.poll_created_for_me
  }
  return [
    {
      model:Model.ChatRoomParticipant,
      where:(poll_created_for_me)?{user_id:poll_created_for_me}:{},
      include:{
        model:Model.User,
        attributes:["id","first_name","user_id","photo_1"],
        required:true
      },
      required:true
    },
    {
      model:Model.ChatRoomHistory,
      as:"Chat_Room_History",
      order: [ ['id', 'desc'] ],
      required:false
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['ChatRoom']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['keyword'] = {in: 'query',type:'string'}
  //  #swagger.parameters['poll_created_by_me'] = {in: 'query',type:'number','description':"Created By me"}
  //  #swagger.parameters['poll_created_for_me'] = {in: 'query',type:'number','description':"Invited For me"}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['attributes']= {}
      query['attributes']['include'] = [
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.chat_room_history_viewed WHERE is_viewed=false AND chatroom_id="ChatRoom"."id" AND user_id!=${req.user.id})`),'unOpened'
        ]
      ]
      if(req.query.poll_created_by_me){
        query['where']['user_id'] = req.query.poll_created_by_me 
      }
      if(req.query.keyword){
        var quote_str =  await Helper.StringToSingleCOde(req.query.keyword);
        query['where'][Op.or] =[
          Sequelize.literal('"Chat_Room_History"."message" LIKE '+quote_str),
          Sequelize.literal('"ChatRoomParticipants->User"."first_name" LIKE '+quote_str)
        ]
      } 
      query['include'] = await commonGet(req, res,{query:query})
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      query['distinct'] = true
      query['order'] =[ ['id', 'ASC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['ChatRoom']
  let query={}
  query['where'] = {}
  query['include'] = await commonGet(req, res,{query:query})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['ChatRoom']
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
  // #swagger.tags = ['ChatRoom']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['ChatRoom']
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
const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.ChatRoomInvited

const create = async (req, res) => {
  // #swagger.tags = ['ChatRoomInvited']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumber","chat_room_id"], 
        "properties": { 
          "phonenumber": { 
            "type": "array",
            "description":"Array format"
          },
          "chat_room_id": { 
            "type": "number",
          },
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  await body('phonenumber').isArray({min:1}).withMessage('Minimum 1 number required').run(req)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    let qallobj = []
    let phonenos = await req.body.phonenumber
    for (let i = 0; i < phonenos.length; i++) {
      let phone = await phonenos[i]
      let BodyParams = {}
      BodyParams['is_deleted']    = false
      BodyParams['invited_by_id'] = req.user.id
      BodyParams['phonenumber'] = phone
      BodyParams['chat_room_id'] = req.body.chat_room_id
      let Where  = {}
      Where['where'] = BodyParams
      let checkAlready = await ThisModel.count(Where)
      if(checkAlready==0){
        try{
          let doc = await ThisModel.create(BodyParams)
          let CheckRoomCHatInvite = await Model.User.findOne({where:{phonenumber:req.body.phonenumber}})
          if(CheckRoomCHatInvite){
            try{
              await Model.ChatRoomParticipant.create({chatroom_id:doc.chat_room_id,user_id:CheckRoomCHatInvite.id})
              CheckRoomCHatInvite.is_deleted=true
              CheckRoomCHatInvite.save()
            }catch(err){
              console.log(err)
            }
          }
          if(doc){  qallobj.push(doc) }
        }catch(err){
          console.log(err)
        }
      }
    }
    return await Helper.SuccessValidation(req,res,qallobj,'Added successfully')
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
        attributes:["id","title","icon","is_active","photo_1"],
        required:true
      },
      required:true
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['ChatRoomInvited']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['is_deleted'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['phonenumber'] = {in: 'query',type:'number'}
  //  #swagger.parameters['chat_room_id'] = {in: 'query',type:'number','description':'Take from ChatRoom'}
  //  #swagger.parameters['invited_by_user_id'] = {in: 'query',type:'number','description':'Take from User'}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.is_deleted){
        query['where']['is_deleted']  = {$eq:req.query.is_deleted}
      }
      if(req.query.phonenumber){
        query['where']['phonenumber']  = {$eq:req.query.phonenumber}
      }
      if(req.query.chat_room_id){
        query['where']['chat_room_id']  = {$eq:req.query.chat_room_id}
      }
      if(req.query.invited_by_user_id){
        query['where']['invited_by_id']  = {$eq:req.query.invited_by_user_id}
      }
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
  // #swagger.tags = ['ChatRoomInvited']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['ChatRoomInvited']
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
  // #swagger.tags = ['ChatRoomInvited']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['ChatRoomInvited']
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
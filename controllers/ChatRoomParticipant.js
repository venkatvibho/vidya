const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.ChatRoomParticipant

const create = async (req, res) => {
  // #swagger.tags = ['ChatRoomParticipant']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["chatroom_id","participants"], 
        "properties": { 
          "chatroom_id": { 
            "type": "number",
            "description":"Take id fron ChatRoom"
          },
          "participants": { 
            "type": "array",
            "description":"Enter userids like:[1,2,3]"
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  // await body('first_name').isIn('en-US', {ignore: ' '}).withMessage('Name must be alphabetic.').run(req)
  let participants = req.body.participants
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    for (const uid of participants) {  
      try{
        await ThisModel.create({user_id:uid,chatroom_id:req.body.chatroom_id})
      }catch(err){
        console.log(err)
      }
    }
    let query={}
    query['where'] = {}
    query['include'] = await commonGet(req, res,{query:query})
    let records = await ThisModel.findByPk(req.body.chatroom_id);
    await Helper.SuccessValidation(req,res,records,'Added successfully')
  }
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.ChatRoomParticipant,
      include:{
        model:Model.User,
        attributes:["id","first_name","user_id"],
        required:false
      },
      required:false
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['ChatRoomParticipant']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['keyword'] = {in: 'query',type:'string'}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['include'] = await commonGet(req, res,{query:query})
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      query['order'] =[ ['id', 'DESC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['ChatRoomParticipant']
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
  // #swagger.tags = ['ChatRoomParticipant']
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
  // #swagger.tags = ['ChatRoomParticipant']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['ChatRoomParticipant']
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
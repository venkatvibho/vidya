const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.Group

const create = async (req, res) => {
  // #swagger.tags = ['Group']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["title","participants"], 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "participants": { 
            "type": "array",
            "description":"Multiple users like [1,2,3]"
          },
          "title": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "description": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['user_id'] = req.user.id
  let participants = req.body['participants']
  delete req.body['participants']
  return await ThisModel.create(req.body).then(async(doc) => {
    await Model.GroupsParticipant.create({group_id:doc.id,user_id:req.user.id})
    for (const part of participants) {  
      try{
        await Model.GroupsParticipant.create({group_id:doc.id,user_id:part})
      }catch(err){
        console.log(err)
      }
    }
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.GroupsParticipant,
      include:{
        model:Model.User,
        attributes:["id","user_id","first_name","phonenumber"],
        where : (whereInclude)?whereInclude.ParticipantWhere:{},
        required:(whereInclude)?whereInclude.ParticipantReq:false
      },
      required:(whereInclude)?whereInclude.ParticipantReq:false
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['Group']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['created_by_user_id'] = {in: 'query',type:'number','description':"Invited By me"}
  //  #swagger.parameters['participant_user_id'] = {in: 'query',type:'number','description':"Invited For me"}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      let ParticipantReq = false
      let ParticipantWhere = {}
      if(req.query.participant_user_id){
        // query['where']['participants'] = {[Sequelize.Op.contains]: [req.query.participant_user_id]}
        ParticipantReq = true
        ParticipantWhere = {user_id:req.query.participant_user_id}
      }
      query['include'] = await commonGet(req, res,{ParticipantWhere:ParticipantWhere,ParticipantReq:ParticipantReq})
      if(req.query.created_by_user_id){
        query['where']['user_id'] = req.query.created_by_user_id
      }
      console.log(query)
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
  // #swagger.tags = ['Group']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Group']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "participants": { 
            "type": "array",
            "description":"Multiple users like [1,2,3]"
          },
          "title": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "description": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  let participants = null
  if(req.body.participants){
    participants = req.body['participants']
    delete req.body['participants']
  }
  return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
    if(req.body.participants){
      for (const part of participants) {  
        try{
          await Model.GroupsParticipant.create({group_id:doc.id,user_id:part})
        }catch(err){
          console.log(err)
        }
      }
    }
    records = await ThisModel.findByPk(req.params.id);
    await Helper.SuccessValidation(req,res,records,'Updated successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const remove = async (req, res) => {
  // #swagger.tags = ['Group']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Group']
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
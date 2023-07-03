const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.Call

const create = async (req, res) => {
  // #swagger.tags = ['Call']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["is_missed_call","call_user_from_id","call_user_to_id"],
        "properties": { 
          "is_missed_call": { 
            "type": "boolean",
          },
          "call_user_from_id": { 
            "type": "number",
          },
          "call_user_to_id": { 
            "type": "number",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['startDateTime']= await new Date()
  return await ThisModel.create(req.body).then(async(doc) => {
    let query={}
    query['include'] = await commonGet(req, res,{})
    let records = await ThisModel.findByPk(doc.id,query);
    await Helper.SuccessValidation(req,res,records,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.User,
      as:"CallFrom",
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },
    {
      model:Model.User,
      as:"CallTo",
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['Call']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['call_user_from_id'] = {in: 'query',type:'number'}
  //  #swagger.parameters['call_user_to_id'] = {in: 'query',type:'number'}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.params.call_user_from_id){
        query['where']['call_user_from_id'] = req.params.call_user_from_id
      }
      if(req.params.call_user_to_id){
        query['where']['call_user_to_id'] = req.params.call_user_to_id
      }
      query['where'][Op.or] = [{call_user_from_id:req.user.id},{call_user_to_id:req.user.id}]
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
      query['include'] = await commonGet(req, res,{})
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['Call']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Call']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "is_missed_call": { 
            "type": "boolean",
          },
          "startDateTime": { 
            "type": "string",
            "description":"Accepts Date Time Format"
          },
          "endDateTime": { 
            "description":"Accepts Date Time Format"
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
  // #swagger.tags = ['Call']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Call']
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
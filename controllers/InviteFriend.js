const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.InviteFriend

const create = async (req, res) => {
  // #swagger.tags = ['InviteFriend']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["invite_type","invite_to_number_or_id"], 
        "properties": {
          "invite_type": { 
            "type": "string",
            "enum":['Instagram','Facebook','Google Account'],
            "default":"Instagram"
          },
          "invite_to_number_or_id": { 
            "type": "string",
          },
        } 
      } 
    }
  */
  await body('invite_type').withMessage('invite_type Is Required').run(req)
  await body('invite_to_number_or_id').withMessage('invite_type Is Required').run(req)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    req.body['user_id'] = req.user.id
    req.body['created_At'] = await Helper.CurrentDate()
    return await ThisModel.create(req.body).then(async(doc) => {
      await Helper.SuccessValidation(req,res,doc,'Added successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const commonGet = async (req,res,whereInclude) => {
  let includearr = [    
    {
      model:Model.MasterActivity,
      required:false
    }
  ]
  return includearr
}

const list = async (req, res) => {
  //  #swagger.tags = ['InviteFriend']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['invite_type'] = {in: 'query',type:'string',enum:['Instagram','Facebook','Google Account']}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['where']['user_id'] = req.user.id
      if(req.query.invite_type){
        query['where']['invite_type'] = req.query.invite_type
      }
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      query['order'] =[ ['id', 'ASC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['InviteFriend']
  // #swagger.parameters['invite_type'] = {in: 'query',type:'string',enum:['Instagram','Facebook','Google Account']}

  let query={}
  query['where'] = {}
  query['where']['invite_type'] = req.query.invite_type
  query['where']['invite_to_number_or_id'] = req.params.invite_to_number_or_id
  query['where']['user_id'] = req.user.id
  let records = await ThisModel.count(req.params.id,query);
  if(records>0){
    return await Helper.SuccessValidation(req,res,{message:"Already sent"})
  }else{
    return await Helper.ErrorValidation(req,res,{message:"Not sent"})
  }
}

const update = async (req, res) => {
  // #swagger.tags = ['InviteFriend']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "invite_type": { 
            "type": "string",
            "enum":['Instagram','Facebook','Google Account'],
            "default":"Instagram"
          },
          "invite_to_number_or_id": { 
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
  // #swagger.tags = ['InviteFriend']
  try{
    // let record = await ThisModel.destroy({where:{id:req.params.id}})
    let record = ThisModel.update({'is_deleted':true},{where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['InviteFriend']
  // #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
    let theArray = req.params.ids 
    if(!Array.isArray(theArray)){theArray = theArray.split(",");}
    for (let index = 0; index < theArray.length; ++index) {
      const rowid = theArray[index];
      // await ThisModel.destroy({where:{id:rowid}}).then((response) => {}).catch((err) => {});
      await ThisModel.update({'is_deleted':true},{where:{id:rowid}})
    }
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
}


module.exports = {create,list, view, update, remove, bulkremove};
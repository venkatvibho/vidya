const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const Activity = require("../models/Activity");
const ThisModel         =      Model.ActivityUser

const create = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["activity_id","status"], 
        "properties": { 
          "activity_id": { 
            "type": "number",
            "description":"Take id from Activitiy"
          },
          "status": { 
            "type": "string",
            "enum":["Sent","Accepted","Rejected"]
          },
          "user_id":{ 
            "type": "number",
          },
          "rejectedReason": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  if(req.body.status){
    await body('status').isIn(["Sent","Accepted","Rejected"]).withMessage('Status must be Sent | Accepted | Rejected').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    if(req.body['user_id']){
      req.body['user_id'] = req.body['user_id']
    }else{
      req.body['user_id'] = req.user.id
    }
    let uid = req.body['user_id']
    if(req.query.status=="Sent"){
      req.body["sentBy"] = uid
    }
    if(req.body.status=="Accepted"){
      req.body["acceptedAt"] = await Helper.CurrentDate()
      req.body["acceptedBy"] = uid
    }
    if(req.body.status=="Rejected"){
      req.body["rejectedAt"] = await Helper.CurrentDate()
      req.body["rejectedBy"] = uid
    }
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
      attributes:["id","first_name","user_id"],
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
  // #swagger.tags = ['ActivityUser']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['is_notification_screen'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['status'] = {in: 'query',type:'array','description':["Sent","Accepted","Rejected","Joined"]}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.is_notification_screen){
        query['where']['status'] = {[Sequelize.Op.notIn]:['Rejected']}
      }
      if(req.query.activity_id){
        query['where']['activity_id'] = req.query.activity_id
      }
      if(req.query.status){
      let theArray = req.query.status 
        if(!Array.isArray(theArray)){theArray = theArray.split(",");}
        query['where']['status'] = {[Sequelize.Op.In]:theArray}
      }
      query['include'] = await commonGet(req, res,{})
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
  // #swagger.tags = ['ActivityUser']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "status": { 
            "type": "string",
            "enum":["Sent","Accepted","Rejected","Joined"],
            "default":"Sent"
          },
        }
      } 
    }
  */
  if(req.body.status){
    await body('status').isIn(["Sent","Accepted","Rejected","Joined"]).withMessage('Status must be Sent | Accepted | Rejected | Joined').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    try{
      let getPoints = await Model.Activity.findByPk(req.params.id,"activity_id")
      let getMsterPoints = await Model.MasterActivity.findByPk(getPoints.activity_id)
      req.body['f2'] = getMsterPoints.f2_points
      req.body['honour'] = getMsterPoints.honor_points
      req.body['general'] = getMsterPoints.general_points
    }catch(err){
      console.log(err)
    }
    if(req.query.status=="Sent"){
      req.body["sentBy"] = req.user.id
    }
    if(req.query.status=="Accepted"){
      req.body["acceptedAt"] = await Helper.CurrentDate()
      req.body["acceptedBy"] = req.user.id
    }
    if(req.query.status=="Rejected"){
      req.body["rejectedAt"] = await Helper.CurrentDate()
      req.body["rejectedBy"] = req.user.id
    }
    if(req.query.status=="Joined"){
      req.body["joineddAt"] = await Helper.CurrentDate()
    }
    return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
      records = await ThisModel.findByPk(req.params.id);
      await Helper.SuccessValidation(req,res,records,'Updated successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const remove = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
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
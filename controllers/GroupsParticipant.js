const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.GroupsParticipant

const create = async (req, res) => {
  // #swagger.tags = ['GroupsParticipant']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["group_id","user_id"], 
        "properties": { 
          "group_id": { 
            "type":"string",
            "description": "Take id from Group",
          },
          "user_id": { 
            "type":"string",
            "description": "Take id from User",
          }
        }
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  return await ThisModel.create(req.body).then(async(doc) => {
    let loadPushnotification = await require("../utils/notification")
    await loadPushnotification.sendPushnotification(req,res,1,req.body.user_id,doc);
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.User,
      attributes:["id","first_name","user_id"],
      required:true
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['GroupsParticipant']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
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
  // #swagger.tags = ['GroupsParticipant']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['GroupsParticipant']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "group_id": { 
            "type":"string",
            "description": "Take id from Group",
          },
          "user_id": { 
            "type":"string",
            "description": "Take id from User",
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
  // #swagger.tags = ['GroupsParticipant']
  try{
    let UserDetails = await ThisModel.findByPk(req.params.id)
    try{
     //Ger All the fututre activities of particular user and delete it
     let query = {}
     query['where'] = {}
     query['where']['user_id'] = await UserDetails.user_id
     let SubWh = {}
     let current_date    = await Helper.CurrentDate()
     let today           = await Helper.DT_Y_M_D(current_date)
     SubWh['start_date'] = {[Op.gte]: Sequelize.literal(`'${today}'`)}
     // SubWh['start_time'] = {[Op.gte]: Sequelize.literal(`'${current_date.toTimeString()}'`)} 
     let start_time = await current_date.toTimeString()
     query['include'] = {
       model:Model.Activity,
       where:SubWh,
       required:true
     }
     query['raw'] = true
     let ActVts = await Model.ActivityUser.findAll(query)
     if(ActVts){
       for (let act_key = 0; act_key < ActVts.length; act_key++){
         let ActivityDetails = await ActVts[act_key].Activity
         let timeCondition = true
         if(today == ActivityDetails.start_date){
           if(start_time > ActivityDetails.start_time){
             timeCondition = false
           }
         }
         if(timeCondition==true){
           await Model.ActivityUser.destroy({where:{id:ActVts[act_key].id}})
         }
       }
     }
    }catch(err){
      console.log(err)
    }
    // Deleting the posts
    try{
      let postquery = {}
      let postwhere = {}
      postwhere['where'] = {}
      postwhere['where']['group_id']  = {[Op.gt]:0}
      postwhere['where']['user_id']   = {[Op.ne]:UserDetails.user_id}
      postquery['include'] = {
        model:Model.Post,
        where:postwhere,
        attributes:["id"],
        required:true
      }
      let PostUser   = await Model.PostUser.findAll({where:{user_id:UserDetails.user_id},attributes:["id"],postquery,raw:true}).then(accounts => accounts.map(account => account.id));
      let PostUserReport = await Model.PostUserReport.findAll({where:{postuser_id:{[Op.In]:PostUser}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostUserReportReplay = await Model.PostUserReportReplay.findAll({where:{postuserreport_id:{[Op.In]:PostUserReport}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      await Model.PostUserReportReplay.destroy({where:{id:PostUserReportReplay}})
      await Model.PostUserReport.destroy({where:{id:PostUserReport}})
      await Model.PostUser.destroy({where:{id:PostUser}})
    }catch(err){
      console.log(err)
    }
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['GroupsParticipant']
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
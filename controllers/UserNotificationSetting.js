const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.UserNotificationSetting

const create = async (req, res) => {
  // #swagger.tags = ['UserNotificationSetting']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["is_comments_on","is_share_on","is_tag_on","is_reminders_on","is_connect_request_on","is_group_form_request_on","is_activities_on","is_events_on","is_updates_from_friends_on"], 
        "properties": { 
          "is_comments_on": { 
            "type": "boolean",
            "default":false
          },
          "is_share_on": { 
            "type": "boolean",
            "default":false
          },
          "is_tag_on": { 
            "type": "boolean",
            "default":false
          },
          "is_reminders_on": { 
            "type": "boolean",
            "default":false
          },
          "is_connect_request_on": { 
            "type": "boolean",
            "default":false
          },
          "is_group_form_request_on": { 
            "type": "boolean",
            "default":false
          },
          "is_activities_on": { 
            "type": "boolean",
            "default":false
          },
          "is_events_on": { 
            "type": "boolean",
            "default":false
          },
          "is_updates_from_friends_on": { 
            "type": "boolean",
            "default":false
          },
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['user_id'] = req.user.id
  return await ThisModel.create(req.body).then(async(doc) => {
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
  // #swagger.tags = ['UserNotificationSetting']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      // query['where'] = {}
      // if(req.query.page && req.query.page_size){
      //   if (req.query.page >= 0 && req.query.page_size > 0) {
      //     pageSize = req.query.page_size;
      //     skip = req.query.page * req.query.page_size;
      //   }
      //   query['offset'] = skip
      //   query['limit'] = pageSize
      // }
      query['user_id'] = req.user.id
      query['order'] =[ ['id', 'DESC']]
      const noOfRecord = await ThisModel.find(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['UserNotificationSetting']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['UserNotificationSetting']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["is_comments_on","is_share_on","is_tag_on","is_reminders_on","is_connect_request_on","is_group_form_request_on","is_activities_on","is_events_on","is_updates_from_friends_on"], 
        "properties": { 
          "is_comments_on": { 
            "type": "boolean",
            "default":false
          },
          "is_share_on": { 
            "type": "boolean",
            "default":false
          },
          "is_tag_on": { 
            "type": "boolean",
            "default":false
          },
          "is_reminders_on": { 
            "type": "boolean",
            "default":false
          },
          "is_connect_request_on": { 
            "type": "boolean",
            "default":false
          },
          "is_group_form_request_on": { 
            "type": "boolean",
            "default":false
          },
          "is_activities_on": { 
            "type": "boolean",
            "default":false
          },
          "is_events_on": { 
            "type": "boolean",
            "default":false
          },
          "is_updates_from_friends_on": { 
            "type": "boolean",
            "default":false
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
  // #swagger.tags = ['UserNotificationSetting']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['UserNotificationSetting']
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
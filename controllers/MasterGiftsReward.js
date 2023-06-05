const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.MasterGiftsReward

const create = async (req, res) => {
  // #swagger.tags = ['MasterGiftsReward']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["users_count_from","users_count_to","r1_gift_value","r1_users_count","r2_gift_value","r2_users_count","r3_gift_value","r3_users_count","r4_gift_value","r4_users_count","r5_gift_value","r5_users_count"], 
        "properties": { 
          "users_count_from": { 
            "type": "number",
          },
          "users_count_to": { 
            "type": "number",
          },
          "r1_gift_value": { 
            "type": "number",
          },
          "r1_users_count": { 
            "type": "number",
          },
          "r2_gift_value": { 
            "type": "number",
          },
          "r2_users_count": { 
            "type": "number",
          },
          "r3_gift_value": { 
            "type": "number",
          },
          "r3_users_count": { 
            "type": "number",
          },
          "r4_gift_value": { 
            "type": "number",
          },
          "r4_users_count": { 
            "type": "number",
          },
          "r5_gift_value": { 
            "type": "number",
          },
          "r5_users_count": { 
            "type": "number",
          },
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
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
  // #swagger.tags = ['MasterGiftsReward']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
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
  // #swagger.tags = ['MasterGiftsReward']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['MasterGiftsReward']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "users_count_from": { 
            "type": "number",
          },
          "users_count_to": { 
            "type": "number",
          },
          "r1_gift_value": { 
            "type": "number",
          },
          "r1_users_count": { 
            "type": "number",
          },
          "r2_gift_value": { 
            "type": "number",
          },
          "r2_users_count": { 
            "type": "number",
          },
          "r3_gift_value": { 
            "type": "number",
          },
          "r3_users_count": { 
            "type": "number",
          },
          "r4_gift_value": { 
            "type": "number",
          },
          "r4_users_count": { 
            "type": "number",
          },
          "r5_gift_value": { 
            "type": "number",
          },
          "r5_users_count": { 
            "type": "number",
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
  // #swagger.tags = ['MasterGiftsReward']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['MasterGiftsReward']
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
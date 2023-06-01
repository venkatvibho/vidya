const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.GroupChat

const create = async (req, res) => {
  // #swagger.tags = ['GroupChat']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["first_name","phonenumber"], 
        "properties": { 
          "first_name": { 
            "type": "string",
          }
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
  return  [
    {
      model:Model.User,
      attributes:["id","first_name","photo_1"],
      required:true
    },
    {
      model:Model.Group,
      attributes:["id","title"],
      include:{
        model:Model.GroupsParticipant,
        where:{user_id:{[Op.ne]:req.user.id}},
        required:false
      },
      required:true
    },
    {
      model:Model.GroupChatViewed,
      attributes:["user_id","is_viewed"],
      where:{user_id:{[Op.ne]:req.user.id}},
      include:{
        model:Model.User,
        attributes:["id","first_name"],
        required:false
      },
      required:false
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['GroupChat']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['group_id'] = {in: 'query',type:'number'}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.group_id){
        query['where']['group_id']  = req.query.group_id
      }
      query['attributes']= {}
      // query['attributes']['include'] = [
      //   [
      //       Sequelize.literal(`(SELECT COUNT(id) FROM public.group_chat_viewed WHERE is_viewed=false AND group_chat_id="GroupChatViewed"."id" AND user_id=${req.user.id})`),'unOpened'
      //   ]
      // ]
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      query['include'] = await commonGet(req, res,{query:query})
      // query['distinct'] = true
      query['order'] =[ ['id', 'ASC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['GroupChat']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['GroupChat']
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
  // #swagger.tags = ['GroupChat']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['GroupChat']
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
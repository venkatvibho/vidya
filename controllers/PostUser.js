const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.PostUser

const create = async (req, res) => {
  // #swagger.tags = ['PostUser']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["post_id","user_id"], 
        "properties": { 
          "post_id": { 
            "type": "number",
            "description":"Take id from Post"
          },
          "user_id": { 
            "type": "number",
            "description":"Take id from User"
          },
          "is_hide": { 
            "type": "boolean",
          },
          "is_viewed": { 
            "type": "boolean",
          },
          "is_save": { 
            "type": "boolean",
          },
          "is_liked": { 
            "type": "boolean",
          },
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['status']  = 'Sent'
  return await ThisModel.create(req.body).then(async(doc) => {
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.Post,
      required:false
    },
    {
      model:Model.PostUserReport,
      required:false
    },
    {
      model:Model.PostComment,
      required:false
    },
    {
      model:Model.User,
      attributes:["id","user_id","first_name","phonenumber","photo_1"],
      required:false
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['PostUser']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['post_id'] = {in: 'query',type:'number'}
  //  #swagger.parameters['is_hide'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['is_save'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['is_viewed'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['is_liked'] = {in: 'query',type:'boolean'}
  

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.post_id){
        query['where']['post_id'] = req.query.post_id 
      }
      if(req.query.is_hide){
        query['where']['is_hide'] = req.query.is_hide 
      }
      if(req.query.is_save){
        query['where']['is_save'] = req.query.is_save 
      }
      if(req.query.is_viewed){
        query['where']['is_viewed'] = req.query.is_viewed 
      }
      if(req.query.is_liked){
        query['where']['is_liked'] = req.query.is_liked 
      }
      if('is_hide' in req.query){
        where['is_hide'] = req.query.is_hide 
        reqornot = true
      }
      // if('is_save' in req.query){
      //   where['is_save'] = req.query.is_save
      //   reqornot = true 
      // }
      // if('is_viewed' in req.query){
      //   where['is_viewed'] = req.query.is_viewed
      //   reqornot = true 
      // }
      // if('is_liked' in req.query){
      //   where['is_liked'] = req.query.is_liked
      //   reqornot = true 
      // }
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
  // #swagger.tags = ['PostUser']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['PostUser']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "is_hide": { 
            "type": "boolean",
          },
          "is_viewed": { 
            "type": "boolean",
          },
          "is_save": { 
            "type": "boolean",
          },
          "is_liked": { 
            "type": "boolean",
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
  // #swagger.tags = ['PostUser']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['PostUser']
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
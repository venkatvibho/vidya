const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.PostUserReport

const create = async (req, res) => {
  // #swagger.tags = ['PostUserReport']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["title","description","postuser_id","is_post"], 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "description": { 
            "type": "string",
          },
          "postuser_id": { 
            "type": "number",
            "description":"IF is_post is true means it is public POST so share id off the POST Object here ELSE share id of the PostUser Object",
          },
          "is_post": { 
            "type": "boolean",
            "default":false
          }
        }  
      } 
    }
  */
  if(req.body.is_post==true){
    let checkPost = await Model.Post.count({id:req.body.postuser_id})
    if(checkPost>0){
      try{
        let NewPostUser = await Model.PostUser.create({post_id:req.body.postuser_id,user_id:req.user.id,status:'Sent'})
        req.body['postuser_id'] = NewPostUser.id
      }catch(error){
        console.log(error)
      }
    }
  }
  delete req.body['is_post']
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
      model:Model.PostUser,
      include:{
        model:Model.User,
        attributes:["id","user_id","first_name","phonenumber"],
        required:false
      },
      include:{
        model:Model.Post,
        required:false
      },
      required:false
    },{
      model:Model.PostUserReportReply,
      required:false
    },
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['PostUserReport']
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
      query['order'] =[ ['id', 'DESC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['PostUserReport']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['PostUserReport']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "description": { 
            "type": "string",
          },
          "postuser_id": { 
            "type": "number",
            "description":"Take id from PostUser"
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
  // #swagger.tags = ['PostUserReport']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['PostUserReport']
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
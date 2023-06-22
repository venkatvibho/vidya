const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.SlambookBeat

const create = async (req, res) => {
  // #swagger.tags = ['SlambookBeat']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["user_following_id","beatquestions"], 
        "properties": { 
          "user_following_id": { 
            "type": "number",
            "description":"Take id from UserFollowing"
          },
          "beatquestions": { 
            "type": "array",
            "description": "[Question1,Question2,Question3,Question4,Question5]",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  let resultCount = req.body['beatquestions'].filter(i => i).length;
  if(resultCount<6){
    let beatquestions = req.body['beatquestions']
    delete req.body['beatquestions']
    req.body['status'] = 'Sent'
    req.body['user_from_id'] = req.user.id
    let UserId = await Model.UserFollowing.findByPk(req.body['user_following_id'])
    if(UserId){
      if(UserId.user_from_id && UserId.user_to_id){
        req.body['user_to_id'] = (UserId.user_from_id==req.user.id)?UserId.user_to_id:UserId.user_from_id
        return await ThisModel.create(req.body).then(async(doc) => {
          try{
            for (let i = 0; i < beatquestions.length; i++) {
              await Model.SlambookBeatQuestion.create({title:beatquestions[i],is_active:true,user_following_id:doc.id})
            }
          } catch (err){
            await ThisModel.destroy({where:{id:doc.id}})
          }
          await Helper.SuccessValidation(req,res,doc,'Added successfully')
        }).catch( async (err) => {
          return await Helper.ErrorValidation(req,res,err,'cache')
        })
      }else{
        return await Helper.ErrorValidation(req,res,{message:"Invalid user_following_id provided"},'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid user_following_id provided"},'cache')
    }
  }else{
    return await Helper.ErrorValidation(req,res,{message:"Minimum 5  questions allowed only"},'cache')
  }
}

const commonGet = async (req,res,whereInclude) => {
  let where = {}
  return [
    {
      model:Model.SlambookBeatQuestion,
      required:false
    },{
      model:Model.UserFollowing,
      required:true
    },{
      model:Model.User,
      as:'UserTo',
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },{
      model:Model.User,
      as:'UserFrom',
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['SlambookBeat']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['followed_by_me'] = {in: 'query',type:'number',"description":"Select id From Users"}
  //  #swagger.parameters['followed_to_me'] = {in: 'query',type:'number',"description":"Select id From Users"}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.followed_by_me){
        query['where']['user_to_id'] = req.query.followed_by_me
      }else if(req.query.followed_to_me){
        query['where']['user_from_id'] = req.query.followed_to_me
      }else{
        query['where'][Op.or] = [{user_from_id:req.user.id},{user_to_id:req.user.id}]
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
  // #swagger.tags = ['SlambookBeat']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['SlambookBeat']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "status": { 
            "type": "string",
            "enum":["Sent","Accepted","Rejected"],
          },
          "happiest_moments":{
            "type": "array",
            "description":"Ex:[Moment1,Moment2,Moment3,Moment4]",
          },
          "description":{
            "type": "string",
          },
          "upload_pics": { 
            "type": "array",
            "description":"Ex:[{s3bucketobject},{s3bucketobject}]",
          },
          "beatquestions": { 
            "type": "array",
            "description": "[{qid:1,answer:enter answer},{qid:2,answer:enter answer}]",
          }
        }
      } 
    }
  */
  if(req.body.status){
    await body('status').isIn(["Sent","Accepted","Rejected"]).withMessage('Status must be Sent | Accepted | Rejected').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    let momentLimit = true
    if(req.body.happiest_moments){
      let resultCount = req.body['happiest_moments'].filter(i => i).length;
      if(resultCount<5){
        momentLimit = false
      }
    }
    let beatquestions = null
    if(req.body.beatquestions){
      beatquestions = req.body['beatquestions']
      delete req.body['beatquestions']
    }
    if(momentLimit){
      return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
        if(req.body.beatquestions){
          for (let i = 0; i < beatquestions.length; i++) {
            try{
              await Model.SlambookBeatQuestion.update({answer:beatquestions[i].answer},{where:{id:beatquestions[i].qid}})
            } catch (err){
              console.log(err);
            }
          }
        }
        records = await ThisModel.findByPk(req.params.id);
        await Helper.SuccessValidation(req,res,records,'Updated successfully')
      }).catch( async (err) => {
        return await Helper.ErrorValidation(req,res,err,'cache')
      })
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Minimum 4 moments allowed only"},'cache')
    }
  }
}

const remove = async (req, res) => {
  // #swagger.tags = ['SlambookBeat']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['SlambookBeat']
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
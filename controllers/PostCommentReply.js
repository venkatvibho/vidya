const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.PostCommentReply

const create = async (req, res) => {
  // #swagger.tags = ['PostCommentReply']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["replay_comment","postcomment_id"], 
        "properties": { 
          "replay_comment": { 
            "type": "string",
          },
          "postcomment_id": { 
            "type": "number",
            "description": "Take id from PostComment",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['user_id']=req.user.id
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
  // #swagger.tags = ['PostCommentReply']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['attributes']= {}
      query['attributes']['include'] = [
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_comment_replay_likes WHERE user_id=${req.user.id} AND postcommentreplay_id="PostCommentReply"."id")`),'is_like'
        ],
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_comment_replay_likes WHERE postcommentreplay_id="PostCommentReply"."id")`),'likes_count'
        ],
      ]
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
  // #swagger.tags = ['PostCommentReply']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['PostCommentReply']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "replay_comment": { 
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
  // #swagger.tags = ['PostCommentReply']
  try{
    try{
      let PostCommentReplayLike = await Model.PostCommentReplayLike.findAll({where:{postcommentreplay_id:req.params.id},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      await Model.PostCommentReplayLike.destroy({where:{id:PostCommentReplayLike}})
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
  // #swagger.tags = ['PostCommentReply']
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
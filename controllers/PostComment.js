const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.PostComment

const create = async (req, res) => {
  // #swagger.tags = ['PostComment']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["comment","post_id"], 
        "properties": { 
          "comment": { 
            "type": "string",
          },
          "postuser_id": { 
            "type": "number",
            "description":"IF is_post is true means it is public POST so share id off the POST Object here ELSE share id of the PostUser Object",
          },
          "post_id": { 
            "type": "number",
            "description":"From Post",
          },
          "is_post": { 
            "type": "boolean",
            "default":false
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  if(req.body.is_post==true){
    let checkPost = await Model.Post.count({id:req.body.post_id})
    if(checkPost>0){
      try{
        let NewPostUser = await Model.PostUser.create({post_id:req.body.postuser_id,user_id:req.user.id,status:'Sent'})
        req.body['postuser_id'] = NewPostUser.id
        req.body['post_id'] = NewPostUser.id
      }catch(error){
        console.log(error)
      }
    }
  }
  delete req.body['is_post']
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
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['PostComment']
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
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_comment_likes WHERE user_id=${req.user.id} AND postcomment_id="PostComment"."id")`),'is_liked'
        ],
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_comment_likes WHERE postcomment_id="PostComment"."id")`),'likes_count'
        ],
      ]
      if(req.query.post_id){
          query['include'] = [
          {
            model:Model.PostUser,
            attributes:["id","post_id","user_id"],
            include:{
              model:Model.User,
              attributes:["id","first_name","user_id","photo_1"],
              required:true
            },
            where:{post_id:req.query.post_id},
            required:true
          },
          {
            model:Model.PostCommentReply,
            include:{
              model:Model.User,
              attributes:["id","first_name","user_id","photo_1"],
              required:true
            },
            required:false
          },
          {
            model:Model.PostCommentLike,
            where:{user_id:req.user.id},
            required:false
          }
        ] 
      }
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
      // query['include'] = await commonGet(req, res,{is_whereHide:is_whereHide})
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['PostComment']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['PostComment']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "comment": { 
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
  // #swagger.tags = ['PostComment']
  try{
    try{
      let PostComment = [req.params.id]
      let PostCommentLike = await Model.PostCommentLike.findAll({where:{postcomment_id:{[Op.In]:PostComment}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostCommentReplay = await Model.PostCommentReplay.findAll({where:{postcomment_id:{[Op.In]:PostComment}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostCommentReplayLike = await Model.PostCommentReplayLike.findAll({where:{postcommentreplay_id:{[Op.In]:PostCommentReplay}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      await Model.PostCommentReplayLike.destroy({where:{id:PostCommentReplayLike}})
      await Model.PostCommentLike.destroy({where:{id:PostCommentLike}})
      await Model.PostCommentReplay.destroy({where:{id:PostCommentReplay}})
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
  // #swagger.tags = ['PostComment']
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
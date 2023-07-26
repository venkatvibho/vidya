const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.Post

const create = async (req, res) => {
  // #swagger.tags = ['Post']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["type_of_activity","user_ids"], 
        "properties": { 
          "activity_id": { 
            "type": "number",
            "description":"Take id from Activity"
          },
          "type_of_activity": { 
            "type": "string",
            "enum":["Private","Public","Self"]
          },
          "description": { 
            "type": "string",
          },
          "images":{
            "type": "array",
            "description":"[s3bucketobj1,s3bucketobj2]"
          },
          "user_ids": { 
            "type": "array",
            "description":"Take id From User Ex:[1,2,3]"
          },
          "group_id": { 
            "type": "number",
            "description":"Take id From Group"
          },
          "latitude": { 
            "type": "number",
          },
          "longitude": { 
            "type": "number",
          },
           "location": { 
            "type": "string",
          },
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  if(req.body.type_of_activity){
    await body('type_of_activity').isIn(["Private","Public","Self"]).withMessage('Type of activity must be Private | Public | Self').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    req.body['user_id'] = req.user.id
    req.body['is_deleted'] = false
    return await ThisModel.create(req.body).then(async(doc) => {
      if(req.body.activity_id){
        try{
          let cntGroupCheck = await Model.ActivityUser.count({where:{activity_id:req.body.activity_id,user_id:req.user.id}})
          if(cntGroupCheck == 0){ 
            let getMsterPoints = await Model.MasterActivity.findByPk(getPoints.activity_id)
            let UpActiData = {status:'Compleated',f2:getMsterPoints.f2_points,honour:getMsterPoints.honor_points,general:getMsterPoints.general_points}
            let WhActiData = {activity_id:req.body.activity_id,user_id:req.user.id}
            await Model.ActivityUser.update(WhActiData,UpActiData)
          }
        }catch(err){
          console.log(err)
        }
      }
      if(req.body.type_of_activity == "Private"){
        if(req.body.group_id){
          let participants = await Model.GroupsParticipant.findAll({where:{group_id:req.body.group_id}})
          if(participants){
            for(let i = 0; i < participants.length; i++){
              try{
                let cntGroupCheck = await Model.PostUser.count({where:{post_id:doc.id,user_id:participants[i].user_id}})
                if(cntGroupCheck == 0){ 
                  let GroupUserData = {post_id : doc.id,user_id:participants[i].user_id,status:'Sent'}
                  await Model.PostUser.create(GroupUserData)
                }
              } catch (err){
                console.log(err);
              }
            }
          }
        }
        if(req.body.user_ids){
          let SelectedUsers = req.body.user_ids
          if(SelectedUsers){
            for (let i = 0; i < SelectedUsers.length; i++) {
              try{
                let cntSingUserCheck = await Model.PostUser.count({where:{post_id:doc.id,user_id:SelectedUsers[i]}})
                if(cntSingUserCheck == 0){ 
                  let SingUsersData = {post_id:doc.id,user_id:SelectedUsers[i],status:'Sent'}
                  await Model.PostUser.create(SingUsersData)
                }
              } catch (err){
                console.log(err);
              }
            }
          }
        }
      }
      await Helper.SuccessValidation(req,res,doc,'Added successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const commonGet = async (req,res,whereInclude) => {
  let where = {}
  let reqornot = false
  // if('is_hide' in req.query){
  //   where['is_hide'] = req.query.is_hide 
  //   reqornot = true
  // }
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
  if(req.query.is_hide){
    where['is_hide'] = req.query.is_hide 
    reqornot = true
  }
  if(req.query.is_save){
    where['is_save'] = req.query.is_save
    reqornot = true 
  }
  if(req.query.is_viewed){
    where['is_viewed'] = req.query.is_viewed
    reqornot = true 
  }
  if(req.query.is_liked){
    where['is_liked'] = req.query.is_liked
    reqornot = true 
  }
  where['user_id'] = req.user.id
  let IncludeData = [
    {
      model:Model.Activity,
      required:false
    },{
      model:Model.Group,
      required:false
    },{
      model:Model.User,
      attributes:["id","user_id","first_name","phonenumber","photo_1"],
      required:false
    },{
      model:Model.PostUser,
      where : where,
      include:{
        model:Model.User,
        attributes:["id","user_id","first_name","phonenumber","photo_1"],
        required:false
      },
      required:reqornot
    }
  ]
  return IncludeData
}

const list = async (req, res) => {
  // #swagger.tags = ['Post']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['is_screen_for'] = {in: 'query',type:'string','enum':["dashboard","profile"]}
  //  #swagger.parameters['is_hide'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['is_save'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['is_viewed'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['is_liked'] = {in: 'query',type:'boolean'}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['attributes']= {}
      let sett_where = Sequelize.literal(`("Post"."type_of_activity"='Public' OR (SELECT COUNT(*) FROM public.post_users WHERE post_id="Post"."id" AND user_id=${req.user.id})>1 OR (SELECT COUNT(*) FROM public.posts WHERE id="Post"."id" AND user_id=${req.user.id})>1)`)
      query['where'] = sett_where
      query['attributes']['include'] = [
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_users WHERE is_viewed=true AND post_id="Post"."id")`),'viewed_counts'
        ],
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_users WHERE is_liked=true AND post_id="Post"."id")`),'liked_counts'
        ],
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_comments WHERE post_id="Post"."id")`),'comments_count'
        ],
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.post_users WHERE is_liked=true AND post_id="Post"."id" AND user_id=${req.user.id})`),'is_liked_or_not'
        ],
      ]
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
  // #swagger.tags = ['Post']
  let query={}
  query['where'] = {}
  query['attributes']= {}
  query['attributes']['include'] = [
    [
      Sequelize.literal(`(SELECT COUNT(id) FROM public.post_users WHERE is_viewed=true AND post_id="Post"."id")`),'viewed_counts'
    ],
    [
      Sequelize.literal(`(SELECT COUNT(id) FROM public.post_users WHERE is_liked=true AND post_id="Post"."id")`),'liked_counts'
    ],
  ]
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Post']
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
      records = await ThisModel.findByPk(req.params.id);
      await Helper.SuccessValidation(req,res,records,'Updated successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const remove = async (req, res) => {
  // #swagger.tags = ['Post']
  try{
    try{
      let PostUser   = await Model.PostUser.findAll({where:{post_id:req.params.id},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostUserReport = await Model.PostUserReport.findAll({where:{postuser_id:{[Op.In]:PostUser}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostUserReportReplay = await Model.PostUserReportReplay.findAll({where:{postuserreport_id:{[Op.In]:PostUserReport}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      await Model.PostUserReportReplay.destroy({where:{id:PostUserReportReplay}})
      await Model.PostUserReport.destroy({where:{id:PostUserReport}})
      await Model.PostUser.destroy({where:{id:PostUser}})
    }catch(err){
      console.log(err)
    }
    try{
      let PostComment = await Model.PostComment.findAll({where:{post_id:req.params.id},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostCommentLike = await Model.PostCommentLike.findAll({where:{postcomment_id:{[Op.In]:PostComment}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostCommentReplay = await Model.PostCommentReplay.findAll({where:{postcomment_id:{[Op.In]:PostComment}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      let PostCommentReplayLike = await Model.PostCommentReplayLike.findAll({where:{postcommentreplay_id:{[Op.In]:PostCommentReplay}},attributes:["id"],raw:true}).then(accounts => accounts.map(account => account.id));
      await Model.PostCommentReplayLike.destroy({where:{id:PostCommentReplayLike}})
      await Model.PostCommentLike.destroy({where:{id:PostCommentLike}})
      await Model.PostCommentReplay.destroy({where:{id:PostCommentReplay}})
      await Model.PostComment.destroy({where:{id:PostComment}})
    }catch(err){
      console.log(err)
    }
    let record = await Model.PostUser.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Post']
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
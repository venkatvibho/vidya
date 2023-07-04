const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.UserFollowing

const create = async (req, res) => {
  // #swagger.tags = ['UserFollowing']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["user_to_id"], 
        "properties": { 
          "user_to_id": { 
            "type": "number",
            "description":"Take from User"
          },
          "status": { 
            "type": "string",
            "enum":["Sent","Hide"]
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  if(req.body.status){
    await body('status').isIn(["Sent","Hide"]).withMessage('Status must be Hide | Sent').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    req.body['is_slambook_skip'] = false
    req.body['user_from_id'] = req.user.id
    req.body['is_blocked'] = false
    if(req.query.status=="Hide"){
      req.body["is_hide_at"] = await Helper.CurrentDate()
    }else{
      req.body['status'] = 'Sent'
    }
    return await ThisModel.create(req.body).then(async(doc) => {
      await Helper.SuccessValidation(req,res,doc,'Added successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const commonGet = async (req,res,whereInclude) => {
  let sett_where = Sequelize.literal(`(message !='No one' OR (SELECT COUNT(*) FROM public.user_followings WHERE (user_from_id+user_to_id)="FollowingFrom"."id"+${req.user.id})>1)`)
  // query['where'][Op.or]=sett_where
  // privacy_settings = 
  // {
  //   model:Model.UserPrivacySetting,
  //   where:sett_where,
  //   required:true
  // }
  let WhereInc = [
    {
      model:Model.User,
      as: "FollowingFrom",
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },
    {
      model:Model.User,
      foreignKey: 'user_to_id',
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    }
  ]
  return WhereInc
}

const list = async (req, res) => {
  //  #swagger.tags = ['UserFollowing']
  //  #swagger.parameters['is_screen_for'] = {in: 'query',type:'string','enum':["notifications","slambook","following","followers","addparticipant","--"]}
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['followed_by_me'] = {in: 'query',type:'number',"description":"Select id From Users"}
  //  #swagger.parameters['followed_to_me'] = {in: 'query',type:'number',"description":"Select id From Users"}
  //  #swagger.parameters['is_sort_by'] = {in: 'query',type:'string','enum':["newest","older","alphabet"]}
  //  #swagger.parameters['is_blocked'] = {in: 'query',type:'boolean'}
  //  #swagger.parameters['privacy_settings'] = {in: 'query',type:'string','enum':['Message']}

  try{
      let privacy_settings = []
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['attributes']= {}
      let addparticipant = false
      if(req.query.is_blocked){
        query['where']['is_blocked'] = req.query.is_blocked
      }
      if(req.query.followed_by_me){
        query['where']['user_to_id'] = req.query.followed_by_me
      }else if(req.query.followed_to_me){
        query['where']['user_from_id'] = req.query.followed_to_me
      }else{
        query['where'][Op.or] = [{user_from_id:req.user.id},{user_to_id:req.user.id}]
        // let sett_where = Sequelize.literal(`WHERE (message !='No one' OR (SELECT COUNT(*) FROM public.user_followings WHERE (user_from_id+user_to_id)="User"."id"+${req.user.id})>1)`)
        // // query['where'][Op.or]=sett_where
        // privacy_settings = 
        // {
        //   model:Model.UserPrivacySetting,
        //   where:sett_where,
        //   required:true
        // }
      }
      if(req.query.is_screen_for=="addparticipant"){
        if(req.user){
          delete query['where']['user_from_id']
          delete query['where']['user_to_id'] 
          // query['where']['user_from_id'] = {[Op.or]:[{user_from_id: req.user.id},{user_to_id: req.user.id}]}
          query['where'][Op.or] = [{user_from_id:req.user.id},{user_to_id:req.user.id}]
        }
      }
      let UserFollowingOrder = null
      let UserFollwerOrder   = null
      if(req.query.is_screen_for){
        if(req.query.is_screen_for=="notifications"){
          query['where']['status'] = {[Op.notIn]:['Rejected']}
        }else if(req.query.is_screen_for=="slambook"){
          query['attributes']['include'] = [
            [
              Sequelize.literal(`(SELECT COUNT(id) FROM public.groups_participants WHERE group_id IN(SELECT a.group_id FROM public.groups_participants AS a WHERE a.user_id="UserFollowing".user_to_id) AND user_id="UserFollowing".user_from_id)`),'groups_count'
            ],
            [
              Sequelize.literal(`(SELECT COUNT(id) FROM public.activity_users WHERE activity_id IN(SELECT a.activity_id FROM public.activity_users AS a WHERE a.user_id="UserFollowing".user_to_id) AND user_id="UserFollowing".user_from_id)`),'activities_count'
            ],
          ]
          let date  = require('date-and-time');
          let current_date = await Helper.CurrentDate()
          let today =  date.format(current_date, 'YYYY-MM-DD');
          query['where']['status'] = 'Accepted'
          const moment    = require('moment')
          today = moment(today).subtract(7,'days');
          today = await Helper.DT_Y_M_D(today)
          console.log(today)
          query['where']['acceptedAt'] = {[Op.gte]: Sequelize.literal(`'${today}'`)}
          console.log("Where",query)
        }
      }
      query['include'] = await commonGet(req, res,{UserFollowingOrder:UserFollowingOrder,UserFollwerOrder:UserFollwerOrder,privacy_settings:privacy_settings})
      console.log(query)
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      if(req.query.is_sort_by){
        if(req.query.is_sort_by!="alphabet"){
          if(req.query.is_sort_by=="newest"){
            query['order'] =[ ['id', 'DESC']]
          }else{
            query['order'] =[ ['id', 'ASC']]
          }
        }else{
          if(req.query.is_screen_for=="following"){
            query['order'] =[["FollowingFrom", 'first_name']]
          }else{
            query['order'] =[[Model.User, 'first_name']]
          }
        }
      }
      query['distinct'] = true
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['UserFollowing']
  let check_user_id = req.user.id
  let UserId = await Model.UserFollowing.findByPk(req.params.id)
    if(UserId){
    if(UserId.user_from_id && UserId.user_to_id){
      check_user_id = (UserId.user_from_id==req.user.id)?UserId.user_to_id:UserId.user_from_id
    }
  }
  let query={}
  query['attributes']= {}
  query['attributes']['include'] = [
    [
      Sequelize.literal(`(SELECT SUM(honour) FROM public.activity_users WHERE status='Joined' AND user_id=${check_user_id})`),'honor'
    ],
    [
      Sequelize.literal(`(SELECT SUM(general) FROM public.activity_users WHERE status='Joined' AND user_to_id=${check_user_id})`),'genune'
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
  // #swagger.tags = ['UserFollowing']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "status": { 
            "type": "string",
            "enum":["Sent","Accepted","Rejected","Hide"],
            "default":"Sent"
          },
          "is_muted": { 
            "type": "boolean"
          },
          "is_blocked": { 
            "type": "boolean",
          },
          "is_slambook_skip":{
            "type": "boolean",
          }
        }
      } 
    }
  */
  if(req.body.status){
    await body('status').isIn(["Accepted","Hide","Rejected","Sent"]).withMessage('Status must be Accepted | Hide | Rejected | Sent').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    if(req.body.status=="Accepted"){
      req.body["acceptedAt"] = await Helper.CurrentDate()
    }
    if(req.body.status=="Hide"){
      req.body["is_hide_at"] = await Helper.CurrentDate()
    }
    if(req.body.status=="Rejected"){
      req.body["rejectedAt"] = await Helper.CurrentDate()
    }
    if(req.body.is_slambook_skip){
      req.body["slam_book_skip_date"] = await Helper.CurrentDate()
    }
    return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
      records = await ThisModel.findByPk(req.params.id);
      await Helper.SuccessValidation(req,res,records,'Updated successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
}

const remove = async (req, res) => {
  // #swagger.tags = ['UserFollowing']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['UserFollowing']
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
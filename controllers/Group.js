const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.Group

const create = async (req, res) => {
  // #swagger.tags = ['Group']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["title","participants"], 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "participants": { 
            "type": "array",
            "description":"Multiple users like [1,2,3]"
          },
          "title": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "description": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['user_id'] = req.user.id
  req.body['is_deleted'] = true
  let participants = req.body['participants']
  delete req.body['participants']
  return await ThisModel.create(req.body).then(async(doc) => {
    try{
      await Model.GroupsParticipant.create({group_id:doc.id,user_id:req.user.id})
      for (const part of participants) {  
        try{
          await Model.GroupsParticipant.create({group_id:doc.id,user_id:part})
        }catch(err){
          console.log(err)
        }
      }
    }catch(err){
      console.log(err)
    }
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const commonGet = async (req,res,whereInclude) => {
  let includearr = [ 
    {
      model:Model.GroupsParticipant,
      as:"Groups_Participant",
      attributes:["id","user_id"],
      where : (whereInclude)?whereInclude.ParticipantWhere:{},
      required:(whereInclude)?whereInclude.ParticipantReq:false
    }
  ]
  let titles_only = true
  if(req.query.is_screen_for){
    if(req.query.is_screen_for=='titles_only'){
      titles_only = false
    }
  }
  if(titles_only==true){
      includearr.push(
        {
          model:Model.GroupsParticipant,
          include:{
            model:Model.User,
            attributes:["id","user_id","first_name","phonenumber","photo_1"],
          },
          required:(whereInclude)?whereInclude.ParticipantReq:false
        },
        {
          model:Model.GroupChat,
          as:"Group_Chat",
          order: [ ['id', 'desc'] ],
          required:false
        }
      )
  }
  return includearr
}

const list = async (req, res) => {
  // #swagger.tags = ['Group']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['created_by_user_id'] = {in: 'query',type:'number','description':"Created By me"}
  //  #swagger.parameters['participant_user_id'] = {in: 'query',type:'number','description':"Invited For me"}
  //  #swagger.parameters['is_screen_for'] = {in: 'query',type:'string','enum':['titles_only']}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      query['where']['is_deleted'] = true
      query['attributes']= {}
      query['attributes']['include'] = [
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.group_chat_viewed WHERE is_viewed=false AND group_id="Group"."id" AND user_id=${req.user.id})`),'unOpened'
        ]
      ]
      let ParticipantReq = false
      let ParticipantWhere = {}
      if(req.query.participant_user_id){
        ParticipantReq = true
        ParticipantWhere = {user_id:req.query.participant_user_id}
      }
      if(req.query.keyword){
        var quote_str =  await Helper.StringToSingleCOde(req.query.keyword);
        query['where'][Op.or] =[
          {title:{[Op.substring]:req.query.keyword} },
          Sequelize.literal('"Group_Chat"."message" LIKE '+quote_str)
        ]
      } 
      if(req.query.is_screen_for){
        if(req.query.is_screen_for=='titles_only'){
          query['attributes'] = ['id','title']
        }
      }
      query['include'] = await commonGet(req, res,{ParticipantWhere:ParticipantWhere,ParticipantReq:ParticipantReq})
      if(req.query.created_by_user_id){
        query['where']['user_id'] = req.query.created_by_user_id
      }
      if(req.query.page && req.query.page_size){
        if (req.query.page >= 0 && req.query.page_size > 0) {
          pageSize = req.query.page_size;
          skip = req.query.page * req.query.page_size;
        }
        query['offset'] = skip
        query['limit'] = pageSize
      }
      // query['distinct'] = true
      query['order'] =[ ['id', 'DESC']]
      // console.log(query)
      const noOfRecord = await ThisModel.findAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const medialinks = async (req, res) => {
  // #swagger.tags = ['Group']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
 
  let GroupChatModel         =      Model.GroupChat
  try{
    let pageSize = 0;
    let skip = 0;
    let query={}
    query['where'] = {}
    if(req.params.medialinksid){
      query['where']['group_id'] = req.params.medialinksid
    }
    query['where']['is_image'] = true
    aquery['attributes'] = ['id', 'user_id','message','send_type']
    if(req.query.page && req.query.page_size){
    if (req.query.page >= 0 && req.query.page_size > 0) {
    pageSize = req.query.page_size;
    skip = req.query.page * req.query.page_size;
    }
    query['offset'] = skip
    query['limit'] = pageSize
    }
    query['include']= [
      {
        model:Model.User,
        attributes:["id","user_id","first_name","phonenumber","photo_1"],
        required:true
      }
    ]
    // query['distinct'] = true
    query['order'] =[ ['id', 'ASC']]
    const noOfRecord = await GroupChatModel.findAndCountAll(query)
    return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['Group']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Group']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "participants": { 
            "type": "array",
            "description":"Multiple users like [1,2,3]"
          },
          "title": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "description": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  let participants = null
  if(req.body.participants){
    participants = req.body['participants']
    delete req.body['participants']
  }
  if(participants){
    for (const part of participants) {  
      try{
        await Model.GroupsParticipant.create({group_id:req.params.id,user_id:part})
      }catch(err){
        console.log(err)
      }
    }
  }
  return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
    records = await ThisModel.findByPk(req.params.id);
    await Helper.SuccessValidation(req,res,records,'Updated successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const remove = async (req, res) => {
  // #swagger.tags = ['Group']
  try{
    // Model.GroupsParticipant.destroy({group_id:req.params.id})
    // Model.GroupChat.destroy({group_id:req.params.id})
    // Model.GroupChatViewed.destroy({group_id:req.params.id})
    // Model.GroupChatInvited.destroy({group_id:req.params.id})
    // Model.GroupChatRoomReport.destroy({group_id:req.params.id})
    // let record = await ThisModel.destroy({where:{id:req.params.id}})
    try{
      let AllUsers = await Model.GroupsParticipant.findAll({where:{group_id:req.params.id},attributes:["user_id"],raw:true}).then(accounts => accounts.map(account => account.user_id));
      for(let i = 0; i < AllUsers.length; i++){
        //Ger All the fututre activities of particular user and delete it
        let query = {}
        query['where'] = {}
        query['where']['user_id'] = await AllUsers[i]
        let SubWh = {}
        let current_date    = await Helper.CurrentDate()
        let today           = await Helper.DT_Y_M_D(current_date)
        SubWh['start_date'] = {[Op.gte]: Sequelize.literal(`'${today}'`)}
        // SubWh['start_time'] = {[Op.gte]: Sequelize.literal(`'${current_date.toTimeString()}'`)} 
        let start_time = await current_date.toTimeString()
        query['include'] = {
          model:Model.Activity,
          where:SubWh,
          required:true
        }
        query['raw'] = true
        let ActVts = await Model.ActivityUser.findAll(query)
        if(ActVts){
          for (let act_key = 0; act_key < ActVts.length; act_key++){
            let ActivityDetails = await ActVts[act_key].Activity
            let timeCondition = true
            if(today == ActivityDetails.start_date){
              if(start_time > ActivityDetails.start_time){
                timeCondition = false
              }
            }
            if(timeCondition==true){
              await Model.ActivityUser.destroy({where:{id:ActVts[act_key].id}})
            }
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
    await ThisModel.update({is_deleted:false},{where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Group']
  // #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
    let theArray = req.params.ids 
    if(!Array.isArray(theArray)){theArray = theArray.split(",");}
    for (let index = 0; index < theArray.length; ++index) {
      const rowid = theArray[index];
      // await ThisModel.destroy({where:{id:rowid}}).then((response) => {}).catch((err) => {});
      await ThisModel.update({is_deleted:false},{where:{id:rowid}})
    }
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
}


module.exports = {create,list, view, update, remove, bulkremove, medialinks};
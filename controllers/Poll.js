const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const PollUser = require("../models/PollUser");
const ThisModel         =      Model.Poll

const create = async (req, res) => {
  // #swagger.tags = ['Poll']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["question","group_id","start_date","start_time","expairy_date","expairy_time","questionoptions"], 
        "properties": { 
          "question": { 
            "type": "string",
          },
          "start_date": { 
            "type": "string",
            "description": "Accepts YY-DD-MM formats only",
          },
          "start_time": { 
            "type": "string",
            "description": "Accepts HH:II:SS formats only",
          },
          "expairy_date": { 
            "type": "string",
            "description": "Accepts YY-DD-MM formats only",
          },
          "expairy_time": { 
            "type": "string",
            "description": "Accepts HH:II:SS formats only",
          },
          "group_id": { 
            "type": "number",
            "description": "Take from Group",
          },
          "questionoptions": { 
            "type": "array",
            "description": "Ex:[option1,option2,option3,option4]",
          },
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['start_date']    = await Helper.DT_Y_M_D(req.body.start_date)
  req.body['expairy_date']  = await Helper.DT_Y_M_D(req.body.expairy_date)
  let questionoptions = null
  if(req.body.questionoptions){
      questionoptions = req.body.questionoptions
      delete req.body['questionoptions']
  }
  return await ThisModel.create(req.body).then(async(doc) => {
    if(questionoptions){
      for (const opt of questionoptions) {
        try{
          await Model.PollOptions.create({poll_id:doc.id,title:opt})
        }catch(err){
          console.log(err)
        }
      }
    }
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const commonGet = async (req,res,whereInclude) => {
  let poll_created_for_me = null
  if(req.query.poll_created_for_me){
    poll_created_for_me = req.query.poll_created_for_me
  }
  return [
    {
      model:Model.Group,
      where:(poll_created_for_me)?{user_id:poll_created_for_me}:{},
      required:true
    },
    {
      model:Model.PollOption,
      required:true
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['Poll']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['keyword'] = {in: 'query',type:'string'}
  //  #swagger.parameters['poll_created_by_me'] = {in: 'query',type:'number',"description":"Take id from User"}
  //  #swagger.parameters['poll_created_for_me'] = {in: 'query',type:'number',"description":"Take id from User"}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['attributes']= {}
      query['attributes']['include'] = [
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.poll_users WHERE poll_id="Poll"."id" AND user_id=${req.user.id})`),'isVoted'
        ]
      ]
      query['where'] = {}
      if(req.query.poll_created_by_me){
        query['where']['user_id'] = req.query.poll_created_by_me 
      }
      if(req.query.keyword){
        var quote_str =  await Helper.StringToSingleCOde(req.query.keyword);
        query['where'][Op.or] =[
          {question:{[Op.substring]:req.query.keyword} },
          Sequelize.literal('"Group"."title" LIKE '+quote_str)
        ]
      } 
      query['include'] = await commonGet(req, res,{query:query})
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
  // #swagger.tags = ['Poll']
  let query={}
  query['include'] = await commonGet(req, res)
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  records = JSON.parse(JSON.stringify(records))
  records['total'] = await Model.Group.findByPk(records.group_id,{model:Model.User,attributes:["id","first_name","user_id"],required:true})
  records['voted'] = await Model.PollUser.findAll({where:{poll_id:req.params.id},model:Model.User,attributes:["id","first_name","user_id"],required:true})
  let Uids = null
  for (const vot of records['voted']) {
    if(vot.User){
      Uids.push(vot.User[0].id)
    }
  }
  records['not_voted'] = await Model.Group.findByPk(records.group_id,{model:Model.User,attributes:["id","first_name","user_id"],where:{user_id:{[Op.notIn]:[Uids]}},required:true})
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Poll']
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
  // #swagger.tags = ['Poll']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Poll']
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
const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.UserInterest

const create = async (req, res) => {
  // #swagger.tags = ['UserInterest']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["interest_ids"], 
        "properties": { 
          "interest_ids": { 
            "type": "array",
            "description":"Take ids from MasterInterests ex:[1,2,3]"
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  let InterestCnt = 0
  let interest_ids = req.body.interest_ids
  if(req.body.interest_ids){
    InterestCnt = interest_ids.length
  }
  if(InterestCnt<=9){
    if(InterestCnt>2){
      await ThisModel.destroy({where:{user_id:req.user.id}})
      let ModelObjData = []
      for (let i = 0; i < interest_ids.length; i++) {
        let IntrData= {interest_id:interest_ids[i],user_id:req.user.id}
        let alreadyExusts = await ThisModel.count({where:IntrData})
        if(alreadyExusts==0){
          ModelObjData.push(IntrData)
        }
      }
      if(ModelObjData.length>0){
        return await ThisModel.bulkCreate(ModelObjData).then(async(doc) => {
          await Helper.SuccessValidation(req,res,doc,'Added successfully')
        }).catch( async (err) => {
          return await Helper.ErrorValidation(req,res,err,'cache')
        })
      }else{
        return await Helper.ErrorValidation(req,res,{message:'Interests already added'},'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:'Interests allowed minimum 3'},'cache')
    } 
  }else{
    return await Helper.ErrorValidation(req,res,{message:'Interests allowed max 8 only'},'cache')
  }
}

const commonGet = async (req,res,whereInclude) => {
  return [
    {
      model:Model.MasterInterest,
      required:false
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['UserInterest']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['user_id'] = {in: 'query',type:'number'}
  

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.user_id){
        query['where']['user_id'] = req.query.user_id
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
      query['order'] =[ ['id', 'DESC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['UserInterest']
  let query = {}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['UserInterest']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "interest_id": { 
            "type": "number",
            "description":"Take id off MasterInterests"
          },
           "user_id": { 
            "type": "number",
            "description":"Take id off User"
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
  // #swagger.tags = ['UserInterest']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['UserInterest']
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
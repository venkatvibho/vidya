const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.MasterActivity

const create = async (req, res) => {
  // #swagger.tags = ['MasterActivity']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["title","type_of_badge","f2_points","general_points","honor_points","max_participants","min_participants","description"], 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "type_of_badge": { 
            "type": "string",
            "enum":['General','Honour']
          },
          "f2_points": { 
            "type": "number",
          },
          "general_points": { 
            "type": "number",
          },
          "honor_points": { 
            "type": "number",
          },
          "max_participants": { 
            "type": "number",
          },
          "min_participants": { 
            "type": "number",
          },
          "description": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  if(req.body.type_of_badges){
    await body('type_of_badges').isIn(["General","Honour"]).withMessage('Badges must be General | Honour').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    return await ThisModel.create(req.body).then(async(doc) => {
      await Helper.SuccessValidation(req,res,doc,'Added successfully')
    }).catch( async (err) => {
      return await Helper.ErrorValidation(req,res,err,'cache')
    })
  }
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
  // #swagger.tags = ['MasterActivity']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['type_of_badge'] = {in: 'query',type:'string',"enum":['General','Honour']}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
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
  // #swagger.tags = ['MasterActivity']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['MasterActivity']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "title": { 
            "type": "string",
          },
          "type_of_badge": { 
            "type": "string",
            "enum":['General','Honour']
          },
          "f2_points": { 
            "type": "number",
          },
          "general_points": { 
            "type": "number",
          },
          "honor_points": { 
            "type": "number",
          },
          "max_participants": { 
            "type": "number",
          },
          "min_participants": { 
            "type": "number",
          },
          "description": { 
            "type": "string",
          },
          "icon": { 
            "type": "object",
          }
        } 
      } 
    }
  */
  if(req.body.type_of_badges){
    await body('type_of_badges').isIn(["General","Honour"]).withMessage('Badges must be General | Honour').run(req)
  }
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
  // #swagger.tags = ['MasterActivity']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['MasterActivity']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
    let theArray = req.params.ids 
    if(!Array.isArray(theArray)){theArray = theArray.split(",");}
    for (let index = 0; index < theArray.length; ++index) {
      const rowid = theArray[index];
      await ThisModel.destroy({where:{id:rowid}}).then((response) => {}).catch((err) => {});
    }
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
}


module.exports = {create,list, view, update, remove, bulkremove};
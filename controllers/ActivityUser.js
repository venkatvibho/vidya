const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const Model             =      require("../models");
const ThisModel         =      Model.ActivityUser

const create = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["activity_id","status"], 
        "properties": { 
          "activity_id": { 
            "type": "number",
            "description":"Take id from Activitiy"
          },
          "status": { 
            "type": "status",
            "enum":["Sent","Accepted","Rejected"]
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['user_id'] = req.body.id
  if(req.body.status=="Accepted"){
    req.body["acceptedAt"] = await Helper.CurrentDate()
  }
  if(req.body.status=="Rejected"){
    req.body["rejectedAt"] = await Helper.CurrentDate()
  }
  return await ThisModel.create(req.body).then(async(doc) => {
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const list = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['is_notification_screen'] = {in: 'query',type:'boolean'}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.is_notification_screen){
        query['where']['status'] = {[Sequelize.Op.notIn]:['Rejected']}
      }
      query['include'] =[
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
  // #swagger.tags = ['ActivityUser']
  let query={}
  query['include'] =[
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
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "status": { 
            "type": "string",
            "enum":["Sent","Accepted","Rejected"],
            "default":"Sent"
          },
        }
      } 
    }
  */
  if(req.query.status=="Accepted"){
    req.body["acceptedAt"] = await Helper.CurrentDate()
  }
  if(req.query.status=="Rejected"){
    req.body["rejectedAt"] = await Helper.CurrentDate()
  }
  return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
    records = await ThisModel.findByPk(req.params.id);
    await Helper.SuccessValidation(req,res,records,'Updated successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const remove = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['ActivityUser']
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
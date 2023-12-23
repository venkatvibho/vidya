const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.Donation

const create = async (req, res) => {
  // #swagger.tags = ['Donation']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["name","phonenumber","amount","amount_in_words"],
        "properties": { 
          "name": { 
            "type": "straing",
          },
          "surname": { 
            "type": "straing",
          },
          "phonenumber": { 
            "type": "number",
          },
          "whatsupnumber": { 
            "type": "straing",
          },
          "photo": { 
            "type": "straing",
          },
          "id_proof_photo": { 
            "type": "straing",
          },
          "donation_date": { 
            "type": "straing",
            "description":"YY-MM-DD Format Accepts only"
          },
          "adhar": { 
            "type": "straing",
          },
          "email": { 
            "type": "straing",
          },
          "address": { 
            "type": "straing",
          },
          "reffered_by": { 
            "type": "straing",
          },
          "reffered_person_number": { 
            "type": "straing",
          },
          "gothram": { 
            "type": "straing",
          },
          "donation_type": { 
            "type": "straing",
            "enum":['UPI','DD','CASH','CHEQUE','ONLINE'],
            "default":"UPI"
          },
          "amount": { 
            "type": "number",
          },
          "amount_in_words": { 
            "type": "straing",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['is_active'] = 1
  req.body['created_at']= await new Date()
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
      as:"CallFrom",
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },
    {
      model:Model.User,
      as:"CallTo",
      attributes:["id","first_name","user_id","photo_1"],
      required:true
    },
  ]
}

const list = async (req, res) => {
  //  #swagger.tags = ['Donation']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['donation_from_date'] = {in: 'query',type:'staing','description':'YY-MM-DD Format'}
  //  #swagger.parameters['donation_to_date']   = {in: 'query',type:'staing','description':'YY-MM-DD Format'}
  //  #swagger.parameters['created_from_date'] = {in: 'query',type:'staing','description':'YY-MM-DD Format'}
  //  #swagger.parameters['created_to_date']   = {in: 'query',type:'staing','description':'YY-MM-DD Format'}
  //  #swagger.parameters['name']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['surname']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['phonenumber']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['whatsupnumber']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['adhar']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['email']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['donation_type'] = {in: 'query',type:'string','enum':['UPI','DD','CASH','CHEQUE','ONLINE']}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.params.donation_from_date){
        query['where']['donation_date'] = {[Op.gte]:req.params.donation_from_date}
      }
      if(req.params.donation_to_date){
        query['where']['donation_date'] = {[Op.lte]:req.params.donation_to_date}
      }
      if(req.params.donation_type){
        query['where']['donation_type'] = req.params.donation_type
      }
      if(req.params.name){
        query['where']['name'] = {[Op.substring]:req.params.name}
      }
      if(req.params.surname){
        query['where']['surname'] = {[Op.substring]:req.params.surname}
      }
      if(req.params.phonenumber){
        query['where']['phonenumber'] = {[Op.substring]:req.params.phonenumber}
      }
      if(req.params.adhar){
        query['where']['adhar'] = {[Op.substring]:req.params.adhar}
      }
      if(req.params.email){
        query['where']['email'] = {[Op.substring]:req.params.email}
      }
      if(req.params.created_from_date){
        query['where'][$and] = {[Op.gte]:req.params.created_from_date}
      }
      if(req.params.created_to_date){
        query['where'][$and] = {[Op.lte]:req.params.created_to_date}
      }
      // query['where'] = {
      //   "is_active":1,
      //   "phone_no_code":req.params.phone_code,
      //   $and: Sequelize.where(Sequelize.fn('AES_DECRYPT',Sequelize.col('phone_no'),'63a9f0ea7bb98050796b649e85481845'),req.params.phone_number)
      // }
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
  // #swagger.tags = ['Donation']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Donation']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "name": { 
            "type": "straing",
          },
          "surname": { 
            "type": "straing",
          },
          "phonenumber": { 
            "type": "number",
          },
          "whatsupnumber": { 
            "type": "straing",
          },
          "photo": { 
            "type": "straing",
          },
          "id_proof_photo": { 
            "type": "straing",
          },
          "donation_date": { 
            "type": "straing",
            "description":"YY-MM-DD Format Accepts only"
          },
          "adhar": { 
            "type": "straing",
          },
          "email": { 
            "type": "straing",
          },
          "address": { 
            "type": "straing",
          },
          "reffered_by": { 
            "type": "straing",
          },
          "reffered_person_number": { 
            "type": "straing",
          },
          "gothram": { 
            "type": "straing",
          },
          "donation_type": { 
            "type": "straing",
            "enum":['UPI','DD','CASH','CHEQUE','ONLINE'],
            "default":"UPI"
          },
          "amount": { 
            "type": "number",
          },
          "amount_in_words": { 
            "type": "straing",
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
  // #swagger.tags = ['Donation']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Donation']
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
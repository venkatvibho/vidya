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
            "type": "string",
          },
          "surname": { 
            "type": "string",
          },
          "phonenumber": { 
            "type": "number",
          },
          "whatsupnumber": { 
            "type": "string",
          },
          "photo": { 
            "type": "string",
          },
          "id_proof_photo": { 
            "type": "string",
          },
          "donation_date": { 
            "type": "string",
            "description":"YY-MM-DD Format Accepts only"
          },
          "adhar": { 
            "type": "string",
          },
          "email": { 
            "type": "string",
          },
          "address": { 
            "type": "string",
          },
          "reffered_by": { 
            "type": "string",
          },
          "reffered_person_number": { 
            "type": "string",
          },
          "gothram": { 
            "type": "string",
          },
          "donation_type": { 
            "type": "string",
            "enum":['UPI','DD','CASH','CHEQUE','ONLINE'],
            "default":"UPI"
          },
          "amount": { 
            "type": "number",
          },
          "amount_in_words": { 
            "type": "string",
          },
          "ReferenceNo": { 
            "type": "string",
          },
          "PurposeofDonation": { 
            "type": "string",
          },
          "pan": { 
            "type": "string",
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
  //  #swagger.parameters['ReferenceNo']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['PurposeofDonation']   = {in: 'query',type:'staing'}
  //  #swagger.parameters['pan']   = {in: 'query',type:'staing'}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['where'] = {}
      if(req.query.donation_from_date && req.query.donation_to_date){
        query['where']['donation_date'] = {[Op.gte]:req.query.donation_from_date,[Op.lte]:req.query.donation_to_date}
      }else if(req.query.donation_to_date){
        query['where']['donation_date'] = {[Op.lte]:req.query.donation_to_date}
      }else{
        if(req.query.donation_from_date){
          query['where']['donation_date'] = {[Op.gte]:req.query.donation_to_date}
        }
      }
      if(req.query.donation_type){
        query['where']['donation_type'] = req.query.donation_type
      }
      if(req.query.name){
        query['where']['name'] = {[Op.substring]:req.query.name}
      }
      if(req.query.pan){
        query['where']['pan'] = {[Op.substring]:req.query.pan}
      }
      if(req.query.surname){
        query['where']['surname'] = {[Op.substring]:req.query.surname}
      }
      if(req.query.phonenumber){
        query['where']['phonenumber'] = {[Op.substring]:req.query.phonenumber}
      }
      if(req.query.adhar){
        query['where']['adhar'] = {[Op.substring]:req.query.adhar}
      }
      if(req.query.email){
        query['where']['email'] = {[Op.substring]:req.query.email}
      }
      if(req.query.created_from_date && req.query.created_to_date){
        query['where'][Op.and] = [
          Sequelize.where(Sequelize.fn('DATE', Sequelize.col('created_at')), '>=', req.query.created_from_date),
          Sequelize.where(Sequelize.fn('DATE', Sequelize.col('created_at')), '<=', req.query.created_to_date)
        ]
      }else if(req.query.created_from_date){
        query['where'][Op.and] = [
          Sequelize.where(Sequelize.fn('DATE', Sequelize.col('created_at')), '>=', req.query.created_from_date)
        ]
      }else{
        if(req.query.created_to_date){
          query['where'][Op.and] = [
            Sequelize.where(Sequelize.fn('DATE', Sequelize.col('created_at')), '<=', req.query.created_to_date)
          ]
        }
      }
      if(req.query.ReferenceNo){
        query['where']['ReferenceNo'] = {[Op.substring]:req.query.ReferenceNo}
      }
      if(req.query.PurposeofDonation){
        query['where']['PurposeofDonation'] = {[Op.substring]:req.query.PurposeofDonation}
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
      // query['distinct'] = true
      query['order'] =[ ['id', 'DESC']]
      console.log(query)
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
            "type": "string",
          },
          "surname": { 
            "type": "string",
          },
          "phonenumber": { 
            "type": "number",
          },
          "whatsupnumber": { 
            "type": "string",
          },
          "photo": { 
            "type": "string",
          },
          "id_proof_photo": { 
            "type": "string",
          },
          "donation_date": { 
            "type": "string",
            "description":"YY-MM-DD Format Accepts only"
          },
          "adhar": { 
            "type": "string",
          },
          "email": { 
            "type": "string",
          },
          "address": { 
            "type": "string",
          },
          "reffered_by": { 
            "type": "string",
          },
          "reffered_person_number": { 
            "type": "string",
          },
          "gothram": { 
            "type": "string",
          },
          "donation_type": { 
            "type": "string",
            "enum":['UPI','DD','CASH','CHEQUE','ONLINE'],
            "default":"UPI"
          },
          "amount": { 
            "type": "number",
          },
          "amount_in_words": { 
            "type": "string",
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
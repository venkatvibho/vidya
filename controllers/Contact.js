const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.UserContact

const create = async (req, res) => {
  // #swagger.tags = ['Contactsync']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumbers"], 
        "properties": { 
          "phonenumbers": { 
            "type": "array",
            "description":"Multiple users like [1,2,3]"
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  let participants = req.body['phonenumbers']
  delete req.body['phonenumbers']
  doc = []
  try{
    for (const part of participants){  
      try{
        let respresult = await ThisModel.create({user_id:req.user.id,phonenumber:part})
        doc.push(respresult)
      }catch(err){
        console.log(err)
      }
    }
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }catch(err){
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const checkPhoneNumberExistedORnot = async (req, res) => {
   // #swagger.tags = ['Contactsync']
   try{
      let countCheck = await ThisModel.count({where:{user_id:req.user.id,phonenumber:req.params.phonenumber}})
      if(countCheck>0){
        countCheck = true
      }else{
        countCheck = false
      }
      await Helper.SuccessValidation(req,res,{existedOrNot:countCheck})
    }catch(err){
      return await Helper.ErrorValidation(req,res,err,'cache')
    }
}

const list = async (req, res) => {
  // #swagger.tags = ['Contactsync']
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
          Sequelize.literal(`(SELECT COUNT(id) FROM public.users WHERE phonenumber="UserContact"."phonenumber" )`),'isRegistered'
        ]
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
      const noOfRecord = await ThisModel.findAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}
const view = async (req, res) => {
  // #swagger.tags = ['Contactsync']
  let query={}
  query['include'] = await commonGet(req, res,{})
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Contactsync']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumber"], 
        "properties": { 
          "phonenumber": { 
            "type": "number",
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
  // #swagger.tags = ['Contactsync']
  try{
    // Model.GroupsParticipant.destroy({group_id:req.params.id})
    // Model.GroupChat.destroy({group_id:req.params.id})
    // Model.GroupChatViewed.destroy({group_id:req.params.id})
    // Model.GroupChatInvited.destroy({group_id:req.params.id})
    // Model.GroupChatRoomReport.destroy({group_id:req.params.id})

    // let record = await ThisModel.destroy({where:{id:req.params.id}})
    await ThisModel.update({is_deleted:false},{where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Contactsync']
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


module.exports = {create,list, view, update, remove, bulkremove,checkPhoneNumberExistedORnot};
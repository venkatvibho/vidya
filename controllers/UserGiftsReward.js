const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const Model             =      require("../models");
const MasterGiftsReward = require("../models/MasterGiftsReward");
const ActivityUser = require("../models/ActivityUser");
const ThisModel         =      Model.UserGiftsReward

const create = async (req, res) => {
  // #swagger.tags = ['UserGiftsReward']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["totalpoints"], 
        "properties": { 
          "totalpoints": { 
            "type": "number",
          },
          "coupon_type": { 
            "type": "string",
            "enum":["Flipcart","Myntra"]
          },
          "coupon_code": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  let query={}
  query['user_id'] = req.user.id
  let CurrentDate = await Helper.CurrentDate()
  CurrentDate     = await Helper.DT_Y_M_D(CurrentDate)
  CurrentDate     = await new Date(CurrentDate)
  toDate          = await moment(CurrentDate).add(1, 'days');
  toDate          = await new Date(toDate)
  query['createdAt']  = {$gte:CurrentDate,$lt:toDate}
  let checkThisMonthStatus = await ThisModel.count(query)
  if(checkThisMonthStatus == 0){
    let Is_Eligible = []
    let totalIUsers = await Model.User.count()
    let giftCode  = 0
    let giftVlaue = 0
    GiftQuery = {}
    GiftQuery['users_count_from'] = {$gte:totalIUsers}
    GiftQuery['users_count_to']   = {$lte:totalIUsers}
    let GiftAlogrytm = await MasterGiftsReward.findOne(GiftQuery)
    if(GiftAlogrytm){
      let All_Usr_List =  await ActivityUser.findAll({
        attributes: [
          'user_id',
          [sequelize.fn('sum', sequelize.col('honor')), 'total'],
        ],
        group: ['user_id'],
        order:["total","DESC"]
      });
      if(All_Usr_List){
        let J = 0;
        if(J<All_Usr_List.lengh){
          for (let i=1; i <= 5; i++) {
            gift_value = GiftAlogrytm['r'+i+'_gift_value']
            users_count = GiftAlogrytm['r'+i+'_users_count']
            query['user_id'] = {$gt:0}
            query['category'] = 'R'+i
            let usedcnt =  await ThisModel.count(query)
            if(users_count>usedcnt){
              let available = parseInt(users_count)-parseInt(usedcnt)
              if(available>0){
                for (let i = 0; i < users_count; i++) {
                  if(All_Usr_List[J]){
                    if(All_Usr_List[J]['user_id'] = req.user.id){
                      req.body['isRedeemed'] = false
                      req.body['user_id'] = req.user.id
                      req.body['category'] = query['category']
                      req.body['coupon_type'] = 'Flipkart'
                      req.body['coupon_code'] = '1234'
                      await ThisModel.create(req.body)
                      Is_Eligible.push({category:req.body['category'],coupon_type:req.body['coupon_type'],coupon_code:req.body['coupon_code']})
                      break;
                    }
                  }
                  J += 1
                }
              }
            }
          }
        }
      }

      // r1_gift_value = GiftAlogrytm.r1_gift_value
      // r1_users_count = GiftAlogrytm.r1_users_count
      // if(r1_users_count>0){
      //   for (let i = 0; i < r1_users_count; i++) {

      //   }
      // } 

      // r2_gift_value = GiftAlogrytm.r2_gift_value
      // r2_users_count = GiftAlogrytm.r2_users_count
      // if(r2_users_count>0){

      // }

      // r3_gift_value = GiftAlogrytm.r3_gift_value
      // r3_users_count = GiftAlogrytm.r3_users_count
      // if(r3_users_count>0){

      // }

      // r4_gift_value = GiftAlogrytm.r4_gift_value
      // r4_users_count = GiftAlogrytm.r4_users_count
      // if(r4_users_count>0){

      // }

      // r5_gift_value = GiftAlogrytm.r5_gift_value
      // r5_users_count = GiftAlogrytm.r5_users_count
      // if(r5_users_count>0){

      // }
    }
    // req.body['isRedeemed'] = false
    // req.body['user_id'] = req.user.id
    // return await ThisModel.create(req.body).then(async(doc) => {
    //   await Helper.SuccessValidation(req,res,doc,'Added successfully')
    // }).catch( async (err) => {
    //   return await Helper.ErrorValidation(req,res,err,'cache')
    // })
    if(Is_Eligible.lengh>0){
      await Helper.SuccessValidation(req,res,doc,'Scrach card generated successfully')
    }else{
      return await Helper.ErrorValidation(req,res,{message:"You have not eligible"},'cache')
    }
  }else{
    return await Helper.ErrorValidation(req,res,{message:"Alreadrd scrached"},'cache')
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
  // #swagger.tags = ['UserGiftsReward']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  

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
  // #swagger.tags = ['UserGiftsReward']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['UserGiftsReward']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "totalpoints": { 
            "type": "number",
          },
          "coupon_type": { 
            "type": "string",
            "enum":["Flipcart","Myntra"]
          },
          "coupon_code": { 
            "type": "string",
          },
          "isRedeemed": { 
            "type": "boolean",
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

const home = async (req, res) => {
  // #swagger.tags = ['UserGiftsReward']
  let honour = 0
  let query={}
  query['user_id'] = req.user.id
  let CurrentDate = await Helper.CurrentDate()
  CurrentDate     = await Helper.DT_Y_M_D(CurrentDate)
  CurrentDate     = await new Date(CurrentDate)
  toDate          = await moment(CurrentDate).add(1, 'days');
  toDate          = await new Date(toDate)
  query['createdAt']  = {$gte:CurrentDate,$lt:toDate}
  let checkThisMonthStatus = await ThisModel.count(query)
  console.log("111111",query)
  query['status'] = 'Joined'
  query['include'] ={
    model:Model.Activity,
    where : {type_of_badge:'Honour'},
    required:true
  }
  console.log("2222222",query)
  let checkHonorStatus = await Model.ActivityUser.count(query)
  query['include'] = {
    model:Model.Activity,
    where : {type_of_badge:'General'},
    required:true
  }
  let checkGenerralStatus = await Model.ActivityUser.count(query)
  console.log("3333333",query)
  if(checkThisMonthStatus==0 && checkHonorStatus>0 && checkGenerralStatus>0){
    let where_total_revenue = {}
    where_total_revenue['user_id'] = req.user.id
    let total_revenue = await ActivityUser.aggregate(
      [
        { "$match": where_total_revenue },
        {
          $group:
            {
              _id: {},
              totalAmount: { $sum:"$honor"}
            }
        }
      ]
    )
    try{
      honour = total_revenue[0].totalAmount
    }catch(err){
      honour = 0
    }
  }
  records = {
    honour:{
      is_scratched:await (checkThisMonthStatus==1)?true:false,
      points:honour
    }
  }
  return await Helper.SuccessValidation(req,res,records)
}

const remove = async (req, res) => {
  // #swagger.tags = ['UserGiftsReward']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['UserGiftsReward']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
    let theArray = req.params.ids 
    if(!Array.isArray(theArray)){theArray = theArray.split(",");}
    for (let index = 0; index < theArray.length; ++index) {
      const rowid = theArray[index];
      await ThisModel.destroy({where:{id:rowid}}).then((response) => {}).catch((err) => {});
    }
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
}


module.exports = {create,list, view, update, remove, bulkremove, home};
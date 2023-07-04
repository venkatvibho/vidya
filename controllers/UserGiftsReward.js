const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const Model             =      require("../models");
const MasterGiftsReward = require("../models/MasterGiftsReward");
const ActivityUser = require("../models/ActivityUser");
const ThisModel         =      Model.UserGiftsReward
const { uuid }  = require('uuidv4');

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
  query['createdAt']  = {[Op.gte]:CurrentDate,$lt:toDate}
  let checkThisMonthStatus = await ThisModel.count(query)
  let curCheck = {}
  curCheck['where'] = {}
  curCheck['where']['user_id'] = req.user.id
  let IslastDayOfMonth = await Helper.IslastAndFirstDayOfMonth()
  curCheck['where']['createdAt']  = {
    [Op.gte]:IslastDayOfMonth.first,
    [Op.lt]:IslastDayOfMonth.last
  }
  if(checkThisMonthStatus == 0){
    let Is_Eligible = []
    let totalIUsers = await Model.User.count()
    let giftCode  = 0
    let giftVlaue = 0
    GiftQuery = {}
    GiftQuery['where'] = {}
    GiftQuery['where']['users_count_from'] = {[Op.lte]:totalIUsers}
    GiftQuery['where']['users_count_to']   = {[Op.gte]:totalIUsers}
    GiftQuery['order'] =[ ['id','ASC']]
    let GiftAlogrytm = await Model.MasterGiftsReward.findOne(GiftQuery)
    if(GiftAlogrytm){
      let All_Usr_List =  await Model.ActivityUser.findAll({
        attributes: [
          'user_id',
          [Sequelize.fn('sum', Sequelize.col('honour')), 'total'],
        ],
        group:['user_id'],
        order:["total"]
      });
      if(All_Usr_List){
        let J = 0;
        if(J<All_Usr_List.length){
          for (let i=1; i <= 1; i++) {
            gift_value = GiftAlogrytm['r'+i+'_gift_value']
            users_count = GiftAlogrytm['r'+i+'_users_count']
            query['user_id'] = {[Op.gt]:0}
            query['category'] = 'R'+i
            let usedcnt =  await ThisModel.count(query)
            // console.log("$$$$$$$","usedcnt",usedcnt,"users_count",users_count)
            if(users_count>usedcnt){
              let available = parseInt(users_count)-parseInt(usedcnt)
              // console.log("$$$$$$$","available",available)
              if(available>0){
                for (let i = 0; i < users_count; i++) {
                  // console.log("$$$$$$$","available",All_Usr_List[J])
                  if(All_Usr_List[J]){
                    if(All_Usr_List[J]['user_id'] = req.user.id){
                      let checkAdded =  await ThisModel.count(curCheck)
                      if(checkAdded==0){
                        req.body['isRedeemed'] = false
                        req.body['user_id'] = req.user.id
                        req.body['category'] = query['category']
                        req.body['coupon_type'] = 'Flipkart'
                        req.body['coupon_code'] =  await uuid()
                        await ThisModel.create(req.body)
                        Is_Eligible.push({category:req.body['category'],coupon_type:req.body['coupon_type'],coupon_code:req.body['coupon_code']})
                       }
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
    }
    if(Is_Eligible.length>0){
      await Helper.SuccessValidation(req,res,Is_Eligible,'Scrach card generated successfully')
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
  query['where'] = {}
  query['where']['user_id'] = req.user.id
  let IslastDayOfMonth = await Helper.IslastAndFirstDayOfMonth()
  console.log(IslastDayOfMonth)
  // let CurrentDate = await Helper.CurrentDate()
  // CurrentDate     = await Helper.DT_Y_M_D(CurrentDate)
  // CurrentDate     = await new Date(CurrentDate)
  // let CalcDate     = await Helper.DT_Y_M_D(IslastDayOfMonth.last)
  // CalcDate     = await new Date(CalcDate)
  query['where']['createdAt']  = {
    [Op.gte]:IslastDayOfMonth.first,
    [Op.lt]:IslastDayOfMonth.last
  }
  let checkThisMonthStatus = await ThisModel.count(query)
  console.log("111111",query,checkThisMonthStatus)
  query['where']['status'] = 'Joined'
  query['include'] = {
    model:Model.Activity,
    attributes:['id','type_of_badge'],
    where : {type_of_badge:'General'},
    required:true
  }
  let checkGenerralStatus = await Model.ActivityUser.count(query)
  console.log("2222222",query,checkGenerralStatus)
  query['include'] ={
    model:Model.Activity,
    attributes:['id','type_of_badge'],
    where : {type_of_badge:'Honour'},
    required:true
  }
  let checkHonorStatus = await Model.ActivityUser.count(query)
  console.log("3333333",query,checkHonorStatus)
  query['attributes'] = ["id","honour"]
  honourData = await Model.ActivityUser.findAll(query)
  if(honourData){
    for (let i = 0; i < honourData.length; i++) {
      if(honourData[i]['honour']){
        honour += parseInt(honourData[i]['honour'])
      }
    }
  }
  if(req.user.id==101){
    try{
      checkThisMonthStatus = 0
      IslastDayOfMonth['islastDay']=1
    }catch(err){
      console.log(err)
    }
  }
  records = {
    honour_poins : await Model.ActivityUser.sum("honour", {
      where: {
        user_id: req.user.id,
        status:'Joined',
      },
    }),
    fe_poins : await Model.ActivityUser.sum("f2", {
      where: {
        user_id: req.user.id,
        status:'Joined',
      },
    }),
    general_poins : await Model.ActivityUser.sum("general", {
      where: {
        user_id: req.user.id,
        status:'Joined',
      },
    }),
    honour:{
      is_scratched_available:await (checkThisMonthStatus==0 && IslastDayOfMonth.islastDay==1)?true:false,
      points:honour
    },
    general:{
      is_scratched_available:await (checkThisMonthStatus==0 && IslastDayOfMonth.islastDay==1)?true:false,
      points:honour
    },
    f2:{
      is_scratched_available:await (checkThisMonthStatus==0 && IslastDayOfMonth.islastDay==1)?true:false,
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
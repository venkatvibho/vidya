const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const Model             =      require("../models");
const ThisModel         =      Model.Activity

const create = async (req, res) => {
  // #swagger.tags = ['Activity']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["type_of_badges","type_of_activity","location","latitude","longitude","start_date","start_time","end_date","end_time","description","activity_id","group_id"], 
        "properties": { 
          "type_of_badges": { 
            "type": "string",
            "enum":["General","Honour"],
            "default":"General"
          },
          "type_of_activity": { 
            "type": "string",
            "enum":["Private","Public","Self"],
            "default":"Private"
          },
          "location": { 
            "type": "string",
          },
          "latitude": { 
            "type": "string",
          },
          "longitude": { 
            "type": "string",
          },
          "start_date": { 
            "type": "string",
            "description":"Accepts YY-MM-DD Only"
          },
          "start_time": { 
            "type": "string",
            "description":"Accepts HH:MM:SS Only"
          },
          "end_date": { 
            "type": "string",
            "description":"Accepts YY-MM-DD Only"
          },
          "end_time": { 
            "type": "string",
            "description":"Accepts HH:MM:SS Only"
          },
          "description": { 
            "type": "string",
          },
          "activity_id": { 
            "type": "number",
            "description":"Take id from MasterActivity"
          },
          "group_id": { 
            "type": "number",
            "description":"Take id from Group"
          },
          "user_ids": { 
            "type": "array",
            "description":"Take id from User"
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  return await ThisModel.create(req.body).then(async(doc) => {
    if(req.body.type_of_activity == "Private"){
      if(req.body.group_id){
        let GroupUsers = await Model.Group.findByPk(req.body['group_id'])
        if(GroupUsers.participants){
          let participants = GroupUsers.participants
          participants.splice(participants.indexOf(req.user.id),1);
          let ActivityUser = []
          for (let i = 0; i < participants.length; i++) {
            // ActivityUser.push(GroupUserData)
            try{
              let cntGroupCheck = await Model.ActivityUser.count({activity_id : doc.id,user_id:participants[i]})
              if(cntGroupCheck == 0){ 
                let GroupUserData = {activity_id : doc.id,user_id:participants[i],status:'Sent'}
                await Model.ActivityUser.create(GroupUserData)
              }
            } catch (err){
              console.log(err);
            }
          }
        }
      }
      if(req.body.user_ids){
        let SelectedUsers = req.body.user_ids
        if(SelectedUsers){
          SelectedUsers.splice(SelectedUsers.indexOf(req.user.id),1);
          let ActivityUser = []
          for (let i = 0; i < SelectedUsers.length; i++) {
            // ActivityUser.push(SingUsersData)
            try{
              let cntSingUserCheck = await Model.ActivityUser.count({activity_id : doc.id,user_id:SelectedUsers[i]})
              if(cntSingUserCheck == 0){ 
                let SingUsersData = {activity_id : doc.id,user_id:SelectedUsers[i],status:'Sent'}
                await Model.ActivityUser.create(SingUsersData)
              }
            } catch (err){
              console.log(err);
            }
          }
        }
      }
    }
    await Helper.SuccessValidation(req,res,doc,'Added successfully')
  }).catch( async (err) => {
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const list = async (req, res) => {
  // #swagger.tags = ['Activity']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['date'] = {in: 'query',type:'string','description':"YY-MM-DD"}
  //  #swagger.parameters['type_of_badges'] = {in: 'query',type:'string','enum':['General','Honour']}
  //  #swagger.parameters['type_of_activity'] = {in: 'query',type:'string','enum':['Private','Public','Self']}
  //  #swagger.parameters['created_by_user_id'] = {in: 'query',type:'number','description':"Invited By me"}
  //  #swagger.parameters['participant_user_id'] = {in: 'query',type:'number','description':"Invited For me"}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['attributes']= {}
      query['attributes']['include'] = [
        [
            Sequelize.literal(`(SELECT COUNT(id) FROM public.activity_users WHERE status='Accepted' AND activity_id="Activity"."id")`),'acceptedCount'
        ],
        [
            Sequelize.literal(`(SELECT COUNT(id) FROM public.activity_users WHERE status='Rejetced' AND activity_id="Activity"."id")`),'rejectedCount'
        ],
        [
            Sequelize.literal(`(SELECT COUNT(id) FROM public.activity_users WHERE activity_id ="Activity"."id")`),'totalPrivateCount'
        ],
        [
            Sequelize.literal(`(SELECT COUNT(id) FROM public.users WHERE id!=${req.user.id})`),'totalPublicCount'
        ],
      ]
      query['where'] = {}
      let is_Required = false
      if(req.query.created_by_user_id){
        query['where']['user_id'] = req.query.created_by_user_id
      }
      if(req.query.type_of_badges){
        query['where']['type_of_badges'] = req.query.type_of_badges
      }
      if(req.query.type_of_activity){
        query['where']['type_of_activity'] = req.query.type_of_activity
      }
      if(req.query.date){
        let date  = require('date-and-time');
        let current_date = await Helper.CurrentDate()
        let today =  date.format(current_date, 'YYYY-MM-DD');
        query['where']['start_date'] = today
      }
      let ActivityUserWhere = {}
      let ActivityUserRequired = false
      if(req.query.participant_user_id){
        if(req.query.type_of_activity){
          if(req.query.type_of_activity=="Private"){
            ActivityUserRequired['user_id'] = req.query.participant_user_id
            ActivityUserRequired = true
          }
        }
      }
      query['include'] = [
        {
          model:Model.Group,
          required:false
        },
        {
          model:Model.MasterActivity,
          required:false
        },
        {
          model:Model.ActivityUser,
          as:"PrivateUser",
          where:ActivityUserWhere,
          required:ActivityUserRequired
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
  // #swagger.tags = ['Activity']
  let query={}
  query['include'] = [
    {
      model:Model.Group,
      required:false
    },
    {
      model:Model.MasterActivity,
      required:false
    }
  ]
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Activity']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "type_of_badges": { 
            "type": "string",
            "enum":["General","Honour"],
            "default":"General"
          },
          "type_of_activity": { 
            "type": "string",
            "enum":["Private","Public","Self"],
            "default":"Private"
          },
          "location": { 
            "type": "string",
          },
          "latitude": { 
            "type": "string",
          },
          "longitude": { 
            "type": "string",
          },
          "start_date": { 
            "type": "string",
            "description":"Accepts YY-MM-DD Only"
          },
          "start_time": { 
            "type": "string",
            "description":"Accepts HH:MM:SS Only"
          },
          "end_date": { 
            "type": "string",
            "description":"Accepts YY-MM-DD Only"
          },
          "end_time": { 
            "type": "string",
            "description":"Accepts HH:MM:SS Only"
          },
          "description": { 
            "type": "string",
          },
          "activity_id": { 
            "type": "number",
            "description":"Take id from MasterActivity"
          },
          "group_id": { 
            "type": "number",
            "description":"Take id from Group"
          },
          "user_ids": { 
            "type": "array",
            "description":"Take id from User And Send type_of_activity"
          }
        } 
      } 
    }
  */
  if(req.body.type_of_activity){
    if(req.body.type_of_activity == "Private"){
      await Model.ActivityUser.count({activity_id : doc.id})
      if(req.body.group_id){
        let GroupUsers = await Model.Group.findByPk(req.body['group_id'])
        if(GroupUsers.participants){
          let participants = GroupUsers.participants
          participants.splice(participants.indexOf(req.user.id),1);
          let ActivityUser = []
          for (let i = 0; i < participants.length; i++) {
            // ActivityUser.push(GroupUserData)
            try{
              let cntGroupCheck = await Model.ActivityUser.count({activity_id : doc.id,user_id:participants[i]})
              if(cntGroupCheck == 0){ 
                let GroupUserData = {activity_id : doc.id,user_id:participants[i],status:'Sent'}
                await Model.ActivityUser.create(GroupUserData)
              }
            } catch (err){
              console.log(err);
            }
          }
        }
      }
      if(req.body.user_ids){
        let SelectedUsers = req.body.user_ids
        if(SelectedUsers){
          SelectedUsers.splice(SelectedUsers.indexOf(req.user.id),1);
          let ActivityUser = []
          for (let i = 0; i < SelectedUsers.length; i++) {
            // ActivityUser.push(SingUsersData)
            try{
              let cntSingUserCheck = await Model.ActivityUser.count({activity_id : doc.id,user_id:SelectedUsers[i]})
              if(cntSingUserCheck == 0){ 
                let SingUsersData = {activity_id : doc.id,user_id:SelectedUsers[i],status:'Sent'}
                await Model.ActivityUser.create(SingUsersData)
              }
            } catch (err){
              console.log(err);
            }
          }
        }
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
  // #swagger.tags = ['Activity']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Activity']
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
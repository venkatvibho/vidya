const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const Model             =      require("../models");
const ThisModel         =      Model.Post

const create = async (req, res) => {
  // #swagger.tags = ['Post']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["type_of_activity","activity_id","images","description"], 
        "properties": { 
          "activity_id": { 
            "type": "number",
            "description":"Take id from Activity"
          },
          "type_of_activity": { 
            "type": "string",
            "enum":["Private","Public","Self"]
          },
          "type_of_activity": { 
            "type": "string",
            "enum":[]
          }
        } 
      } 
    }
  */
  // const opts = { runValidators: false , upsert: true };
  req.body['user_id'] = req.user.id
  return await ThisModel.create(req.body).then(async(doc) => {
    if(req.body.type_of_activity == "Private"){
      if(req.body.group_id){
        let GroupUsers = await Model.PostUser.findByPk(req.body['group_id'])
        if(GroupUsers.participants){
          let participants = GroupUsers.participants
          participants.splice(participants.indexOf(req.user.id),1);
          let ActivityUser = []
          for (let i = 0; i < participants.length; i++) {
            // ActivityUser.push(GroupUserData)
            try{
              let cntGroupCheck = await Model.PostUser.count({post_id : doc.id,user_id:participants[i]})
              if(cntGroupCheck == 0){ 
                let GroupUserData = {post_id : doc.id,user_id:participants[i],status:'Sent'}
                await Model.PostUser.create(GroupUserData)
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
              let cntSingUserCheck = await Model.PostUser.count({post_id : doc.id,user_id:SelectedUsers[i]})
              if(cntSingUserCheck == 0){ 
                let SingUsersData = {post_id : doc.id,user_id:SelectedUsers[i],status:'Sent'}
                await Model.PostUser.create(SingUsersData)
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
  // #swagger.tags = ['Post']
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
      query['order'] =[ ['id', 'DESC']]
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['Post']
  let query={}
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['Post']
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
  // #swagger.tags = ['Post']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['Post']
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
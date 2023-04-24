const jwt               =      require('jsonwebtoken');
const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Sequelize         =       require("sequelize");
const Op                =       Sequelize.Op;
const Helper            =      require("../middleware/helper");
const Model             =      require("../models");
const ThisModel         =      Model.User

const create = async (req, res) => {
  // #swagger.tags = ['User']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["first_name","phonenumber"], 
        "properties": { 
          "first_name": { 
            "type": "string",
          },
          "phonenumber": { 
            "type": "number",
          }
        } 
      } 
    }
  */
  req.body['user_id'] = await Helper.GenerateUid(req.body)
  req.body['password'] = 'test123'
  // const opts = { runValidators: false , upsert: true };
  return await ThisModel.create(req.body).then(async(doc) => {
    // let text = 'Email: '+CreateModel.email+' and password: '+CreateModel.password+' are your login credentials.'
    // let subject = "Account created successfully"
    // await Helper.SentMail(CreateModel.email,subject,text)
    let Is_Otp_Enabled = true
    if(Is_Otp_Enabled){
      let SmsDet = {}
      doc['otp']      = await Helper.Otp(SmsDet)
      doc.save()
      let msg = ""
      await Helper.Sms_Otp_Details(req,res,msg,req.body.phonenumber)
      await Helper.SuccessValidation(req,res,doc,'Added successfully')
    }else{
      return jwt.sign({user:doc}, 'abcdefg', {expiresIn:'10d'}, async (err,token) => {
        if(!err){
          let refreshToken = randtoken.generate(256)+records.id
          await ThisModel.updateOne({_id:records.id},{ $set:{refreshToken:refreshToken}})
          records = {results:records,Token:token,refreshToken:refreshToken}
          await Helper.SuccessValidation(req,res,records,'Added successfully')
        }else{
          return await Helper.ErrorValidation(req,res,err,'cache')
        }
      });
    }
  }).catch( async (err) => {
    console.log(err)
    return await Helper.ErrorValidation(req,res,err,'cache')
  })
}

const list = async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  
  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      let FollowWhere = {}
      FollowWhere.user_from_id = req.user.id
      query['where'] = {}
      query['include'] =[
        {
          model:Model.UserInterest,
          include:{
            model:Model.MasterInterest,
            required:false
          },
          required:false
        },
        {
          model     : Model.UserFollowing,
          where     : FollowWhere,
          required  : false
        }
      ]
      console.log(query)
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
  // #swagger.tags = ['User']
  let query ={}
  let FollowWhere = {}
  FollowWhere.user_from_id = req.user.id
  query['include'] =[
    {
      model:Model.UserInterest,
      include:{
        model:Model.MasterInterest,
        required:false
      },
      required:false
    },
    {
      model     : Model.UserFollowing,
      where     : FollowWhere,
      required  : false
    }
  ]
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){
    records = null
  }
  return await Helper.SuccessValidation(req,res,records)
}

const update = async (req, res) => {
  // #swagger.tags = ['User']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "properties": { 
          "first_name": { 
            "type": "string",
          },
          "last_name": { 
            "type": "string",
          },
          "email": { 
            "type": "string",
          },
          "phonenumber": { 
            "type": "string",
          },
          "password": { 
            "type": "string",
          },
          "photo_1": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "photo_2": { 
            "type": "object",
            "description":"S3 bucket object"
          },
          "photo_3": { 
            "type": "object",
            "description":"S3 bucket object"
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
          "dob": { 
            "type": "string",
            "description":"Accepts YY-MM-DD Formats Only"
          },
          "gender": { 
            "type": "string",
            "default":"Male",
            "enum":["Male","Female","Other"],
          },
          "region": { 
            "type": "string",
          },
          "language": { 
            "type": "string",
          },
          "experience": { 
            "type": "number"
          },
          "height": { 
            "type": "number"
          },
          "about_us": { 
            "type": "string"
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
  // #swagger.tags = ['User']
  try{
    let record = await ThisModel.destroy({where:{id:req.params.id}})
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const bulkremove = async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.parameters['ids'] = { description: 'Enter multiple ids',type: 'array',required: true,}
    let theArray = req.params.ids 
    if(!Array.isArray(theArray)){theArray = theArray.split(",");}
    for (let index = 0; index < theArray.length; ++index) {
      const rowid = theArray[index];
      await ThisModel.destroy({where:{id:rowid}}).then((response) => {}).catch((err) => {});
    }
    return await Helper.SuccessValidation(req,res,[],"Deleted successfully")
}

const login = async (req, res) => {
  // #swagger.tags = ['User']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumber"], 
        "properties": { 
          "phonenumber": { 
            "type": "number",
          }
        } 
      } 
    }
  */
  req.query['is_with_otp'] = true
  try{
    let records = await ThisModel.findOne({where:{phonenumber:req.body.phonenumber}});
    if(records){
      if(req.query.is_with_otp == false || req.query.is_with_otp == "false"){
        let PwdStatus = true
        if(req.body.password && req.body.password!=null){
          PwdStatus = await bcrypt.compare(req.body.password, records.password);
        }
        if(PwdStatus){
          return jwt.sign({user:records}, 'abcdefg', {expiresIn:'10d'}, async (err,token) => {
            if(!err){
              let refreshToken = randtoken.generate(256)+records.id
              await ThisModel.update({refreshToken:refreshToken},{where:{id:records.id}})
              records = {results:records,Token:token,refreshToken:refreshToken}
              await Helper.SuccessValidation(req,res,records)
            }else{
              return await Helper.ErrorValidation(req,res,err,'cache')
            }
          });
        }else{
          return await Helper.ErrorValidation(req,res,{message:"Invalid password"},'cache')
        }
      }else{
        let otp      = await Helper.Otp(req,res)
        await ThisModel.update({otp:otp},{where:{id:records.id}})
        let msg = ""
        await Helper.Sms_Otp_Details(req,res,msg,req.body.phonenumber)
        await Helper.SuccessValidation(req,res,records,"Please login with otp")
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid credentials"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const loginwithotp = async (req, res) => {
  // #swagger.parameters['otp'] = {type:"number"}
  // #swagger.tags = ['User']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["phonenumber"], 
        "properties": { 
          "phonenumber": { 
            "type": "number",
          }
        } 
      } 
    }
  */
  try{
    let records = await ThisModel.findOne({where:{phonenumber:req.body.phonenumber,otp:req.query.otp}});
    if(records){
      return jwt.sign({user:records}, 'abcdefg', {expiresIn:'10d'}, async (err,token) => {
        if(!err){
          let refreshToken = randtoken.generate(256)+records.id
          await ThisModel.update({refreshToken:refreshToken,otp:null},{where:{id:records.id}})
          records = {results:records,Token:token,refreshToken:refreshToken}
          await Helper.SuccessValidation(req,res,records)
        }else{
          return await Helper.ErrorValidation(req,res,err,'cache')
        }
      });
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid otp or phonenumber"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const changePassword = async (req, res) => {
  // #swagger.tags = ['User']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["old_password","new_password","confirm_new_password"], 
        "properties": { 
          "old_password": { 
            "type": "string",
          },
          "new_password": { 
            "type": "string",
          },
          "confirm_new_password": { 
            "type": "string",
          },
        } 
      } 
    }
  */
  try{
    if(req.body.confirm_new_password == req.body.new_password){
      let records = await ThisModel.findByPk(req.user.id);
      if(records){
        let PwdStatus = await bcrypt.compare(req.body.old_password, records.password);
        if(PwdStatus){
          const salt = await bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.new_password, salt);
          let updatestatus = await ThisModel.update({password:hash},{where:{id:req.user._id}})
          if(updatestatus){
            CheckRecord = await ThisModel.findByPk(req.user.id);
            return await Helper.SuccessValidation(req,res,CheckRecord)
          }else{
            return await Helper.ErrorValidation(req,res,updatestatus,'cache')
          }
        }else{
          return await Helper.ErrorValidation(req,res,{message:"Invalid old password"},'cache')
        }
      }else{
        return await Helper.ErrorValidation(req,res,{message:"Invalid authentication"},'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"New and confirmed passwords are not the same"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const refreshToken = async (req, res) => {
  // #swagger.tags = ['User']
  try{
    let records = await ThisModel.findOne({where:{refreshToken:req.params.refreshToken}});
    if(records){
      return jwt.sign({user:records}, 'abcdefg', {expiresIn:'10d'}, async (err,token) => {
        if(!err){
          records = {results:records,Token:token}
          await Helper.SuccessValidation(req,res,records)
        }else{
          return await Helper.ErrorValidation(req,res,err,'cache')
        }
      });
    }else{
      return await Helper.ErrorValidation(req,res,"Invalid refreshToken",'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}


const resetpassword = async (req, res) => {
  // #swagger.tags = ['User']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["password"], 
        "properties": { 
          "password": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  try{
    let records = await ThisModel.findOne({where:{id:req.params.id,resetPawordToken:resetPawordToken}});
    if(records){
      const salt = await bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      let updatestatus = await ThisModel.update({resetPawordToken:null,password:hash},{where:{id:req.params.id}})
      if(updatestatus){
        CheckRecord = await ThisModel.findByPk({_id:req.params.id});
        return await Helper.SuccessValidation(req,res,CheckRecord)
      }else{
        return await Helper.ErrorValidation(req,res,updatestatus,'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid resetPawordToken"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const forgotpassword = async (req, res) => {
  // #swagger.tags = ['User']
  try{
    let records = await ThisModel.findOne({where:{email:req.params.email}});
    if(records){
      let resetPawordToken = await Helper.GetUuid(2)
      let pwd = await Helper.Otp()
      let text = 'Your new password is '+pwd
      let subject = 'Your new forgotten password has been generated. '
      let transporter = await Helper.SentMail(req.params.email,subject,text)
      return await Helper.SuccessValidation(req,res,records,'Password token link send to you mail check once')
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid email"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

module.exports = {create,list, view, update, remove, bulkremove, login, resetpassword, forgotpassword, refreshToken, changePassword, loginwithotp};
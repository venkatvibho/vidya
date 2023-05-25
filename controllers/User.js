const jwt               =      require('jsonwebtoken');
const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Sequelize         =       require("sequelize");
const Op                =       Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
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
  await body('first_name').isAlpha('en-US', {ignore: ' '}).withMessage('Name must be alphabetic.').run(req)
  await body('phonenumber').isLength({min:10,max:10}).withMessage('Phone number should be 10 digits ').run(req)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    req.body['user_id'] = await Helper.GenerateUid(req,res)
    req.body['password'] = 'test123'
    req.body['otp_at'] = await Helper.IncrementSeconds()
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
        let query = {}
        query['attributes'] = {}
        query['attributes']['exclude'] = await commonExclude()
        doc = await ThisModel.findByPk(doc.id,query);
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
}

const commonExclude = async (req,res) => {
  return ['otp','otp_at','password','resetPawordToken','status']
}

const commonGet = async (req,res,whereInclude) => {
  let UsersLanguageBooLn = false
  let UserInterestBooLn = false
  let UsersLanguageArr = {}
  let UserInterestArr = {}
  if(req.query.language_id){
    UsersLanguageBooLn = true
    UsersLanguageArr['languages_id'] = {[Op.in]:req.query.language_id.split(',')}
  }
  if(req.query.interest_id){
    UserInterestBooLn = true
    UserInterestArr['interest_id'] = {[Op.in]:req.query.interest_id.split(',')}
  }
  console.log(UserInterestArr)
  return [
    {
      model:Model.UserFollowing,
      // as:"UserFollowing",
      attributes:["id","status"],
      where:{user_from_id:req.user.id},
      required:false,
      duplicate: false
    },
    {
      model:Model.UserInterest,
      include:{
        model:Model.MasterInterest,
        required:false
      },
      where:UserInterestArr,
      required:UserInterestBooLn
    },
    {
      model:Model.UsersLanguage,
      where:UsersLanguageArr,
      required:UsersLanguageBooLn
    }
  ]
}

const list = async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.parameters['page_size'] = {in: 'query',type:'number'}
  //  #swagger.parameters['page'] = {in: 'query',type:'number'}
  //  #swagger.parameters['username'] = {in: 'query',type:'string'}
  //  #swagger.parameters['profession_id'] = {in: 'query',type:'array','description':'Take id from MasterProfession'}
  //  #swagger.parameters['city'] = {in: 'query',type:'array','description':'Take name from MasterCities'}
  //  #swagger.parameters['qualification_id'] = {in: 'query',type:'array','description':'Take id from MasterIndustry'}
  //  #swagger.parameters['gender'] = {in: 'query',type:'array',description:"Male,Female,Non-Binary"}
  //  #swagger.parameters['language_id'] = {in: 'query',type:'array','description':'Take ids from MasterLanguages'}
  //  #swagger.parameters['region'] = {in: 'query',type:'array'}
  //  #swagger.parameters['interest_id'] = {in: 'query',type:'array','description':'Take ids from MasterInterest'}

  try{
      let pageSize = 0;
      let skip = 0;
      let query={}
      query['attributes']= {}
      query['attributes']['exclude']= await commonExclude()
      // let FollowWhere = {}
      // FollowWhere.user_from_id = req.user.id
      query['attributes']['include'] = [
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.user_followings WHERE status='Accepted' AND user_to_id=${req.user.id})`),'honor'
        ],
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.user_followings WHERE status='Accepted' AND user_to_id=${req.user.id})`),'genune'
        ],
        [
          Sequelize.literal(`(SELECT COUNT(id) FROM public.user_followings WHERE status='Hide' AND user_to_id="User".id AND user_from_id=${req.user.id})`),'isHideCount'
        ],
      ]
      query['where'] = {}
      if(req.query.username){
        query['where']['first_name'] = {[Op.like]: '%'+req.query.username+'%'}
      }
      query['where']['id'] = {[Op.notIn]:[req.user.id]}
      if(req.query.profession_id){
        query['where']['profession_id'] = {[Op.in]:req.query.profession_id.split(',')}
      }
      if(req.query.city){
        query['where']['city'] = {[Op.in]:[req.query.city]}
      }
      if(req.query.qualification_id){
        query['where']['highest_qualification'] = {[Op.in]:req.query.qualification_id.split(',')}
      }
      if(req.query.gender){
        query['where']['gender'] = {[Op.in]:req.query.gender.split(',')}
      }
      if(req.query.region){
        query['where']['region'] = {[Op.in]:req.query.region.split(',')}
      }
      let is_whereHide = {}
      query['include'] = await commonGet(req, res,{is_whereHide:is_whereHide})
      console.log(query)
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
      // query['having']= { isHideCount: 0 }
      // query['subQuery']= false
      const noOfRecord = await ThisModel.findAndCountAll(query)
      return await Helper.SuccessValidation(req,res,noOfRecord)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const view = async (req, res) => {
  // #swagger.tags = ['User']
  let user_id = req.user.id
  let query ={}
  let FollowWhere = {}
  FollowWhere.user_from_id = user_id
  query['attributes']= {}
  query['attributes']['exclude']= await commonExclude()
  query['attributes']['include'] = [
    [
        Sequelize.literal(`(SELECT COUNT(id) FROM public.user_followings WHERE status='Accepted' AND user_from_id=${user_id})`),'followings'
    ],
    [
      Sequelize.literal(`(SELECT COUNT(id) FROM public.user_followings WHERE status='Accepted' AND user_to_id=${user_id})`),'followers'
    ],
  ]
  query['include'] = await commonGet(req, res,{UserFollowingWhere:{user_from_id:user_id}})
  console.log(query)
  let records = await ThisModel.findByPk(req.params.id,query);
  if(!records){records = null}
  let ActivityCnt = await Model.ActivityUser.count({where:{user_id:req.user.id,status:'Sent'}})
  let NotifCount  = await Model.UserFollowing.count({where:{user_to_id:req.user.id,status:'Sent'}})
  records = JSON.parse(JSON.stringify(records))
  records['notifications']   = ActivityCnt+NotifCount
  records['honour']  = await Model.ActivityUser.count({where:{user_id:req.user.id}})
  records['genuine'] = await Model.SlambookBeat.count({
    include:[{
      model:Model.UserFollowing,
      where:{user_from_id:req.user.id,status:"Accepted"},
      required:true
    }]
  })
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
          "user_id": { 
            "type": "string",
          },
          "email": { 
            "type": "string",
          },
          "phonenumber": { 
            "type": "string",
          },
          "highest_qualification": { 
            "type": "string",
          },
          "industry_id": { 
            "type": "number",
            "description":"Take id from MasterIndustry"
          },
          "profession_id": { 
            "type": "number",
            "description":"Take id from MasterProfessions"
          },
          "salary_range": { 
            "type": "string",
          },
          "your_study": { 
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
          "city": { 
            "type": "string"
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
            "enum":["Male","Female","Non-Binary"],
          },
          "region": { 
            "type": "string",
          },
          "languages": { 
            "type": "array",
            "description":"Take id from MasterLanguages Ex:[1,2,3]"
          },
          "experience": { 
            "type": "number"
          },
          "height": { 
            "type": "number"
          },
          "marital_status": { 
            "type": "string",
            "enum":["Single","Married","Divorced"],
            "default":"Single"
          },
          "about_us": { 
            "type": "string"
          },
        } 
      } 
    }
  */
  if(req.body.first_name){
    await body('first_name').isAlpha('en-US', {ignore: ' '}).withMessage('Name must be alphabetic.').run(req)
  }
  if(req.body.phonenumber){
    await body('phonenumber').isLength({min:10,max:10}).withMessage('Phone number should be 10 digits.').run(req)
  }
  if(req.body.email){
    await body('email').isEmail().withMessage('Please enter valid emailid.').run(req)
  }
  if(req.body.dob){
    try{
      req.body['dob'] = await Helper.DT_Y_M_D(req.body.dob)
    }catch(err){
      console.log(err)
    }
  }
  if(req.body.gender){
    await body('gender').isIn(["Male","Female","Non-Binary"]).withMessage('Gender must be Male | Female | Non-Binary').run(req)
  }
  if(req.body.marital_status){
    await body('marital_status').isIn(["Single","Married","Divorced"]).withMessage('Marital Status must be Single | Married | Divorced').run(req)
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    let languages = null
    if(req.body.languages){
      languages = req.body.languages
      delete req.body['languages'] 
    }
    let citystatus = true
    let citymsg  = null
    if(req.body.location){
      if(!req.body.city || !req.body.latitude || !req.body.longitude){
        citystatus = false
        citymsg    = (!req.body.city) ?'City is required': ((!req.body.latitude) ? 'Latitude is required':'Longitude is required')
      }
    }
    if(citystatus){
      let Checkuser_id = 0
      if(req.body.user_id){
          let WhQuery = {}
          WhQuery['where'] = {}
          WhQuery['where']['user_id'] = req.body.user_id
          WhQuery['where']['id'] = {[Op.notIn]:[req.params.id]}
          Checkuser_id = await ThisModel.count(WhQuery)
      }
      if(Checkuser_id==0){
        return await ThisModel.update(req.body,{where:{id:req.params.id}}).then(async(records) => {
          if(languages){
            await Model.UsersLanguage.destroy({where:{user_id:req.user.id}})
            for(const lg of languages) {
              try{
                await Model.UsersLanguage.create({user_id:req.user.id,languages_id:lg})
              }catch(err){
                console.log(err)
              }
            }
          }
          let query = {}
          query['attributes'] = {}
          query['attributes']['exclude'] = await commonExclude()
          records = await ThisModel.findByPk(req.params.id,query);
          await Helper.SuccessValidation(req,res,records,'Updated successfully')
        }).catch( async (err) => {
          return await Helper.ErrorValidation(req,res,err,'cache')
        })
    }else{
      return await Helper.ErrorValidation(req,res,{message:"This userID is already taken, please try for new one."},'cache')
    }
    }else{
      return await Helper.ErrorValidation(req,res,{message:citymsg},'cache')
    }
  }
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
  let is_with_otp = true
  try{
    let records = await ThisModel.findOne({where:{phonenumber:req.body.phonenumber}});
    if(records){
      if(is_with_otp == false || is_with_otp == "false"){
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
        let IsValid = 10
        if(["/User/resendotp"].includes(req.route.path)){
          let DateCheck= await Helper.CurrentDate()
          console.log(DateCheck)
          IsValid = await ThisModel.count({where:{id:records.id,otp_at:{[Op.lte]:DateCheck}}})
        }
        if(IsValid>0){
          let otp      = await Helper.Otp(req,res)
          let otp_at   = await Helper.IncrementSeconds()
          await ThisModel.update({otp:otp,otp_at:otp_at},{where:{id:records.id}})
          let msg = ""
          await Helper.Sms_Otp_Details(req,res,msg,req.body.phonenumber)
          let query = {}
          query['attributes'] = {}
          query['attributes']['exclude'] = await commonExclude()
          records = await ThisModel.findByPk(records.id,query);
          await Helper.SuccessValidation(req,res,records,"Please login with otp")
        }else{
          return await Helper.ErrorValidation(req,res,{message:"Wait and try after 1 minute"},'cache')
        }
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid phonemumber"},'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const loginwithotp = async (req, res) => {
  // #swagger.parameters['otp'] = {type:"number",required:true}
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
          let CheckGroupCHatInvite = await Model.GroupChatInvited.findOne({where:{phonenumber:req.body.phonenumber,is_deleted:false}})
          if(CheckGroupCHatInvite){
            try{
              await Model.GroupsParticipant.create({group_id:CheckRoomCHatInvite.id,user_id:records.id})
              CheckGroupCHatInvite.is_deleted=true
              CheckGroupCHatInvite.save()
            }catch(err){
              console.log(err)
            }
          }
          let CheckRoomCHatInvite = await Model.ChatRoomInvited.findOne({where:{phonenumber:req.body.phonenumber,is_deleted:false}})
          if(CheckRoomCHatInvite){
            try{
              await Model.ChatRoomParticipant.create({chatroom_id:CheckRoomCHatInvite.id,user_id:records.id})
              CheckRoomCHatInvite.is_deleted=true
              CheckRoomCHatInvite.save()
            }catch(err){
              console.log(err)
            }
          }
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

const CheckUserId = async (req, res) => {
  // #swagger.tags = ['User']
  let WhQuery = {}
  WhQuery['where'] = {}
  WhQuery['where']['user_id'] = req.body.user_id
  if(req.user){
    WhQuery['where']['id'] = {[Op.notIn]:[req.user.id]}
  }
  try{
    let records = await ThisModel.count(WhQuery)
    if(records){
      return await Helper.SuccessValidation(req,res,{message:"This userID is already taken, please try for new one."})
    }else{
      return await Helper.ErrorValidation(req,res,"User id is valid",'cache')
    }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const GenerateUserId = async (req, res) => {
  // #swagger.tags = ['User']
  let UserId = await Helper.GenerateUid(req,res)
  return await Helper.SuccessValidation(req,res,{"user_id":UserId})
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

module.exports = {create,list, view, update, remove, bulkremove, login, resetpassword, CheckUserId, GenerateUserId, forgotpassword, refreshToken, changePassword, loginwithotp};
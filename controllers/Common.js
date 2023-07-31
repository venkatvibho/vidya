const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const expres            =      require('express')
const router            =      expres.Router()
const AWS               =       require('aws-sdk');
const Model             =      require("../models");

const Upload = async (req, res) => {
  // #swagger.tags = ['Common']
  /*
    #swagger.consumes = ['multipart/form-data']  
    #swagger.parameters['singleFile'] = {
    in: 'formData',
    type: 'file',
    required: 'true',
    description: 'Upload file...',
  } 
  */
  try{
    // req.file['Location'] = req.headers.host+'/'+req.file.path
    // let UpFileData = uploadFile(req.file.path,req.file.originalname)
    console.log(req.file)
    const s3      = new AWS.S3({ accessKeyId: "AKIAUQJSWLI32GQ45LPG",secretAccessKey: "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"});
    var fs        = require('fs');
    const file    = fs.readFileSync(req.file.path);
    const BUCKET  = 'sociobeats1';
    const uploadParams = {
      Bucket: BUCKET,
      Key: req.file.filename,
      Body: file
    };
    return await s3.upload(uploadParams,async function (err, data) {
      if (err) {
        return await Helper.ErrorValidation(req,res,err,'cache')
      }
      if (data) {
        console.log(data)
        try {
          fs.unlinkSync(req.file.path);
        } catch (error) {
          console.log(error);
        }
        res.send(JSON.stringify(data))
      }
    });
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}

const Indicators = async (req, res) => {
  // #swagger.tags = ['Common']
  let records = {
    poll:1,
    chat:1,
    group:1,
    calls:1
  }
  return await Helper.SuccessValidation(req,res,records)
}

const uploadFile = async (filePath, keyName) => {
    return new Promise((resolve, reject) => {
      try {
        const s3 = new AWS.S3({
          accessKeyId: "AKIAUQJSWLI32GQ45LPG",
          secretAccessKey: "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",
        });
        var fs = require('fs');
        const file = fs.readFileSync(filePath);
        const BUCKET = 'sociobeats';
        const uploadParams = {
          Bucket: BUCKET,
          Key: keyName,
          Body: file
        };
        s3.upload(uploadParams, function (err, data) {
          if (err) {
            return reject(err);
          }
          if (data) {
            return resolve(data);
          }
        });
      } catch (err) {
        return reject(err);
      }
    })
}

const privacysettings = async (req, res) => {
  let udata = await Model.User.findAll({})
  await udata.forEach(async element => {
    try{
      await Model.UserPrivacySetting.create({
      "user_id":element.id,
      "tag": "Allow from anyone",
      "connect": "Allow from anyone",
      "profile_lock": "No",
      "block_user": "No",
      "message": "Allow from anyone",
      "group_request": "Allow from anyone",
      "schedules": "Allow from anyone",
      "location": "No",
      "post_comments": "Allow from anyone",
      "reaction_pref": "No",
      "profile_info": "No",
      "review_taggings": "No"
      })
    }catch(err){
      console.log(err)
    }
  });
  return await Helper.SuccessValidation(req,res,[])
}


const BirthDayCron = async (req, res) => {
  // #swagger.tags = ['Common']
  // #swagger.description = "For Every night 1 PM Only once"
  let todaydate = await Helper.CurrentDate()
  todaydate     = await Helper.DT_Y_M_D(todaydate)
  let query = {}
  query['include'] = [
    {
      model:Model.User,
      as: "FollowingFrom",
      attributes:["id","first_name","user_id","dob"],
      required:true
    },
    {
      model:Model.User,
      foreignKey: 'user_to_id',
      attributes:["id","first_name","user_id","dob"],
      required:true
    }
  ] 
  query['where'] = Sequelize.literal(`((SELECT COUNT(*) FROM public.users WHERE id="UserFollowing"."user_from_id" AND dob='${todaydate}')>1) OR (SELECT COUNT(*) FROM public.users WHERE id="UserFollowing"."user_to_id" AND dob='${todaydate}')>1)`)
  let FriendsDetails = await Model.UserFollowing.findAll(query)
  if(FriendsDetails){
    for(let i = 0; i < FriendsDetails.length; i++){
      let from = null
      let to = null
      let friend = FriendsDetails[i]
      if(friend.FollowingFrom.dob==todaydate){
        from = friend.FollowingFrom
        to   = friend.User
      }else{
        to = friend.FollowingFrom
        from   = friend.User
      }
      let msg = {
        from:from,
        to:to
      }
      let loadPushnotification = await require("../utils/notification")
      await loadPushnotification.sendPushnotification(req,res,10,0,msg);
    }
  }
  return await Helper.SuccessValidation(req,res,{})
}


const ActivityCron = async (req, res) => {
  // #swagger.tags = ['Common']
  // #swagger.description = "For Every 5 minutes

  let loadPushnotification = await require("../utils/notification")
  await loadPushnotification.sendPushnotification(req,res,4,part,{});
  return await Helper.SuccessValidation(req,res,{})
}

module.exports = {BirthDayCron,ActivityCron,Upload,Indicators,privacysettings};
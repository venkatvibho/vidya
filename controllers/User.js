const jwt               =      require('jsonwebtoken');
const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Sequelize         =       require("sequelize");
const Op                =       Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const moment            =       require('moment')
const Model             =      require("../models");
const ThisModel         =      Model.User
let md5                 =      require('md5');

const login = async (req, res) => {
  // #swagger.tags = ['User']
  /*
    #swagger.parameters['data'] = {
      in: 'body', 
      '@schema': { 
        "required": ["username","pwd"], 
        "properties": { 
          "username": { 
            "type": "string",
          },
          "pwd": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  let is_with_otp = true
  try{
    let records = await ThisModel.findOne({where:{username:req.body.username,pwd:md5(req.body.pwd)}});
    if(records){
      let is_deleted = await (records.status=="Deleted")?true:false
      if(is_deleted == false){
            let getJwtEncCode = await Helper.getJwtEncCode()
            return jwt.sign({user:records},getJwtEncCode.code,{expiresIn:getJwtEncCode.expiresIn}, async (err,token) => {
              if(!err){
                records = {results:records,Token:token}
                await Helper.SuccessValidation(req,res,records)
              }else{
                return await Helper.ErrorValidation(req,res,err,'cache')
              }
            });
      }else{
        return await Helper.ErrorValidation(req,res,{message:"Invalid credentials"},'cache')
      }
    }else{
      return await Helper.ErrorValidation(req,res,{message:"Invalid credentials"},'cache')
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
        let pwd = await Helper.Otp()
        let updatestatus = await ThisModel.update({pwd:md5(req.body.new_password)},{where:{id:req.user._id}})
        if(updatestatus){
          CheckRecord = await ThisModel.findByPk(req.user.id);
          return await Helper.SuccessValidation(req,res,CheckRecord)
        }else{
          return await Helper.ErrorValidation(req,res,updatestatus,'cache')
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

const profile = async (req, res) => {
  // #swagger.tags = ['User']
}

module.exports = {login,forgotpassword,changePassword,profile};
const Sequelize         =      require("sequelize");
const Op                =      Sequelize.Op;
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const Model             =      require("../models");
const ThisModel         =      Model.MasterLanguage

const helpsupport = async (req, res) => {
  // #swagger.tags = ['Settings']
  /*
    #swagger.parameters['body'] = {
      in: 'body', 
      '@schema': { 
        "required": ["email","location","description"], 
        "properties": { 
          "email": { 
            "type": "string",
          },
          "location": { 
            "type": "string",
          },
          "description": { 
            "type": "string",
          }
        } 
      } 
    }
  */
  await body('email').notEmpty().withMessage('Email is required.').run(req)
  await body('email').isEmail().withMessage('Invalid email.').run(req)
  await body('location').notEmpty().withMessage('location is required.').run(req)
  await body('description').notEmpty().withMessage('description is required.').run(req)
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    let firstError = errors.errors.map(error => error.msg)[0];
    return await Helper.ErrorValidation(req,res,{message:firstError},'cache')
  }else{
    let tomail = 'venkat.cse01@gmail.com'
    let text   = "Email: "+req.body.email+" , Location: "+req.body.location+" , Content: "+req.body.description+""
    let mailSent = await Helper.SentMail(tomail,'Help && Support',text)
    return await Helper.SuccessValidation(req,res,{message:"Mail sent successfully"},mailSent)
  }
}

module.exports = {
  helpsupport,
};
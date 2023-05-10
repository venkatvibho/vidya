const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const expres            =      require('express')
const router            =      expres.Router()

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
    req.file['url'] = req.headers.host+'/'+req.file.path
    res.send(req.file)
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

module.exports = {Upload,Indicators};
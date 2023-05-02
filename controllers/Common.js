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
    //# import entire SDK
    var AWS = require('aws-sdk');
    //# import AWS object without services
    var AWS = require('aws-sdk/global');
    //# import individual service
    //# var S3 = require('aws-sdk/clients/s3');
    // const s3 = new AWS.S3({
    //   accessKeyId: "AKIAYAHNFOTRUEEQP6WT",
    //   secretAccessKey: "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",
    // });
    // const BUCKET = 'optiwins-dev-2';
    // try {
    //   let filePath = req.path
    //   let keyName  = req.file.originalname
    //   var fs = require('fs');
    //   const file = fs.readFileSync(filePath);
    //   const uploadParams = {Bucket: BUCKET,Key: keyName,Body: file};
    //   s3.upload(uploadParams, function async (err, data) {
    //     if (err) {
    //       return  Helper.ErrorValidation(req,res,err,'cache')
    //     }else{
    //       console.log("####",req.file)
    //       res.send(data)
    //     }
    //   });
    // } catch (err) {
    //   return Helper.ErrorValidation(req,res,err,'cache')
    // }
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}
module.exports = {Upload};
const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Helper            =      require("../middleware/helper");
const { body, validationResult } = require('express-validator');
const expres            =      require('express')
const router            =      expres.Router()
const AWS               =       require('aws-sdk');

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
    const s3      = new AWS.S3({ accessKeyId: "AKIAUQJSWLI32GQ45LPG",secretAccessKey: "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"});
    var fs        = require('fs');
    const file    = fs.readFileSync(req.file.path);
    const BUCKET  = 'sociobeats1';
    const uploadParams = {
      Bucket: BUCKET,
      Key: req.file.originalname,
      Body: file
    };
    return await s3.upload(uploadParams,async function (err, data) {
      if (err) {
        return await Helper.ErrorValidation(req,res,err,'cache')
      }
      if (data) {
        console.log(data)
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

module.exports = {Upload,Indicators};
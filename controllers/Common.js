const randtoken         =      require('rand-token');
const bcrypt            =      require("bcrypt");
const Helper            =      require("../middleware/helper");
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
    console.log("####",req.file)
    res.send(req.file)
  } catch (err) {
    return await Helper.ErrorValidation(req,res,err,'cache')
  }
}
module.exports = {Upload};
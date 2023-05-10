const multer = require('multer');
function fileFilter (req, file, cb) {
  if(file.mimetype !=='image/jpeg' || file.mimetype !=='image/jpg'  || file.mimetype !=='image/png'){
    // cb('Invalid format', false)
    cb(null, true)
  }
  cb(null, true)
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/files/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now()+'.'+file.mimetype.split("/")[1])
      // cb(null, file.originalname)
    }
  })
   
  let upload = multer({ storage , fileFilter });
  // upload = multer()
  module.exports = upload;
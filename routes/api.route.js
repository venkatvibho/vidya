const expres                    =   require('express')
const router                    =   expres.Router()
const authorization             =   require('../middleware/authentication')

// const CommonController          =  require('../controllers/Common.js')
// const upload = require('../middleware/fileUpload')
// router.post("/Common/Upload",upload.single("singleFile"),CommonController.Upload)

const UserController          =  require('../controllers/User.js')
router.post("/User/create",UserController.create)
router.get("/User/list",UserController.list)
router.get("/User/view/:id",authorization,UserController.view)
router.patch("/User/update/:id",UserController.update)
router.post("/User/login",UserController.login)
router.post("/User/resendotp",  UserController.login)
router.post("/User/loginwithotp",UserController.loginwithotp)
router.get("/User/refreshToken/:refreshToken",  UserController.refreshToken)
// router.delete("/User/delete/:id",UserController.remove)
// router.delete("/User/bulkdelete/:ids",UserController.bulkremove)

// router.get("/User/forgotpassword/:email", UserController.forgotpassword)
// router.patch("/User/resetpassword/:id/:resetPawordToken",UserController.resetpassword)
// router.post("/User/changePassword",UserController.changePassword)

// const MasterActivityController          =  require('../controllers/MasterActivity.js')
// router.post("/MasterActivity/create",MasterActivityController.create)
// router.get("/MasterActivity/list",MasterActivityController.list)
// router.get("/MasterActivity/view/:id",authorization,MasterActivityController.view)
// router.patch("/MasterActivity/update/:id",MasterActivityController.update)
// router.delete("/MasterActivity/delete/:id",MasterActivityController.remove)
// router.delete("/MasterActivity/bulkdelete/:ids",MasterActivityController.bulkremove)

module.exports = router
const expres                    =   require('express')
const router                    =   expres.Router()
const authorization             =   require('../middleware/authentication')
const valiDations               =   require('../middleware/valiDations')

const CommonController          =  require('../controllers/Common.js')
const upload = require('../middleware/fileUpload')
router.post("/Common/Upload",authorization,upload.single("singleFile"),CommonController.Upload)

const UserController          =  require('../controllers/User.js')
router.post("/User/login",UserController.login)
router.post("/User/changePassword",UserController.changePassword)
// router.get("/User/forgotpassword/:email",UserController.forgotpassword)


const DonationController          =  require('../controllers/Donation.js')
router.post("/Donation/create",authorization,DonationController.create)
router.get("/Donation/list",authorization,DonationController.list)
router.get("/Donation/view/:id",authorization,DonationController.view)
router.patch("/Donation/update/:id",authorization,DonationController.update)
router.delete("/Donation/delete/:id",authorization,DonationController.remove)
router.delete("/Donation/bulkdelete/:ids",authorization,DonationController.bulkremove)

module.exports = router
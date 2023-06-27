const jwt   =   require('jsonwebtoken');

const authenticationToken = async (req, res , next) => {
    if(req.headers.authorization!=undefined){
        const Token = req.headers.authorization.replace("Bearer ","");
        if(typeof Token !=='undefined'){
            jwt.verify(Token, 'abcdefg' ,async (err, user) => {
                if(!err){
                    if(user.user){
                        req.user = user.user;
                        next();
                        // let Model      = require("../models");
                        // let LastDevice = await Model.UserLoginHistory.findOne({attributes:['device_id'],where:{user_id:user.user.id},order:[["id","DESC"]]})
                        // if(LastDevice){
                        //     if(LastDevice.device_id){
                        //         if(LastDevice.device_id==user.device_id){
                        //             req.user = user.user;
                        //             next();
                        //         }else{
                        //             res.status(401).send({ message:"Invalid mobile used"},{});
                        //         }
                        //     }else{
                        //         res.status(401).send({ message:"Invalid mobile used"},{});
                        //     }
                        // }else{
                        //     res.status(401).send({ message:"Unauthorized" , err});
                        // }
                    }else{
                        res.status(401).send({ message:"Unauthorized" , err});
                    }
                }else{
                    res.status(401).send({ message:"Invalid mobile used"},{});
                }
            });
        }else{
            res.status(401).send({message:"Unauthorized"});
        }
    }else{
        let swaggerFile   = require('../swagger_output.json')
        let defaultKey    = await (swaggerFile.host=='localhost:8000')?true:false;
        if(defaultKey){
            req.user = {id:98};
            next();
        }else{
            let WithoutAccess = [
                // "/User/view/:id",
                "/User/GenerateUserId",
                "/Common/Upload",
            ]
            if(WithoutAccess.includes(req.route.path)){
                next();
            }else{
                res.status(401).send({message:"Unauthorized"});
            }
        }
    }
}

module.exports = authenticationToken;
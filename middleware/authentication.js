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
            req.user = {id:1,dob:'1991-01-01'};
            next();
        }else{
            let WithoutAccess = [
                // "/User/view/:id",
                "/Common/Upload",
                "/Donation/create",
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
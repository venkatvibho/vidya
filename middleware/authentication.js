const jwt   =   require('jsonwebtoken');

const authenticationToken = (req, res , next) => {
    if(req.headers.authorization!=undefined){
        const Token = req.headers.authorization.replace("Bearer ","");
        if(typeof Token !=='undefined'){
            jwt.verify(Token, 'abcdefg' ,(err, user) => {
                // console.log("####TOKEN####",user)
                if(!err){
                    if(user.user){
                        req.user = user.user;
                        next();
                    }else{
                        res.status(401).send({ message:"Unauthorized" , err});
                    }
                }else{
                    res.status(401).send({ message:"Unauthorized" , err});
                }
            });
        }else{
            res.status(401).send({message:"Unauthorized"});
        }
    }else{
        let defaultKey = false
        if(defaultKey){
            req.user = {id:2};
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
const User=require('../models/user');

module.exports=(req,res,next)=>{
    User.find({ user: req.user }).then(user => {
        res.locals.userlogin=req.user;
        next();
      });
}
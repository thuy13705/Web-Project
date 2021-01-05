const Course=require('../models/Course');

module.exports=(req,res,next)=>{
    var course;
    Course.find().then(result=>{
        res.locals.course=result;
        next();
    });
}
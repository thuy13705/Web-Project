const ParentCategory = require("../models/ParentCategory");


module.exports = (req, res, next) => {
    ParentCategory.find().populate("child").populate("courses").exec((err, categories) => {
        if (err){
            res.send("Err: " + err);
        }
        else {
            res.locals.categories = categories;
            next();
        }
    })
}
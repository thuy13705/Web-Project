const ChildCategory = require("../models/ChildCategory");

module.exports = (req, res, next) => {
    ChildCategory.find({}).populate("parentCategories").exec((err, categories) => {
        if (err){
            res.send("Err: " + err);
        }
        else {
            res.locals.categories = categories;
            next();
        }
    })
}
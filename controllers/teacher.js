const Users = require('../models/user');
const Course = require('../models/Course');
const ChildCategory=require('../models/ChildCategory');


exports.getAddCourse = (req, res) => {
    const message = req.flash("error")[0];
    Users.find({ user: req.user }).then(user => {
        res.render("add-course", {
            title: "Add Course",
            message: `${message}`,
            user: req.user,
        });
    });
}


exports.postAddCourse = (req, res, next) => {
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var category = req.body.category;
    
    var success = req.file.filename + " uploaded successfully";
    console.log(success);
    var course = new Course({
        image:req.file.filename,
        category:category,
        name: name,
        price: price,
        description: description

    });
    course.save(function (err, doc) {
        if (err) throw err;
        var category = req.body.category;
        ChildCategory.findOneAndUpdate({ name: category }, { $push: { courses: course._id } }, function (err) {
          if (err) res.redirect('/');
        });
  
        res.redirect('/add-course');
    });
};

exports.getCourseList = (req, res, next) => {
    const message = req.flash("error")[0];
    Users.find({ user: req.user }).then(user => {
      res.render("course-list", {
        title: "course List",
        message: `${message}`,
        user: req.user,
      });
    });
  }
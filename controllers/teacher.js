const Users = require('../models/user');
const Course = require('../models/Course');
var fs= require('fs');



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
    // var img=fs.readFileSync(req.file.path);
    // var encode_img=img.toString('base64');
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var category = req.body.category;
    
    var success = req.file.filename + " uploaded successfully";
    // var finalImage={
    //     contentType:req.file.mimetype,
    //     data: new Buffer(encode_img,'base64')
    // }
    console.log(success);
    var course = new Course({
        image:req.file.filename,
        category:category,
        // video:req.filevideo.filename,
        name: name,
        price: price,
        description: description
    });
    course.save(function (err, doc) {
        if (err) throw err;
        res.redirect('/add-course');
    });
};

exports.getCourseList = (req, res, next) => {
    const message = req.flash("error")[0];
    var userList;
    Users.find({ role: 1 }).then(user => {
      userList = user;
    })
    Users.find({ user: req.user }).then(user => {
      res.render("course-list", {
        title: "course List",
        message: `${message}`,
        user: req.user,
        userList: userList
      });
    });
  }
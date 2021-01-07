const Users = require('../models/user');
const Course=require('../models/Course');
const ChildCategory=require('../models/ChildCategory');


exports.getHomeView = (req, res) => {
  Users.find({ user: req.user }).then(user => {
    Course.find()
    .limit(10)
    .sort({'countBuy':-1})
    .then(courses => {
      Course.find()
        .limit(10)
        .sort({'countView':-1})
        .then(course => {
         Course.find()
         .limit(10)
         .sort({'createAt':-1})
         .then(newCourse=>{
          res.render("index", {
            title: "Home Page",
            user: req.user,
            viewCourse: course,
            Buy: courses,
            newCourse:newCourse,
          });
         })
        });
    })
    .catch(err => {
      console.log(err);
    });
  });
};

exports.getShowCourse= (req, res) => {
  Users.find({ user: req.user }).then(user => {
    ChildCategory.findOne({_id:req.params._id})
    .then(Child => {
      Course.find({category:Child.name})
         .then(course=>{
          res.render("show-course-list", {
            title: "Show Course List",
            user: req.user,
            courses:course,
          });
         })
        });
    })
    .catch(err => {
      console.log(err);
    });
};



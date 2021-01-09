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
    ChildCategory.findOne({_id:req.params.id})
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

exports.getSearchResult= (req, res) => {
  Users.find({ user: req.user }).then(user => {
    Course.find({$text: {$search: req.query.search}})
    .exec(function(err,course){
      res.render("show-course-list", {
        title: "Search Results",
        user: req.user,
        courses:course,
      });
    })
    })
    .catch(err => {
      console.log(err);
    });
};


exports.getAddWishList= (req, res) => {
  const message = req.flash("error")[0];

  Users.findOneAndUpdate({ _id: req.user._id },{ $push: {wish_list : req.params.id} }, function (err,course){
    if (req.user.role==0){
      res.render("wish-list", {
        title: "Wish List",
        user: req.user,
        message: `${message}`,
        courses:course,
      });
    }
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  }).catch(err => {
      console.log(err);
    });
};

exports.getShowWishList= (req, res) => {
  const message = req.flash("error")[0];
  Users.findOne({_id: req.user._id }).populate('wish_list')
  .exec((err,user)=>{
    if (err) throw err;
    console.log(user);
    if (req.user.role==0){
      res.render("wish-list", {
        title: "Wish List",
        user: req.user,
        message: `${message}`,
        courses:user,
      });
    }
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  })
};
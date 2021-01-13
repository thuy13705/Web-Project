const Users = require('../models/user');
const Course = require('../models/Course');
const ChildCategory = require('../models/ChildCategory');
const user = require('../models/user');


exports.getHomeView = (req, res) => {
  Users.find({ user: req.user }).then(user => {
    Course.find()
      .limit(10)
      .sort({ 'countBuy': -1 })
      .then(courses => {
        Course.find()
          .limit(10)
          .sort({ 'countView': -1 })
          .then(course => {
            Course.find()
              .limit(10)
              .sort({ 'createAt': -1 })
              .then(newCourse => {
                res.render("index", {
                  title: "Home Page",
                  user: req.user,
                  viewCourse: course,
                  Buy: courses,
                  newCourse: newCourse,
                });
              })
          });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getShowCourse = (req, res) => {
  Users.find({ user: req.user }).then(user => {

    SORT_ITEM = req.query.orderby;

  if (SORT_ITEM == -1) {
    sort_value = "Giá cao tới thấp";
    price = "-1";
  }
  if (SORT_ITEM == 1) {
    sort_value = "Giá thấp tới cao";
    price = "1";
  }
    const page = +req.query.page || 1;
    ChildCategory.findOne({ _id: req.params.id })
      .then(Child => {
        Course.find({ category: Child.name })
          .countDocuments()
          .sort({price:SORT_ITEM})
          .then(numCourse => {
            console.log(numCourse);
            totalItems = numCourse;
            return Course.find({ category: Child.name })
              .skip((page - 1) * 10)
              .limit(10)
              .sort({price:SORT_ITEM});
          })
          .then(course => {
            res.render("show-course-list", {
              user: req.user,
              currentPage: page,
              hasNextPage: 1 * page < totalItems,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: Math.ceil(totalItems / 1),
              user: req.user,
              courses: course,
              sort_value:sort_value,
            });
          });
      });
  })
    .catch(err => {
      console.log(err);
    });
};

exports.getSearchResult = (req, res) => {
  Users.find({ user: req.user }).then(user => {
    searchText = req.query.search !== undefined ? req.query.search : searchText;
    const page = +req.query.page || 1;
    SORT_ITEM = req.query.orderby;
    
    if (typeof(SORT_ITEM)==='undefined')
    {
      SORT_ITEM=1;
    }
    if (SORT_ITEM == -1) {
      sort_value = "Giá cao tới thấp";
      price = "-1";
    }
    if (SORT_ITEM == 1) {
      sort_value = "Giá thấp tới cao";
      price = "1";
    }
    Course.find({ $text: { $search: searchText } })
      .countDocuments()
      .sort({price:SORT_ITEM})
      .then(numCourse => {
        totalItems = numCourse;
        return Course.find({
          $text: { $search: searchText }
        })
          .skip((page - 1) * 10)
          .limit(10)
          .sort({price:SORT_ITEM});
      })
      .then(course => {
        res.render("show-course-list", {
          user: req.user,
          searchT: searchText,
          currentPage: page,
          hasNextPage: 1 * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / 1),
          user: req.user,
          courses: course,
          sort_value:sort_value,
        });
      });
  })
    .catch(err => {
      console.log(err);
    });
};


exports.getAddWishList = (req, res) => {
  const message = req.flash("error")[0];
  console.log(typeof(req.user));
  if (typeof(req.user) !=='undefined'){
    Users.findOneAndUpdate([{_id:req.user._id},{wish_list:{$in:req.params.id}}]).populate('wish_list').exec((err,user)=>{
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
    });
    Users.findOneAndUpdate([{_id:req.user._id},{wish_list:{$ne:req.params.id}}],{$push:{wish_list:req.params.id}}).populate('wish_list').exec((err,user)=>{
      Users.findOne({ _id: req.user._id }).populate('wish_list')
      .exec((err, user) => {
        if (err) throw err;
        if (req.user.role == 0) {
          res.render("wish-list", {
            title: "Wish List",
            user: req.user,
            message: `${message}`,
            courses: user,
          });
        }
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
      })
    })
  }
  else{
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
    });
  }
};

exports.getShowWishList = (req, res) => {
  const message = req.flash("error")[0];
  Users.findOne({ _id: req.user._id }).populate('wish_list')
    .exec((err, user) => {
      if (err) throw err;
      if (req.user.role == 0) {
        res.render("wish-list", {
          title: "Wish List",
          user: req.user,
          message: `${message}`,
          courses: user,
        });
      }
      res.render("404", {
        title: "404 Not Found",
        message: `${message}`,
        user: req.user,
      });
    })
};

exports.getDeleteWishList = (req, res) => {
  const message = req.flash("error")[0];

  Users.findOneAndUpdate({ _id: req.user._id }, { $pull: { wish_list: req.params.id } }, function (err, course) {
    Users.findOne({ _id: req.user._id }).populate('wish_list')
    .exec((err, user) => {
      if (err) throw err;
      if (req.user.role == 0) {
        res.render("wish-list", {
          title: "Wish List",
          user: req.user,
          message: `${message}`,
          courses: user,
        });
      }
      res.render("404", {
        title: "404 Not Found",
        message: `${message}`,
        user: req.user,
      });
    });
  }).catch(err => {
    console.log(err);
  });
};

exports.getShowMyCourse = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.findOne({ _id: req.user._id}).populate('courses')
      .exec((err, user) => {
        res.render("course-list", {
          title: "My Course",
          message: `${message}`,
          user: req.user,
          courses: user.courses,
        });
  })
}
exports.getAddMyCourse=(req,res,next)=>{
  const message = req.flash("error")[0];
  if (typeof(req.user) !=='undefined'){
    Users.findOneAndUpdate([{_id:req.user._id},{courses:{$in:req.params.id}}]).populate('courses').exec((err,user)=>{
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
    });
    Users.findOneAndUpdate([{_id:req.user._id},{courses:{$ne:req.params.id}}],{$push:{courses:req.params.id}}).populate('courses').exec((err,user)=>{
      var datetime = new Date();
      console.log(datetime);
      Course.findOneAndUpdate({_id:req.params.id},{$push:{dateBuy:datetime}},function(err,course)
      {
        console.log("update");
      });
      Users.findOne({ _id: req.user._id }).populate('courses')
      .exec((err, user) => {
        if (err) throw err;
        if (req.user.role == 0) {
          res.render("course-list", {
            title: "My Course",
            message: `${message}`,
            user: req.user,
            courses: user.courses,
          });
        }
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
      })
    })
  }
  else{
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
    });
  }
}

exports.getUserStudy = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user }).then(user => {
    Course.findOne({ _id: req.params.id }).populate([{ path: 'chapter', populate: { path: 'lesson' } }])
      .exec((err, course) => {
        res.render("user-study", {
          title: "User Study",
          message: `${message}`,
          user: req.user,
          section: +req.params.section,
          lesson: +req.params.lesson,
          courses: course,
        });
      });
  })
    .catch(err => {
      console.log(err);
    });
}

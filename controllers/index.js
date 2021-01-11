const Users = require('../models/user');
const Course = require('../models/Course');
const ChildCategory = require('../models/ChildCategory');


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
    const page = +req.query.page || 1;
    ChildCategory.findOne({ _id: req.params.id })
      .then(Child => {
        Course.find({ category: Child.name })
          .countDocuments()
          .then(numCourse => {
            console.log(numCourse);
            totalItems = numCourse;
            return Course.find({ category: Child.name })
              .skip((page - 1) * 1)
              .limit(1);
          })
          .then(course => {
            console.log(course);
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
    Course.find({ $text: { $search: searchText } })
      .countDocuments()
      .then(numCourse => {
        totalItems = numCourse;
        return Course.find({
          $text: { $search: searchText }
        })
          .skip((page - 1) * 1)
          .limit(1);
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
        });
      });
  })
    .catch(err => {
      console.log(err);
    });
};


exports.getAddWishList = (req, res) => {
  const message = req.flash("error")[0];

  Users.findOneAndUpdate({ _id: req.user._id }, { $push: { wish_list: req.params.id } }, function (err, course) {
    if (req.user.role == 0) {
      res.render("wish-list", {
        title: "Wish List",
        user: req.user,
        message: `${message}`,
        // courses:course,
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
    if (req.user.role == 0) {
      console.log(course);
      res.render("wish-list", {
        title: "Wish List",
        user: req.user,
        message: `${message}`,
        courses: course,
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

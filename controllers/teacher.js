const Users = require("../models/user");
const Course = require("../models/Course");
const ChildCategory = require("../models/ChildCategory");
const Chapter = require("../models/Chapter");
const Lesson = require("../models/Lesson");
const course = require("../middlewares/course");

exports.getAddCourse = (req, res) => {
  const message = req.flash("error")[0];
  Users.findOne({ user: req.user }).then((user) => {
    ChildCategory.find({}).then((child) => {
      if (req.user.role == 2 || req.user.role == 1) {
        res.render("add-course", {
          title: "Add Course",
          message: `${message}`,
          user: req.user,
          category: child,
        });
      }
      res.render("404", {
        title: "404 Not Found",
        message: `${message}`,
        user: req.user,
      });
    });
  });
};

exports.postAddCourse = (req, res, next) => {
  Course.findOne({ name: req.body.name }, function (err, course) {
    if (course) {
      req.flash("error", "username is existed");
      return res.redirect("/add-course");
    }
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var category = req.body.category;

    var success = req.file.filename + " uploaded successfully";
    console.log(success);
    var course = new Course({
      image: req.file.filename,
      category: category,
      name: name,
      price: price,
      description: description,
      teacher: req.user.username,
    });
    course.save(function (err, doc) {
      if (err) throw err;
      var category = req.body.category;
      ChildCategory.findOneAndUpdate(
        { name: category },
        { $push: { courses: course._id } },
        function (err) {
          if (err) res.redirect("/");
        }
      );
      Users.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { courses: course._id } },
        function (err) {
          if (err) res.redirect("/");
        }
      );

      res.redirect("/add-course");
    });
  });
};

exports.getCourseList = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.findOne({ _id: req.user._id })
    .populate("courses")
    .exec((err, user) => {
      if (req.user.role == 1) {
        res.render("course-list", {
          title: "Course List",
          message: `${message}`,
          user: req.user,
          course: user.courses,
        });
      } else if (req.user.role == 2) {
        res.render("course-list", {
          title: "Course List",
          message: `${message}`,
          user: req.user,
          course: user.courses,
        });
      } else {
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
      }
    });
};

exports.getCourseDetail = (req, res) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user })
    .then((user) => {
      Course.update(
        { _id: req.params.id },
        { $inc: { countView: 1 } },
        function (err, course) {}
      );
      Course.findOne({ _id: req.params.id })
        .populate([{ path: "chapter", populate: { path: "lesson" } }])
        .exec((err, course) => {
          Course.find({category:course.category})
          .limit(5)
          .sort({countBuy:-1}).then(courseBuy=>{
           Users.findOne({username:course.teacher},function(err,teacher){
            res.render("course-detail", {
              title: "Course Detail",
              message: `${message}`,
              user: req.user,
              courses: course,
              courseList:courseBuy,
              teacher:teacher,
            });
           })
          })
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddChapter = (req, res) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user })
    .then((user) => {
      Course.findOne({ _id: req.params.id }).then((course) => {
        if (req.user.role == 2 || req.user.role == 1) {
          res.render("add-chapter", {
            title: "Add Chapter",
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
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddChapter = (req, res, next) => {
  console.log(req.params.id);
  var name = req.body.name;

  var chapter = new Chapter({
    name: name,
  });
  chapter.save(function (err, doc) {
    if (err) throw err;
    Course.findOneAndUpdate(
      [{ _id: req.params.id }, { chapter: { $ne: chapter.id } }],
      { $push: { chapter: chapter._id } },
      function (err, course) {
        if (err) res.redirect("/course-list");
        res.redirect("/course-list");
      }
    );
  });
};

exports.getAddLesson = (req, res) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user })
    .then((user) => {
      Chapter.findOne({ _id: req.params.id }, {}).then((chapter) => {
        if (req.user.role == 2 || req.user.role == 1) {
          res.render("add-lesson", {
            title: "Add Lesson",
            user: req.user,
            message: `${message}`,
            chapter: chapter,
          });
        }
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddLesson = (req, res, next) => {
  var name = req.body.name;

  var lesson = new Lesson({
    name: name,
    video: req.file.filename,
  });
  lesson.save(function (err, doc) {
    if (err) throw err;
    Chapter.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { lesson: lesson._id } },
      function (err, chapter) {
        if (err) res.redirect("/course-list");
        res.redirect("/course-list");
      }
    );
  });
};

exports.postUpdateDescription = (req, res, next) => {
  const message = req.flash("error")[0];
  if (typeof req.user !== "undefined") {
    console.log(req.user);

    if (req.user.role === 1 || req.user.role === 2) {
      Course.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { description: req.body.description } },
        function (err) {
          Course.findOne({ _id: req.params.id })
            .populate([{ path: "chapter", populate: { path: "lesson" } }])
            .exec((err, course) => {
              res.render("course-detail", {
                title: "Course Detail",
                message: `${message}`,
                user: req.user,
                courses: course,
              });
            });
        }
      );
    } else {
      res.render("404", {
        title: "404 Not Found",
        message: `${message}`,
        user: req.user,
      });
    }
  } else {
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  }
};

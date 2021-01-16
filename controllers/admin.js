const Users = require("../models/user");
const passport = require("passport");
var bcrypt = require("bcryptjs");
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const ParentCategory = require("../models/ParentCategory");
const ChildCategory = require("../models/ChildCategory");
const Coureses = require ("../models/Course");
const {Mongoose} = require("mongoose");
const Courses = require("../models/Course");

exports.getAddTeacher = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({
    user: req.user
  }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-teacher", {
        title: "Add Teacher",
        message: `${message}`,
        user: req.user,
      });
    }
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  });
};

exports.postAddTeacher = (req, res, next) => {
  Users.findOne({
    username: req.body.username
  }, function (err, user) {
    if (user) {
      req.flash("error", "username is existed");
      return res.redirect("/add-teacher");
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(req.body.email).toLowerCase())) {
      req.flash("error", "email is existed");
      return res.redirect("/add-teacher");
    }
    Users.findOne({
      email: req.body.email
    }, (err, user) => {
      if (user) {
        req.flash("error", "email is existed");
        return res.redirect("/add-teacher");
      }
    });
    var password = randomstring.generate({
      length: 8,
    });
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nlpthuy137@gmail.com",
        pass: "Thuy13705#",
      },
    });

    var mainOptions = {
      from: "Crepp so gud",
      to: req.body.email,
      subject: "Mật khẩu đăng ký tài khoản trên Academy",
      text: "text ne",
      html: "<p>Chúc mừng bạn đã trở thành giảng viên của Academy Online. Hãy đăng nhập và đổi mật khẩu ngay. Mật khẩu của bạn là:</p>" +
        password,
    };
    transporter.sendMail(mainOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:" + info.response);
      }
    });
    console.log(password);
    bcrypt.hash(password, 12).then((hashPassword) => {
      const newUser = new Users({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
        role: 1,
        isAuthenticated: true,
      });
      // save the user
      newUser.save(function (err) {
        if (err) return res.redirect("/add-teacher");
        return res.redirect("/");
      });
    });
  });
};

exports.getAddStudent = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({
    user: req.user
  }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-student", {
        title: "Add Student",
        message: `${message}`,
        user: req.user,
      });
    }
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  });
};

exports.getTeacherList = (req, res, next) => {
  const message = req.flash("error")[0];
  var userList;
  Users.find({
    user: req.user
  }).then((user) => {
    Users.find({
      role: 1
    }).then((userList) => {
      if (req.user.role == 2) {
        res.render("teacher-list", {
          title: "Teacher List",
          message: `${message}`,
          user: req.user,
          userList: userList,
        });
      } else {
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
      }
    });
  });
};

exports.getUpdateTeacher = (req, res, next) => {
  Users.findById(req.params.id).exec((err, userTeacher) => {
    if (err) throw console.log(err);
    else {
      res.render("info-change", {
        title: "Info Change",
        editUser: userTeacher,
        user: req.user,
      });
    }
  });
};


exports.postUpdateTeacher = (req, res, next) => {

  Users.findByIdAndUpdate(req.params.id, {
    $set: {
      username: req.body.username,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber
    }
  }, function (err, userTeacher) {
    res.redirect('/teacher-list')
  })
}

exports.getDeleteTeacher = (req, res, next) => {
  Users.find({user: req.user}).then((user) => {
    if (req.user.role == 2) {
      Users.deleteOne({_id: req.params.id}, function (err, delData) {
        res.redirect("/teacher-list");
      });
    }
  });
};


exports.getStudentList = (req, res, next) => {
  const message = req.flash("error")[0];
  var userList;
  Users.find({
    role: 0
  }).then((user) => {
    studentList = user;
  });
  Users.find({
    user: req.user
  }).then((user) => {
    if (req.user.role == 2) {
      res.render("student-list", {
        title: "Student List",
        message: `${message}`,
        user: req.user,
      });
    }
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  });
};

exports.getAddChildCategory = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({
    user: req.user
  }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-child-category", {
        title: "Add Child Category",
        message: `${message}`,
        user: req.user,
      });
    }
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  });
};

exports.postAddChildCategory = (req, res, next) => {
  ChildCategory.findOne({
    name: req.body.name
  }, function (err, child) {
    if (child) {
      req.flash("error", "username is existed");
      return res.redirect("/add-child-category");
    }
    const newCategory = new ChildCategory({
      name: req.body.name,
      category:req.body.category,
    });
    // save the user
    newCategory.save(function (err) {
      if (err) return res.redirect("/");
      var category = req.body.category;
      ParentCategory.findOneAndUpdate({
          name: category
        }, {
          $push: {
            child: newCategory._id
          }
        },
        function (err) {
          if (err) res.redirect("/");
        }
      );

      return res.redirect("/category-list");
    });
  });
};

exports.getUpdateChildCategory = (req, res, next) => {
  ChildCategory.updateOne({
      _id: new Mongoose.Types.ObjectId(req.params.id)
    }, {
      name: req.body.name
    },
    (err) => {
      if (err) {
        req.flash("err");
      }
      res.redirect("/category-list");
    }
  );
};

exports.postUpdateChildCategory = (req, res, next) => {
   ChildCategory.findById(req.params.id,function(err,child){
    Courses.updateMany({category:child.name}, {$set: {category: req.body.name}}, function (err, course) {
      console.log(course);
      ChildCategory.findByIdAndUpdate(req.params.id,{$set: {name: req.body.name}},function(err){    
        res.redirect('/category-list');
    })
  })
  })
};


exports.getDeleteChildCategory = (req, res, next) => {
  ChildCategory.findById(req.params.id, function (err, child) {
    console.log(child);
    if (err) {
      console.log(err);
    } else {
      if (child.courses.length === 0) {
  
        ParentCategory.findOneAndUpdate({name: child.category},
              {$pull: {child: req.params.id}}, function(err){
            if(err) res.redirect("/");
            else {
              ChildCategory.deleteOne({_id: req.params.id},function(err){
                if (err) {
                  console.log(err);
                }
               else{
                res.redirect("/category-list");
               }
              });
            }
          })
      
      }
      else {
        res.redirect("/category-list");
      }
    }
  })
};

exports.getAddParentCategory = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({
    user: req.user
  }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-parent-category", {
        title: "Add Parent Category",
        message: `${message}`,
        user: req.user,
      });
    }
    res.render("404", {
      title: "404 Not Found",
      message: `${message}`,
      user: req.user,
    });
  });
};

exports.postAddParentCategory = (req, res, next) => {
  ParentCategory.findOne({
    name: req.body.name
  }, function (err, parent) {
    if (parent) {
      req.flash("error", "username is existed");
      return res.redirect("/add-parent-category");
    }
    const newCategory = new ParentCategory({
      name: req.body.name,
    });
    // save the user
    newCategory.save(function (err) {
      if (err) return res.redirect("/");
      return res.redirect("/add-parent-category");
    });
  });
};


exports.postUpdateParentCategory = (req, res, next) => {
  ParentCategory.findById(req.params.id,function(err,parent){
    ChildCategory.updateMany({category:parent.name}, {$set: {category: req.body.name}}, function (err, child) {
      ParentCategory.findByIdAndUpdate(req.params.id,{$set: {name: req.body.name}},function(err){    
        res.redirect('/category-list');
    })
  })
  })
};

exports.getDeleteParentCategory = (req, res, next) => {
  ParentCategory.findById(req.params.id, function (err, parent) {

    console.log(parent.child.length);
    if (err) {
      console.log(err);
    } else {
      if (parent.child.length === 0) {
        ParentCategory.deleteOne({_id: req.params.id},function(err){
          if (err) {
            console.log(err);
          }
         else{
          res.redirect("/category-list");
         }
        });
      }
      else {
        res.redirect("/category-list");
      }
    }
  })
};



exports.postAddStudent = (req, res, next) => {
  Users.findOne({
    username: req.body.username
  }, function (err, user) {
    if (user) {
      req.flash("error", "username is existed");
      return res.redirect("/add-student");
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(req.body.email).toLowerCase())) {
      req.flash("error", "email is existed");
      return res.redirect("/add-student");
    }
    Users.findOne({
      email: req.body.email
    }, (err, user) => {
      if (user) {
        req.flash("error", "email is existed");
        return res.redirect("/add-student");
      }
    });
    var password = randomstring.generate({
      length: 8,
    });
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nlpthuy137@gmail.com",
        pass: "Thuy13705#",
      },
    });

    var mainOptions = {
      from: "Crepp so gud",
      to: req.body.email,
      subject: "Mật khẩu đăng ký tài khoản trên Academy",
      text: "text ne",
      html: "<p>Chúc mừng bạn đã trở thành giảng viên của Academy Online. Hãy đăng nhập và đổi mật khẩu ngay. Mật khẩu của bạn là:</p>" +
        password,
    };
    transporter.sendMail(mainOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:" + info.response);
      }
    });
    console.log(password);
    bcrypt.hash(password, 12).then((hashPassword) => {
      const newUser = new Users({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
        role: 0,
        isAuthenticated: true,
      });
      // save the user
      newUser.save(function (err) {
        if (err) return res.redirect("/add-course");
        return res.redirect("/");
      });
    });
  });
};

exports.getCategoryList = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({
    user: req.user
  }).then((user) => {
    if (req.user.role == 2) {
      res.render("category-list", {
        title: "Category List",
        message: `${message}`,
        user: req.user,
      });
    }
    else{
      res.render("404", {
        title: "404 Not Found",
        message: `${message}`,
        user: req.user,
      });
    }
  });
};
const Users = require("../models/user");
const passport = require("passport");
var bcrypt = require("bcryptjs");
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const ParentCategory = require("../models/ParentCategory");
const ChildCategory = require("../models/ChildCategory");
const { Mongoose } = require("mongoose");
const Course = require('../models/Course');

exports.getAddTeacher = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-teacher", {
        title: "Add Teacher",
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

exports.postAddTeacher = (req, res, next) => {
  Users.findOne({ username: req.body.username }, function (err, user) {
    if (user) {
      req.flash("error", "username is existed");
      return res.redirect("/add-teacher");
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(req.body.email).toLowerCase())) {
      req.flash("error", "email is existed");
      return res.redirect("/add-teacher");
    }
    Users.findOne({ email: req.body.email }, (err, user) => {
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
      html:
        "<p>Chúc mừng bạn đã trở thành giảng viên của Academy Online. Hãy đăng nhập và đổi mật khẩu ngay. Mật khẩu của bạn là:</p>" +
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
  Users.find({ user: req.user }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-student", {
        title: "Add Student",
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

exports.getTeacherList = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user }).then((user) => {
    Users.find({ role: 1 }).then((userList) => {
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
  // Users.updateOne({
  //     _id: new Mongoose.Types.ObjectId(req.params.id)},
  //     {firstName: req.body.firstName},
  //     {lastName: req.body.lastName},
  //     {email: req.body.email},
  //     {address: req.body.address},
  //     {phoneNumber: req.body.phoneNumber},
  //     (err) =>{
  //     if(err){
  //       req.flash('error','Fail');
  //     }
  //     req.redirect('/teacher-list');
  //   })

  Users.findById(req.params.id).exec((err, userTeacher) => {
    if (err) throw console.log(err);
    else {
      if (req.user.role == 2) {
        res.render("info-change", {
          title: "Info Change",
          editUser: userTeacher,
          user:req.user,
        });
      }
      else{
        res.render("404", {
          title: "404 Not Found",
          message: `${message}`,
          user: req.user,
        });
      }
    }
  });
};

exports.getDeleteTeacher = (req, res, next) => {
  Users.find({ user: req.user }).then((user) => {
    if (req.user.role == 2) {
      Users.remove({ _id: req.params.id }, function (err, delData) {
        res.redirect("/teacher-list");
      });
    }
  });
};

// exports.getDeleteTeacher = (req, res, next) => {
//   Users.find({ user: req.user }).then(user => {
//     if (req.user.role==2){
//       Users.remove({ _id: req.params.id }, function (err, delData) {
//         res.redirect("/teacher-list");
//       });
//     }
//     res.render("404", {
//       title: "404 Not Found",
//       message: `${message}`,
//       user: req.user,
//     });
//   });
// };

exports.deleteTeacher = (req, res, next) => {
  Users.deleteOne(
    { _id: new Mongoose.Types.ObjectId(req.params.id) },
    (err) => {
      if (err) {
        req.flash("err", "Fail");
      }
      res.redirect("/teacher-list");
    }
  );
};

exports.getStudentList = (req, res, next) => {
  const message = req.flash("error")[0];
  var userList;
  Users.find({ role: 0 }).then((user) => {
    studentList = user;
  });
  Users.find({ user: req.user }).then((user) => {
    if (req.user.role == 2) {
      res.render("student-list", {
        title: "Student List",
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

exports.getAddChildCategory = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-child-category", {
        title: "Add Child Category",
        message: `${message}`,
        user: req.user,
      });
    }else{
      res.render("404", {
        title: "404 Not Found",
        message: `${message}`,
        user: req.user,
      });
    }
  });
};

exports.postAddChildCategory = (req, res, next) => {
  ChildCategory.findOne({ name: req.body.name }, function (err, child) {
    if (child) {
      req.flash("error", "username is existed");
      return res.redirect("/add-child-category");
    }
    const newCategory = new ChildCategory({
      name: req.body.name,
    });
    // save the user
    newCategory.save(function (err) {
      if (err) return res.redirect("/");
      var category = req.body.category;
      ParentCategory.findOneAndUpdate(
        { name: category },
        { $push: { child: newCategory._id } },
        function (err) {
          if (err) res.redirect("/");
        }
      );

      return res.redirect("/add-child-category");
    });
  });
};

exports.updateChildCategory = (req, res, next) => {
  ChildCategory.updateOne(
    { _id: new Mongoose.Types.ObjectId(req.params.id) },
    { name: req.body.name },
    (err) => {
      if (err) {
        req.flash("err");
      }
      res.redirect("/category-list");
    }
  );
};

exports.deleteChildCategory = (req, res, next) => {
  ChildCategory.deleteOne(
    { _id: new Mongoose.Types.ObjectId(req.params.id) },
    (err) => {
      if (err) {
        req.flash("err");
      }
      res.redirect("/category-list");
    }
  );
};

exports.getAddParentCategory = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user }).then((user) => {
    if (req.user.role == 2) {
      res.render("add-parent-category", {
        title: "Add Parent Category",
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

exports.postAddParentCategory = (req, res, next) => {
  ParentCategory.findOne({ name: req.body.name }, function (err, parent) {
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

exports.updateParentCategory = (req, res, next) => {
  ParentCategory.updateOne(
    {
      _id: new Mongoose.Types.ObjectId(req.params.id),
    },
    { name: req.body.name },
    (err) => {
      6;
      if (err) {
        req.flash("error", "Fail");
      }
      req.redirect("/category-list");
    }
  );
};

exports.deletePatentCategory = (req, res, next) => {
  ParentCategory.deleteOne(
    { _id: new Mongoose.Types.ObjectId(req.params.id) },
    (err) => {
      if (err) {
        req.flash("err", "Fail");
      }
      res.redirect("/category-list");
    }
  );
};

exports.postAddStudent = (req, res, next) => {
  Users.findOne({ username: req.body.username }, function (err, user) {
    if (user) {
      req.flash("error", "username is existed");
      return res.redirect("/add-student");
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(req.body.email).toLowerCase())) {
      req.flash("error", "email is existed");
      return res.redirect("/add-student");
    }
    Users.findOne({ email: req.body.email }, (err, user) => {
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
      html:
        "<p>Chúc mừng bạn đã trở thành giảng viên của Academy Online. Hãy đăng nhập và đổi mật khẩu ngay. Mật khẩu của bạn là:</p>" +
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
  Users.find({ user: req.user }).then((user) => {
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

exports.getLockUser=(req,res,next)=>{
  if (req.user.role == 2) {
    Users.findById(req.params.id,function(err,user){
      if (user.isLock==true){
        Users.findByIdAndUpdate(req.params.id,{$set:{isLock:false}}, function(err,user1){
          if (err) console.log(err)
          else{
            res.redirect("back");
          }
        });
      }
      else{
        Users.findByIdAndUpdate(req.params.id,{$set:{isLock:true}}, function(err,user1){
          if (err) console.log(err)
          else{
            res.redirect("back");
          }
        });
      }
    });
  }
  else{
    res.render("404", {
      title: "404 Not Found",
      user: req.user,
    });
  }
};

exports.getLockCourse=(req,res,next)=>{
  if (req.user.role == 2) {
    Course.findById(req.params.id,function(err,course){
      if (course.disable==true){
        Course.findByIdAndUpdate(req.params.id,{$set:{disable:false}}, function(err,courses){
          if (err) console.log(err)
          else{
            res.redirect("back");
          }
        });
      }
      else{
        Course.findByIdAndUpdate(req.params.id,{$set:{disable:true}}, function(err,courses){
          if (err) console.log(err)
          else{
            res.redirect("back");
          }
        });
      }
    });
  }
  else{
    res.render("404", {
      title: "404 Not Found",
      user: req.user,
    });
  }
};
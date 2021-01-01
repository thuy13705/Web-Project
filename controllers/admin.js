const Users = require('../models/user');
const passport = require("passport");
var bcrypt = require('bcryptjs');
var randomstring = require("randomstring");

exports.getAddTeacher = (req, res, next) => {
  const message = req.flash("error")[0];
  Users.find({ user: req.user }).then(user => {
    res.render("add-teacher", {
      title: "Add Teacher",
      message: `${message}`,
      user: req.user,
    });
  });
}

exports.postAddTeacher = (req, res, next) => {
  Users.findOne({ username: req.body.username }, function (err, user) {

    if (user) {
      req.flash("error", "username is existed");
      return res.redirect("/add-teacher");
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(req.body.email).toLowerCase())) {
      req.flash("error", "username is existed");
      return res.redirect("/add-teacher");
    }
    Users.findOne({ email: req.body.email }, (err, user) => {
      if (user) {
        req.flash("error", "email is existed");
        return res.redirect("/add-teacher");
      }
    });
    var password = randomstring.generate({
      length: 8
    });
    console.log(password);
    bcrypt.hash(password, 12).then(hashPassword => {
      const newUser = new Users({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
        role: 1,
        isAuthenticated: true
      });
      // save the user
      newUser.save(function (err) {
        if (err) return res.redirect("/add-teacher");;
        return res.redirect("/");;
      });
    });
  });
};

exports.getTeacherList = (req, res, next) => {
  const message = req.flash("error")[0];
  var userList;
  Users.find({ role: 1 }).then(user => {
    userList = user;
  })
  Users.find({ user: req.user }).then(user => {
    res.render("teacher-list", {
      title: "Teacher List",
      message: `${message}`,
      user: req.user,
      userList: userList
    });
  });
}

exports.getDeleteTeacher = (req, res, next) => {
  Users.deleteOne({ user: req.session.user }, function (err, res) {
    if (err) throw err;
    res.redirect("/teacher-list");
  });
};





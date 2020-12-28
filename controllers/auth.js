const passport = require("passport");
const Users = require("../controllers/user");
var bcrypt = require("bcryptjs");
var randomstring = require("randomstring");
const User = require('../models/user');
const nodemailer=require('nodemailer')

exports.getLogin = (req, res, next) => {
  const message = req.flash("error")[0];
  // if (!req.isAuthenticated()) {
  //   res.render("signin", {
  //     title: "Đăng nhập",
  //     message: `${message}`,
  //     user: req.user,
  //   });
  // } else {
  //   res.redirect("/");
  // }
      res.render("signin", {
      title: "Đăng nhập",
      message: `${message}`,
      user: req.user,
    });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local-signin", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true
  })(req, res, next);
};

exports.getLogout = (req, res, next) => {
  if (req.session.user) {
    req.session.user = null;
  }
  req.logout();
  res.redirect("/");
};

exports.getSignUp = (req, res, next) => {
  const message = req.flash("error")[0];
  // if (!req.isAuthenticated()) {
  //   res.render("signup", {
  //     title: "Đăng ký",
  //     message: `${message}`,
  //     user: req.user,
  //   });
  // } else {
  //   res.redirect("/");
  // }
    res.render("signup", {
      title: "Đăng ký",
      message: `${message}`,
      user: req.user,
    });
};

exports.postSignUp = (req, res, next) => {
  passport.authenticate("local-signup", {
    successReturnToOrRedirect: "/verify-email",
    failureRedirect: "/signup",
    failureFlash: true
  })(req, res, next);
};

exports.getVerifyEmail = (req, res, next) => {
 const message = req.flash("error")[0];
 var transporter = nodemailer.createTransport({
  service: "Gmail",
    auth: {
      user: "nlpthuy137@gmail.com",
      pass: "Thuy13705#"
   }
    // sendMail:true,
    // newline:'windows',
    // logger:false
  }); 
  User.findOne({ username: req.user.username }).then(user => {
    var verification_token = randomstring.generate({
      length: 10
    });
    var mainOptions = {
      from: "Academy Online",
      to: req.user.email,
      subject: "Xác nhận mật khẩu",
      html:
        "<p>Cảm ơn đã đăng kí tài khoản của Academy Online. Mã kích hoạt của bạn là:</p>" +
        verification_token
    };
    transporter.sendMail(mainOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:" + info.response);
      }
    });
    user.verify_token = verification_token;
    user.save();
  });
  res.render("verify-email", {
    title: "Xác thực email",
    message: `${message}`,
    user: req.user
  });
};

exports.postVerifyEmail = (req, res, next) => {
  const token = req.body.token;
  User.findOne({ username: req.user.username }, (err, user) => {
    if (token == user.verify_token) {
      user.isAuthenticated = true;
      user.save();
      return res.redirect("/");
    } else if (token != user.verify_token) {
      req.flash("error", "Mã xác thực không hợp lệ");
      return res.redirect("/verify-email");
    }
  });
};

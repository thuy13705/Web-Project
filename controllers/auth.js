const passport = require("passport");
const Users = require("../controllers/user");
var bcrypt = require("bcryptjs");
var randomstring = require("randomstring");
const User = require('../models/user');
const nodemailer=require('nodemailer')

exports.getLogin = (req, res, next) => {
  const message = req.flash("error")[0];
  if (!req.isAuthenticated()) {
    res.render("signin", {
      title: "Sign In",
      message: `${message}`,
      user: req.user,
    });
  } else {
    res.redirect("/");
  }
    //   res.render("signin", {
    //   title: "Đăng nhập",
    //   message: `${message}`,
    //   user: req.user,
    // });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local-signin", {
    successReturnToOrRedirect: "/info",
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
  if (!req.isAuthenticated()) {
    res.render("signup", {
      title: "Sign Up",
      message: `${message}`,
      user: req.user,
    });
  } else {
    res.redirect("/");
  }
    // res.render("signup", {
    //   title: "Đăng ký",
    //   message: `${message}`,
    //   user: req.user,
    // });
};

exports.postSignUp = (req, res, next) => {
  passport.authenticate("local-signup", {
    successReturnToOrRedirect: "/verify-email",
    failureRedirect: "/signup",
    failureFlash: true
  })(req, res, next);
};


exports.getVerifyEmail = (req, res, next) => {
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "nlpthuy137@gmail.com",
      pass: "Thuy13705#"
    }
  });
  User.findOne({ username: req.user.username }).then(user => {
    var verification_token = randomstring.generate({
      length: 10
    });
    var mainOptions = {
      from: "Crepp so gud",
      to: req.user.email,
      subject: "Test",
      text: "text ne",
      html:
        "<p>Cảm ơn đã đăng kí tài khoản của Bros shop. Mã kích hoạt của bạn là:</p>" +
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

  const message = req.flash("error")[0];
  
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
      return res.redirect("/signin");
    } else if (token != user.verify_token) {
      req.flash("error", "Mã xác thực không hợp lệ");
      return res.redirect("/verify-email");
    }
  });
};

exports.getForgotPass = (req, res, next) => {
  const message = req.flash("error")[0];

  res.render("forgot-password", {
    title: "Quên mật khẩu",
    message: `${message}`,
    user: req.user
  });
};

exports.postForgotPass = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email }, (err, user) => {
    if (!user) {
      req.flash("error", "Email không hợp lệ");
      return res.redirect("/forgot-password");
    } else {
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "nlpthuy137@gmail.com",
          pass: "Thuy13705#"
        }
      });
      var tpass = randomstring.generate({
        length: 6
      });
      var mainOptions = {
        from: "Crepp so gud",
        to: email,
        subject: "Test",
        text: "text ne",
        html: "<p>Mật khẩu mới của bạn là:</p>" + tpass
      };
      transporter.sendMail(mainOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Sent:" + info.response);
        }
      });
      bcrypt.hash(tpass, 12).then(hashPassword => {
        user.password = hashPassword;
        user.save();
      });

      res.redirect("/signin");
    }
  });
};


exports.getChangePassword = (req, res, next) => {
  const message = req.flash("error")[0];
  res.render("password-change", {
    title: "Đổi mật khẩu",
    message: `${message}`,
    user: req.user,
  });
};

exports.postChangePassword = (req, res, next) => {
  bcrypt.compare(req.body.oldpass, req.user.password, function(err, result) {
    console.log("alo?");
    if (!result) {
      req.flash("error", "Mật khẩu cũ không đúng!");
      return res.redirect("back");
    } else if (req.body.newpass != req.body.newpass2) {
      console.log(req.body.newpass);
      console.log(req.body.newpass2);
      req.flash("error", "Nhập lại mật khẩu không khớp!");
      return res.redirect("back");
    } else {
      bcrypt.hash(req.body.newpass, 12).then(hashPassword => {
        req.user.password = hashPassword;
        req.user.save();
      });
      req.flash("success", "Đổi mật khẩu thành công!");
      res.redirect("/info");
    }
  });
};

exports.getFacebook=(req,res,next)=>{
  passport.authenticate('facebook', {scope: ['email']});
};

exports.getFacebookCallback=(req,res,next)=>{
  passport.authenticate('facebook', {
    successRedirect: '/info',
    failureRedirect: '/'
})};


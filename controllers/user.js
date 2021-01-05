const Users = require("../models/user");

exports.getAccount = (req, res, next) => {

  const messageSucc = req.flash("success")[0];
  const messageError = req.flash("error")[0];
  Users.find({ user: req.user }).then(user => {
    res.render("info", {
      title: "Information Account",
      user: req.user,
      messageSucc: messageSucc,
      messageError:messageError
    });
  });
};

exports.getAccountChange = (req, res, next) => {
  res.render("info-change", {
    title: "Change Information Account",
    user: req.user,
  });
};

exports.postAccountChange = (req, res, next) => {
  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;
  req.user.email = req.body.email;
  req.user.address = req.body.address;
  req.user.phoneNumber = req.body.phoneNumber;
  req.user.save();
  res.redirect("/info");
};

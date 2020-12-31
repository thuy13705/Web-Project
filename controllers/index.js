const Users = require('../models/user');

exports.getHomeView = (req, res) => {
  Users.find({ user: req.user }).then(user => {
    res.render("index", {
      title: "HomePage",
      user: req.user,
    });
  });
};


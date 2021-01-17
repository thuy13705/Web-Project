const Course = require("../models/Course");
const Feedback = require("../models/Feedback");


exports.postNewFeedback = (req, res) => {
  Course.findById(req.params.id, function (err, course) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      const feedback = new Feedback({
        writer: req.user._id,
        content: req.body.feedback,
        rating: req.body.rating,
      });
      feedback.save(function (err) {
        if (err) return res.redirect("/");
        Course.findByIdAndUpdate(
          req.params.id ,
          { $push: { feedback: feedback._id } },
          function (err, course) {
            if (err) res.redirect("/");
            res.redirect("back");
          }
        );
      });
    }
  });
};

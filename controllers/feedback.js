const Course = require('../models/Course');
const Feedback = require('../models/Feedback');

exports.getNewFeedback = (req, res) => {
    //find courseId
    Course.findById(req.params.is, function (err, course) {
        if (err) {
            console.log(err);
        } else {
            res.render("show-course", {
                course: course
            });
        }
    });
}

exports.postNewFeedback = (req, res) => {
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            res.redirect("/course");
        } else{
            Feedback.create(req.body.feedback, function(err, feedback){
                if(err){
                    req.flash("err");
                    console.log(err);

                }else{
                    feedback.author.id = req.user._id;
                    feedback.author.username = req.user.username;
                    feedback.save();
                    course.feedbacks.push(feedback);
                    req.flash("success");
                }
            })
        }
    })
}
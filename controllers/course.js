const Users = require('../models/user');
const Course=require('../models/Course');
const ChildCategory=require('../models/ChildCategory');
const Feedback = require('../models/Feedback');



exports.getShowCourse= (req, res) => {
  Users.find({ user: req.user }).then(user => {
    ChildCategory.findOne({_id:req.params._id})
    .then(Child => {
      Course.find({category:Child.name})
         .then(course=>{
          res.render("show-course-list", {
            title: "Show Course List",
            user: req.user,
            courses:course,
          });
         })
        });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.feedback = (req, res) =>{
    const courseID = req.params.id;
    const userID = req.params.id;
    const content = req.body.content;
    const rating =  parseInt(req.body.rating);

    console.log(req.user);

    const newFeedback = new Feedback({write: userID, content: content, ratin: rating});
    newFeedback.save()
    .then(feedback => {
      Course.findOneAndUpdate({_id: courseID}, {$push: { feedback: feedback._id}}, (error, success) => {
        if (!error)
          res.redirect('/course-detail/' + courseID);
    });
    })
    .catch(err => {
        console.log("Error: ", err);
        throw err;
    })
}

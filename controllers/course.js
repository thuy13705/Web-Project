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

// exports.getShowCourse = (req, res) => {
// 	const page = (typeof req.query.page != 'undefined') ? parseInt(req.query.page) : 1;
// 	const commentsPerPage = 3;

// 	// Find the product that matches ID and increase views by 1
// 	Course.findOneAndUpdate({ _id: req.params.id }, { $inc: { 'views': 1 } }, { new: true, useFindAndModify: false })
// 		.then(course => {
// 			Comment.countDocuments({ courseID: course._id }) // Count all comments that match product ID
// 				.then(countAll => {
// 					Comment.find({ courseID: course._id })
// 						.limit(commentsPerPage).skip((page - 1) * commentsPerPage) // Pagination
// 						.then(comments => {
// 							Course.find({ producer: product.producer }) // Find related products
// 								.then(relatedProducts => {
// 									res.render("show-course-list", {
// 										user: req.user,
// 										courses: course,
// 										views: course.views + 1, // Actual views will increase later
										
// 										// Comments
// 										comments: comments,
// 										// Creating page index
// 										countPages: parseInt(countAll / commentsPerPage +
// 											((countAll % commentsPerPage == 0) ? 0 : 1)),
// 										page: page,
// 										i: 1,
// 										// Related products
// 										products: relatedProducts
// 									});
// 								})
// 								.catch(err => {
// 									console.log('Error: ', err);
// 									throw err;
// 								});
// 						})
// 						.catch(err => {
// 							console.log('Error: ', err);
// 							throw err;
// 						});
// 				})
// 				.catch(err => {
// 					console.log('Error: ', err);
// 					throw err;
// 				});
// 		})
// 		.catch(err => {
// 			console.log('Error: ', err);
// 			throw err;
// 		});
// }


exports.feedback = (req, res) =>{
    const courseID = req.params.id;
    const userID = req.params.id;
    const content = req.body.content;
    const rating =  req.body.rating;
    const newFeedback = new Feedback({courseID, userID, content, rating});
    newFeedback.save()
    .then(feedback => {
        res.redirect('/course/'+ req.params.id);
    })
    .catch(err => {
        console.log("Error: ", err);
        throw err;
    })
}

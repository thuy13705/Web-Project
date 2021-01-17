const express = require('express');
const router = express.Router();
const homeController = require('../controllers/index');
const courseController = require('../controllers/course');
const feedbackController = require('../controllers/feedback');

router.get('/', homeController.getHomeView);


router.get('/show-course-list/:id', homeController.getShowCourse);
router.get('/show-course-list', homeController.getSearchResult);
router.get('/account/add-wish-list/:id', homeController.getAddWishList);
router.get('/account/wish-list', homeController.getShowWishList);
router.get('/my-course', homeController.getShowMyCourse);
router.get('/account/my-course/:id', homeController.getAddMyCourse);

router.get('/account/wish-list/delete/:id', homeController.getDeleteWishList);
router.get('/user-study/:id/:section/:lesson', homeController.getUserStudy);
router.get('/404',homeController.getError);
router.post('/course/feedback/:id', feedbackController.postNewFeedback);
// router.get('/course/add-feedback/:id', feedbackController.getNewFeedback);

module.exports = router;

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/index');

router.get('/', homeController.getHomeView);

router.get('/show-course-list/:id', homeController.getShowCourse);
router.get('/show-course-list', homeController.getSearchResult);
router.get('/account/wish-list/:id',homeController.getAddWishList);
router.get('/account/wish-list',homeController.getShowWishList);


module.exports = router;

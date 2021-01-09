const express = require('express');
const router = express.Router();
const homeController = require('../controllers/index');

router.get('/', homeController.getHomeView);

router.get('/show-course-list/:id', homeController.getShowCourse);
router.get('/show-course-list', homeController.getSearchResult);

module.exports = router;

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/index');

router.get('/', homeController.getHomeView);

router.get('/show-course-list/:_id', homeController.getShowCourse);
module.exports = router;

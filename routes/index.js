const express = require('express');
const router = express.Router();
const homeController = require('../controllers/index');
const courseController = require('../controllers/course');

router.get('/', homeController.getHomeView);

router.get('/show-course-list/:id', courseController.getShowCourse);

router.post('/course/feedback/:id', courseController.feedback);
module.exports = router;

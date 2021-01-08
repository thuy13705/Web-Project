var express = require("express");
var router = express.Router();
const teacherController = require("../controllers/teacher");
const multer = require('multer');
const upload = multer({ dest: 'videos/' });

router.get('/add-course', teacherController.getAddCourse);
router.post('/add-course', teacherController.postAddCourse);
router.get('/course-list', teacherController.getCourseList);
router.get('/course-detail/:id', teacherController.getCourseDetail);
router.get('/add-chapter/:id', teacherController.getAddChapter);
router.post('/add-chapter/:id', teacherController.postAddChapter);
router.get('/add-lesson/:id', teacherController.getAddLesson);
router.post('/add-lesson/:id', upload.single("video"), teacherController.postAddLesson);

module.exports = router;
var express = require("express");
var router = express.Router();
const teacherController = require("../controllers/teacher");

router.get('/add-course', teacherController.getAddCourse);
// router.post('/add-teacher',adminController.postAddTeacher);
// router.get('/teacher-list',adminController.getTeacherList);
// router.get('/teacher-list',adminController.getDeleteTeacher);
// router.get('/add-course',adminController.getAddCourse);
router.post('/add-course',teacherController.postAddCourse);
router.get('/course-list',teacherController.getCourseList);
// router.get('/student-list',adminController.getStudentList);
module.exports = router;
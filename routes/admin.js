var express = require("express");
var router = express.Router();
const userController = require("../controllers/user");
const adminController = require("../controllers/admin");

router.get('/add-teacher', adminController.getAddTeacher);
router.post('/add-teacher',adminController.postAddTeacher);
router.get('/teacher-list',adminController.getTeacherList);
router.get('/teacher-list',adminController.getDeleteTeacher);
// router.get('/add-course',adminController.getAddCourse);
// router.post('/add-course',adminController.postAddCourse);
// router.get('/course-list',adminController.getCourseList);
// router.get('/student-list',adminController.getStudentList);
module.exports = router;
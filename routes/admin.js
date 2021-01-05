var express = require("express");
var router = express.Router();
const teacherController = require("../controllers/teacher");
const adminController = require("../controllers/admin");

router.get('/add-teacher', adminController.getAddTeacher);
router.post('/add-teacher',adminController.postAddTeacher);
router.get('/teacher-list',adminController.getTeacherList);

router.get('/teacher-list/delete/:id', adminController.getDeleteTeacher);
router.get('/add-course',teacherController.getAddCourse);
router.post('/add-course',teacherController.postAddCourse);
router.get('/course-list',teacherController.getCourseList);
router.get('/student-list',adminController.getStudentList);
router.get('/add-student', adminController.getAddStudent);
router.post('/add-student',adminController.postAddStudent);

module.exports = router;
var express = require("express");
var router = express.Router();
const teacherController = require("../controllers/teacher");
const adminController = require("../controllers/admin");

router.get('/add-teacher', adminController.getAddTeacher);
router.post('/add-teacher',adminController.postAddTeacher);
router.get('/teacher-list',adminController.getTeacherList);
router.get('/teacher-list/delete/:id', adminController.getDeleteTeacher);
router.get('/teacher-list/update/:id', adminController.getUpdateTeacher);
router.get('/teacher-list/update/:id', adminController.getUpdateTeacher);

router.get('/add-course',teacherController.getAddCourse);
router.post('/add-course',teacherController.postAddCourse);
router.get('/course-list',teacherController.getCourseList);

router.get('/student-list',adminController.getStudentList);
router.get('/add-student', adminController.getAddStudent);
router.post('/add-student',adminController.postAddStudent);



router.get('/add-parent-category', adminController.getAddParentCategory);
router.post('/add-parent-category', adminController.postAddParentCategory);
router.get('/category-list/deleteParent/:id', adminController.getDeleteParentCategory);
router.post('/category-list/updateParent/:id', adminController.postUpdateParentCategory);

router.get('/add-child-category', adminController.getAddChildCategory);
router.post('/add-child-category', adminController.postAddChildCategory);
router.get('/category-list/deleteChild/:id', adminController.getDeleteChildCategory);
router.post('/category-list/updateChild/:id', adminController.postUpdateChildCategory);

router.get('/category-list',adminController.getCategoryList);
router.get('/lock-user/:id', adminController.getLockUser);
router.get('/lock-course/:id', adminController.getLockCourse);


module.exports = router;
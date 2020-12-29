var express = require("express");
var router = express.Router();
var passport = require("../config/passport");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");

router.get("/signin", authController.getLogin);

router.post("/signin", authController.postLogin);

router.get("/logout", authController.getLogout);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.get("/info", userController.getAccount);

router.get("/info-change", userController.getAccountChange);

router.post("/info-change", userController.postAccountChange);

router.get("/verify-email", authController.getVerifyEmail);

router.post("/verify-email", authController.postVerifyEmail);

router.get("/forgot-password", authController.getForgotPass);

router.post("/forgot-password", authController.postForgotPass);

router.get("/password-change", authController.getChangePassword);

router.post("/password-change", authController.postChangePassword);

router.get('/facebook', authController.getFacebook);

router.get('/facebook/callback',authController.getFacebookCallback);

module.exports = router;
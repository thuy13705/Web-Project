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

router.get("/account", userController.getAccount);

router.get("/account-change-info", userController.getAccountChange);

router.post("/account-change-info", userController.postAccountChange);

router.get("/verify-email", authController.getVerifyEmail);

router.post("/verify-email", authController.postVerifyEmail);

module.exports = router;
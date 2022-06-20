const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const userCntrl = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.use(bodyParser.urlencoded({extended: false}));


router.get("/", (req, res) => {
    res.send("Hello World!!");
})

router.get("/login", (req, res) => {
    res.render("login");
})

router.post("/login", userCntrl.userLogin)

router.get("/signup", (req, res) => {
    res.render("signup");
})

router.post("/signup", userCntrl.userAdd)

router.get("/profile", (req, res) =>{
    res.render("profile");
})

router.get("/forget-password", (req, res) => {
    res.render("forget-password");
})

router.post("/forget-password", userCntrl.forgetPassword);

router.get("/reset-password/:id/:token", userCntrl.resetPasswordGet)

router.post("/reset-password/:id/:token", userCntrl.resetPasswordPost);


module.exports = router;
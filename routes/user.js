const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const userCntrl = require("../controllers/userController");
const jwt = require("jsonwebtoken");

router.use(bodyParser.urlencoded({extended: false}));

var jwtAuth = (req, res, next) => {
    var token = req.headers.authorization;
    token = token.split(" ")[1];
    jwt.verify(token, process.env.SECRETKEY, function(err, decoded){
        if(err){
            res.send({message: "Invalid Token"});
        }else{
            next();
        }
    })
}

router.get("/", (req, res) => {
    res.render("login");
})

router.get("/login", (req, res) => {
    res.render("login");
})

router.post("/login", userCntrl.userLogin)

router.get("/Signup", (req, res) => {
    res.render("signup");
})

router.post("/Signup", userCntrl.userAdd)

router.get("/profile", (req, res) =>{
    res.render("profile");
})

router.get("/emailsend", (req, res) => {
    res.render("reset");
})

router.get("/list", jwtAuth, userCntrl.userList);

router.post("/emailsend", userCntrl.emailSend);

router.get("/resetpassword", (req, res) => {
    res.render("passwordchange");
})

router.post("/resetpassword", userCntrl.resetPassword);


module.exports = router;
const User = require("../models/user");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// register new user
const userAdd = async (req, res, next) => {
    let {name,phone,email,password} = req.body;
    let data = new User({name,phone,email,password});
    let response = data.save();
    let myToken = await data.getAuthToken();
    res.redirect("/login");
    console.log("User register sucessfully!!");
}


// login route
const userLogin = async (req, res, next) => {
    const username = req.body.email;
    const password = req.body.password;
    
    if(!username || !password){
        res.status(301).json({message: "Please write your email id/ password!!"});
    }

    let user = await User.findOne({username});
    if(user.email === username){
        var match = await bcrypt.compare(password, user.password);
        if(match){
            res.render("profile", {data: user});
            let myToken = user.getAuthToken();
            console.log("Login Sucessfull!");
        }else{
           console.log("Invalid Password!");
        }
    }else{
        console.log("Invalid EmailId!");
    }
}


// forget password
const forgetPassword = async (req, res, next) => {
    const {email} = req.body;
    let user = await User.findOne({email: email});
    if(user.email !== email){
        res.send("User not registered!");
        return;
    }

    const secret = process.env.SECRETKEY + user.password;
    const payload = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(payload, secret, {expiresIn: "15m"});
    const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
    mailer(email, link);
    res.send("Reset password link has send to your email id");
}


// reset password

const resetPasswordGet = async(req, res, next) => {
    const {id, token} = req.params;
    let user = await User.findOne({_id: id});
    
    // check if this id exist in the database
    if(id !== user.id){
        res.send("Invalid id!");
        return;
    }

    // We have a valid user id 
    const secret = process.env.SECRETKEY + user.password;
    try {
        const payload = jwt.verify(token, secret);
        res.render("reset-password", {id: req.params.id, token: req.params.token});
        next();
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
}


const resetPasswordPost = async(req, res, next) => {
    
    const {id, token} = req.params;
    const {password, password2} = req.body;

    let user = await User.findOne({_id:id});
    // check if this id exist in the database
    if(id !== user.id){
        res.send("Invalid id");
        return;
    }
    const secret = process.env.SECRETKEY + user.password;
    try {
        const payload = jwt.verify(token, secret);
        //verify the password & password2
         //we can simply find the user with payload email and id  and then update their password.
         if(password !== password2){
            res.send("confirm password didn't match with password!");
            return;
         } 

         user.password = password;
         user.save();
         res.redirect("/login");
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
}


// mailer who send link to the mail
const mailer = (email, link) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.PASSWORD // generated ethereal password
        },
      }); 

      var mailOptions = {
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "Reset password", // Subject line
        text: link // plain text body
      }

      transporter.sendMail(mailOptions, function(err, info){
            if(err){
               console.log(err);
            }else{
                console.log("Email sent: " + info.response);
            }
      });
}

module.exports = {
    userAdd,
    userLogin,
    forgetPassword,
    resetPasswordGet,
    resetPasswordPost
};
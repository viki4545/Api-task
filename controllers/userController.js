const User = require("../models/user");
const Otp = require("../models/otp");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const userList = async (req, res) => {
    let data = await User.find();
    res.json(data);
}

const userAdd = async (req, res) => {
    let {name,phone,email,password} = req.body;
    let data = new User({name,phone,email,password});
    let response = data.save();
    let myToken = await data.getAuthToken();
    res.status(200).json({message: "ok",token:myToken});
}

const userLogin = async (req, res) => {
    const username = req.body.email;
    const password = req.body.password;
    
    if(!username || !password){
        res.status(301).json({message: "Please write your email id/ password!!"});
    }

    let user = await User.findOne({username});
    console.log(user.email);
    console.log(username);
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
    res.status(200);
}

const emailSend = async (req, res, err) => {
    let data = await User.findOne({email: req.body.email});
    if(data){
        let otpCode = Math.floor(Math.random()*10000+1);
        let otpData = new Otp({
            email: req.body.email,
            code: otpCode,
            expireIn: new Date().getTime() + 300*1000
        });
        let otpResponse = await otpData.save();
        mailer(req.body.email,otpCode);
        console.log(req.body.email);
        res.redirect("/resetpassword");
        
    }else{
        console.log("Email Id did not exist!");
    }
    res.status(200);
}

const resetPassword = async (req, res) => {
    let data = await Otp.find({email:req.body.email,code:req.body.otpCode});
    if(data){
        let currentTime = new Date().getTime();
        let diff = data.expireIn - currentTime;
        if(diff < 0){
            console.log("Token expire");
        }else{
            let user = await User.findOne({email: req.body.email});
            console.log(user.email);
            user.password = req.body.password;
            user.save();
            console.log("Password changed sucessfully!");
        }
    }else{
        console.log("Invalid Otp!");
    }
    res.status(200);
}

const mailer = (email, otp) => {

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
        subject: "Sending Email using Node.js", // Subject line
        text: "Thank you sir !" // plain text body
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
    userList,
    userAdd,
    userLogin,
    emailSend,
    resetPassword
};
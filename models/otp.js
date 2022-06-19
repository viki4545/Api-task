const mongoose = require("mongoose");
const conn = require("../config/db");

const otpSchema = new mongoose.Schema({
    email: String,
    code: String,
    expireIn: Number
},
{
    timestamps: true
});

let otp = conn.model("otp", otpSchema, "otp");

module.exports = otp;
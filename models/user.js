const mongoose = require("mongoose");
const conn = require("../config/db");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: {
        type: String,
        select: true
    },
    tokens:[
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
},
{
    timestamps: true
});

userSchema.pre("save", function(next){
    var saltRounds = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

userSchema.methods.getAuthToken = async function(data){
    let params = {
        id:this._id,
        email:this.email,
        phone:this.phone
    }
    var tokenValue = jwt.sign(params, process.env.SECRETKEY, {expiresIn: "300000s"});
    this.tokens = this.tokens.concat({token:tokenValue});
    // this.save();
    return tokenValue;
};

const user = conn.model("users", userSchema);
module.exports = user;

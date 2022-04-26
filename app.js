//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema
({
    email: String,
    password: String
});

const secret="ayusisthesexiest";
userSchema.plugin(encrypt, { secret: process.env.secret,encryptedFields:['password'] });


const User = new mongoose.model("User", userSchema)



app.get("/", function (req, res) {
    res.render("home");
});

app.route("/login")

.get(function (req, res) {
    res.render("login");
})
.post(function(req,res)
{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,founduser)
    {

        if(err)
        {
            console.log(err);
        }
        else
        {
            if(founduser)
            {
            if(founduser.password===password)
            {
                res.render("secrets");
            }
        }
        }
    })
})



app.get("/register", function (req, res) {
    res.render("register");
})


app.post("/register", function (req, res) {
    const newUser = new User
        (
            {
                email: req.body.username,
                password: req.body.password

            }
        );
        newUser.save(function(err)
        {
            if(!err)
            {
            res.render("secrets");
            console.log(newUser);
            }
            else{
                console.log(err);
            }
        })
        
})


app.post





app.listen(3000, function () {
    console.log("server running");
})
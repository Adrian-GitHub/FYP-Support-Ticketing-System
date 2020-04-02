const express = require("express");
const router = express.Router();
// MongoDB
var MongoClient = require('../../database/config/DatabaseConnection');
var connection = MongoClient.getDb();
const keys = require("../../database/config/MongoDB");
// Hashing
const crypto = require('crypto');
// Authentication
const jwt = require('jsonwebtoken');
//Login route
function hashPassword(password, salt){
    return hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512', (err, key) => {
                   if (err)
                       throw err;
               }).toString('hex')
}
router.post("/Login", (req, res) => { // Form validation
   const username = req.body.username;
   const password = req.body.password;
       //first find the salt that was used to generate user's password
       connection.collection("users").findOne({username: username}).then(user => {
           if(user)//if user exists
           {   
               //Hash the password using the salt obtained from the DB
               let hashedPwd = hashPassword(password, user.salt);
               //Verify the password if the given one matches the provided one
               if(hashedPwd === user.password){
                   // Generate and assign JSON Web Token
                   const token = jwt.sign({_id: user._id, authed: new Date().getTime(), username: username }, keys.secretOrKey);
                   res.set('Auth-Token', token);
                   //User authenticated successfully, notify
                   //Set the token into httpOnly cookie
                   //httpOnly cookie is not accessible via JS
                   res.cookie('authenticated_user', token , { expires: new Date(Date.now() + 3600000), httpOnly: true })
                   res.cookie('privilaged_user', user.isWho , { expires: new Date(Date.now() + 3600000), httpOnly: true })
                   // A normal cookie, containing userID
                   res.cookie('user_id', user._id);
                   res.cookie('name', user.name);
                   res.cookie('username', username);
                   //Notify the user
                   res.json({ status: "Authed_" + user.isWho });
               }
               else res.json({status: "Not_Authed"});
           }
           else 
           {
               res.json({status: "Not_Authed"});
           }
       });
});
//Logout user
router.post("/Logout", (req, res) => {
    //Clearing all cookies created by us
    res.clearCookie("authenticated_user");
    res.clearCookie("username");
    res.clearCookie("name");
    res.clearCookie("user_id");
    res.json({status: "success"})
});
module.exports = router;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create User Account Schema
const User_Account = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    salt: {
        type: String,
        required: true
    },
    isWho: {
        type: String,
        required: true
    }
});
module.exports = User = mongoose.model("user", User_Account);

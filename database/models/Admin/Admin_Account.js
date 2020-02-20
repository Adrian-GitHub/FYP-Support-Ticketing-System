const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Admin_Account Schema
const Admin_Account = new Schema({
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
        default: "admin"
    }
});
module.exports = Admin = mongoose.model("admin", Admin_Account);

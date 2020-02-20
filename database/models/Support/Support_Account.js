const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Support_Account Schema
const Support_Account = new Schema({
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
        default: "support"
      },
    staffId: {
        type: Number,
        required: true
      }
});
module.exports = Support = mongoose.model("support", Support_Account);
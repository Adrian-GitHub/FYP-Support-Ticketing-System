const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Client_Account Schema
const Client_Account = new Schema({
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
        default: "client"
      }
});
module.exports = Client = mongoose.model("client", Client_Account);
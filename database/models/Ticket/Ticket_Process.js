const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Ticket_Process Schema
const Ticket_Process = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    currentSupportStaff: {
        type: String,
        default: "free"
    },
    //status should be fixed here.
    stage: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    }
});
module.exports = Ticket = mongoose.model("ticket", Ticket_Process);

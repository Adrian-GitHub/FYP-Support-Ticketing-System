const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Ticket_Process Schema
const Ticket_History = new Schema({
    ticketID: {
        type: String,
        required: true
    },
    staffId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    staffName: {
        type: String,
        required: true
    }
});
module.exports = TicketH = mongoose.model("ticketHistory", Ticket_History);

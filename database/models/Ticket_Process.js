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
    // AKA staff name
    currentSupportStaff: {
        type: String,
        default: "free"
    },
    status: {
        // 1. Open Ticket 2. Open Ticket on Behalf 3. Allocation to Support 4. Self Allocate
        // 5. Check Ticket 6. Reallocate ticket 7. Solve Ticket 8. Reopen ticket 9. Suspend Ticket
        // 10. Add More Information, 11. Close Ticket, 12. Close Expired Ticket, 13. Cancel by Support
        // 14. Cancel by user 15. Cancel abandoned ticket
        type: Number,
        default: 0
    },
    staffId: {
        type: String,
        default: '0x0'
    },
});
module.exports = Ticket = mongoose.model("ticket", Ticket_Process);

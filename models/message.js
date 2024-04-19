const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    message: String,
    dateSent: String,
    responded: {
        type: String,
        enum: ["yes", "no"],
        default: "no"
    }
});

const contactMessageModel = mongoose.model('Messages', contactMessageSchema)

module.exports = contactMessageModel
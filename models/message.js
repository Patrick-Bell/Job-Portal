const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    message: String,
})

const contactMessageModel = mongoose.model('Messages', contactMessageSchema)

module.exports = contactMessageModel
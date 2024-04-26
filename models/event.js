const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id: String,
    email: String,
});

const eventModel = mongoose.model('Event', eventSchema);

module.exports = eventModel;

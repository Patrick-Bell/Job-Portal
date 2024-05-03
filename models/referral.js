const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    id: String,
    userName: String,
    userEmail: String,
    referralName: String,
    referralEmail: String,
    referralNumber: {
        type: String, // Use lowercase 'type' here
    },
    datePosted: {
        type: Date, // Define the type for datePosted field
        default: Date.now // Set default value to current date/time
    }
});

const referralModel = mongoose.model('Referral', referralSchema);

module.exports = referralModel;

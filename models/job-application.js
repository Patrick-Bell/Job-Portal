const mongoose = require('mongoose')

const jobApplicationSchema = new mongoose.Schema({
    dateApplied: {
        type: Date,
    },
    name: {
        type: String,
    },
    email: {
        type: String
    },
    cvFile: {
        type: String,
    },
    number: {
        type: Number,
    },
    coverLetter: {
        type: String,
    },
    linkedin: {
        type: String
    }
   
})

const jobApplicationModel = mongoose.model('Applicant', jobApplicationSchema)

module.exports = jobApplicationModel
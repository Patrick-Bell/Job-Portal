const mongoose = require('mongoose')

const jobListingSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    jobId: {
        type: String,
    },
    datePosted: {
        type: Date,
    },
    jobTitle: {
        type: String,
    },
    jobType: {
        type: String
    },
    salary: {
        type: Number,
    },
    dayRate: {
        type: Number,
    },
    higherSalary: {
        type: Number
    },
    higherRate: {
        type: Number
    },
    ir35Status: {
        type: String,
    },
    location: {
        type: String,
    },
    workSchedule: {
        type: String,
    },
    jobDescription: {
        type: String,
    },
    skills: {
        type: String,
    },
    benefits: {
        type: String,
    },
    deadline: {
        type: Date
    },
    status: {
        type: String,
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }] // Reference corrected
})

const jobListModel = mongoose.model('JobList', jobListingSchema)

module.exports = jobListModel
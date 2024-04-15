const fs = require('fs');
const PDFDocument = require('pdfkit');
const JobListModel = require('./models/job-list');
const path = require('path');

// Function to generate PDF report and trigger download
const generatePDFReport = async () => {
    try {
        // Make a request to fetch job data
        const jobs = await JobListModel.find();

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set title
        doc.fontSize(20).text('Job Report', { align: 'center' });

        // Add job details
        jobs.forEach(job => {
            doc.text('Job Title: ' + job.jobTitle)
               .text('Location: ' + job.location)
               .text('Salary: ' + job.salary)
               .text('Application Deadline: ' + job.deadline)
               .moveDown(); // Add some space between jobs
        });

        // Finalize PDF
        doc.end();

        // Define the file path for saving the PDF
        const filePath = path.join(__dirname, 'job_report.pdf');

        // Save the PDF to the file system
        doc.pipe(fs.createWriteStream(filePath));

        // Notify when PDF generation is complete
        doc.on('end', () => {
            console.log('PDF generation complete.');
        });

        return filePath; // Return the file path for sending the response
    } catch (error) {
        console.error('Error generating PDF report:', error);
        throw error; // Rethrow the error for handling in the route handler
    }
};

module.exports = { generatePDFReport };

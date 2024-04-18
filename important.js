const JobListModel = require('./models/job-list')
const referralModel = require('./models/referral')
const ReferralModel = require('./models/referral')
const MessageModel = require('./models/message')
const nodemailer = require('nodemailer')

// add a new message email - coming soon...

const newApplicantEmail = async (newJobApplication) => {
    try {
        // Extract information about the new referral
        const { jobId, name, email, number, linkedin } = newJobApplication;

        const today = new Date();
        const formattedDate = today.toLocaleDateString(); // Specify the locale

        
        // Compose the email message
        const emailMessage = `
        <p>A new application has been submitted for job number <strong>${jobId}</strong></p>
        <ul>Applicant Details</ul> 
        <li>Name: ${name}</li>
        <li>Email: ${email}</li> 
        <li>Number: ${number}</li> 
        <li>LinkedIn Profile: ${linkedin}</li>    
        <p>To view the applicantand more details, please visit the <a href="/dashboard">dashboard</a></p>    
        `;

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.USER,
            to: process.env.USER,
            subject: `New Applicant - ${formattedDate}`,
            html: emailMessage,
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

const newReferralEmail = async (newReferral) => {
    try {
        // Extract information about the new referral
        const { userName, userEmail, referralName, referralEmail, referralNumber } = newReferral;

        const today = new Date();
        const formattedDate = today.toLocaleDateString(); // Specify the locale
        const oneYearLater = new Date(today); // Create a new date object for the next year
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1); // Add one year
        const formattedOneYear = oneYearLater.toLocaleDateString(); // Format the date

        
        // Compose the email message
        const emailMessage = `
            <p>Hello</p>
            <p>${userName} (${userEmail}) has submitted a referral.</p>
            <p>Referral details:</p>
            <ul>
                <li>Referral Name: ${referralName}</li>
                <li>Referral Email: ${referralEmail}</li>
                <li>Referral Number: ${referralNumber}</li>
                <li>Date Submitted: ${formattedDate}</li>
            </ul>
            <p>The validated period for this referral is between ${formattedDate} and ${formattedOneYear}</p>
        `;

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.USER,
            to: process.env.USER,
            subject: `New Refferal - ${formattedDate}`,
            html: emailMessage,
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



const dailyJobUpdate = async () => {
    try {
        const jobs = await JobListModel.find()
        const referrals = await referralModel.find()

        const totalJobs = jobs.filter(job => job.status === 'open').length
        const closedJobs = jobs.filter(job => job.status === 'closed').length
        const contractJobs = jobs.filter(job => job.jobType === 'Contract')
        const permJobs = jobs.filter(job => job.jobType === 'Permanent')

        const numContract = contractJobs.length;
        const numPerm = permJobs.length;

        let permTable = `<table border="1" style="width: 100%; text-align: center;"><tr><th>Name</th><th>Applicants</th><th>Date</th></tr>`;

            permJobs.forEach(perm => {
                const date = perm.datePosted;
                const formattedDate = new Date(date).toLocaleDateString();
                permTable += `<tr><td style="padding: 10px">${perm.jobTitle}</td><td>${(perm.applicants).length}</td><td>${formattedDate}</td></tr>`;
            });

            permTable += `</table>`;

            // Apply orange background to all th elements
            permTable = permTable.replace(/<th>/g, '<th style="background: orange; padding: 10px">');

            let contractTable = `<table border="1" style="width: 100%; text-align: center;"><tr><th>Name</th><th>Applicants</th><th>Date</th></tr>`;

            contractJobs.forEach(contract => {
                const date = contract.datePosted;
                const formattedDate = new Date(date).toLocaleDateString();
                contractTable += `<tr><td style="padding: 10px">${contract.jobTitle}</td><td>${(contract.applicants).length}</td><td>${formattedDate}</td></tr>`;
            });

            contractTable += `</table>`;

            // Apply orange background to all th elements
            contractTable = contractTable.replace(/<th>/g, '<th style="background: orange; padding: 10px">');

            const footer = `    
                <div style="background: orange; width: 100%; padding: 15px; text-align: center;">
                    <h3 style="margin-bottom: 10px; color: white;">Quick Links</h3>
                    <a style="display: block; color: white !important; margin-bottom: 5px; text-decoration: none;" href="#">Admin Dashboard</a>
                    <a style="display: block; color: white !important; margin-bottom: 5px; text-decoration: none;" href="#">User Dashboard</a>
                    <a style="display: block; color: white !important; margin-bottom: 5px; text-decoration: none;" href="#">Settings</a>
                    <a style="display: block; color: white !important; margin-bottom: 5px; text-decoration: none;" href="#">Help Center</a>
                    <a style="display: block; color: white !important; margin-bottom: 5px; text-decoration: none;" href="#">Contact Us</a>
                    <img style="background: transparent;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCSOPIxjdn73ILB4yiZaHDcS85zrQhMM_iTA&s"/>
                </div>`;


            const today = new Date()
            const formattedToday = new Date(today).toLocaleDateString()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        const emailContent = `This is a daily report that shows all the permanent and contract jobs that are currently open on the system. Currently,
        there are <strong>${totalJobs}</strong> open jobs. This consists of <strong>${numPerm}</strong> permanent jobs and 
        <strong>${numContract}</strong> contract jobs. Currently, there are <strong>${closedJobs}</strong> upcoming/closed jobs.<br>
        <h2>Permanent Job Summary</h2>
        ${permTable}<br>
        <h2>Contract Job Summary</h2>
        ${contractTable}<br>
        ${footer}`

        const weeklyReport = {
            from: process.env.USER,
            to: process.env.USER,
            subject: `Daily Job Report - ${formattedToday} - 09:00`,
            html: emailContent
        }

        transporter.sendMail(weeklyReport, (error, info) => {
            if (error) {
                console.error('Error sending mail', error)
            } else {
                console.log('Daily Reminder sent successfully')
            }
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = { dailyJobUpdate, newReferralEmail, newApplicantEmail } 
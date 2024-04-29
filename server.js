require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const upload = require('./middleware/upload')
const multer = require('multer')
const JobListModel = require('./models/job-list');
const JobApplicationModel = require('./models/job-application');
const ReferralModel = require('./models/referral')
const ContactMessageModel = require('./models/message')
const EventModel = require('./models/event')
const { dailyJobUpdate, newReferralEmail, newApplicantEmail, newMessageEmail, sendAppliacntEmail } = require('./email')
const cron = require('node-cron')
const axios = require('axios')
const nodemailer = require('nodemailer')



const app = express();

app.use(express.static(path.join(__dirname, 'public'))); // Corrected path joining
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))


const uri = process.env.MONGO_URI
mongoose.connect(uri)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))
db.once('open', () => {
    console.log('Connected to MongoDB')
})


app.get('/', (req, res) => {
    res.sendFile('/admin.html')
})

// Define a route to serve the application form page
app.get('/apply', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'application.html');
    res.sendFile(filePath);
});



// Get job details by ID
app.get('/api/joblist/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await JobListModel.findOne({ jobId }).populate('applicants');
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/messages', async (req, res) => {
    try{
        const messageList = await ContactMessageModel.find()
        res.status(200).json(messageList)
        
    }catch(error) {
        console.error(error)
        res.status(500).json({ error: 'internal server error'})
    }
})

app.get('/api/referrals', async (req, res) => {
    try {
        const referralList = await ReferralModel.find()
        res.status(200).json(referralList)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'internal server error'})
    }
})

app.get('/api/joblist', async (req, res) => {
    try {
        const jobList = await JobListModel.find().populate('applicants');
        res.status(200).json(jobList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/referral', async (req, res) => {
    try {
        const { id, userName, userEmail, referralName, referralEmail, referralNumber } = req.body
        const dateSubmitted = new Date()

        const newReferral = new ReferralModel({
            id,
            userName,
            userEmail,
            referralName,
            referralEmail,
            referralNumber,
            dateSubmitted,
        })

        const savedReferral = await newReferral.save()
        res.status(200).json(savedReferral)
        newReferralEmail(savedReferral)

    } catch(error) {
        console.log(error);
        res.status(500).json({ error: 'internal error'})
    }
})

app.post('/api/events', async (req, res) => {
    try{
        const { id, email } = req.body

        const newEvent = new EventModel({
            id,
            email,
        })

        const savedEvent = await newEvent.save()
        res.status(200).json(savedEvent)

    }catch(error) {
        console.log(error)
        res.status(500).json({ error: 'internal error'})
    }
})


app.post('/send-email', async (req, res) => {
    const { htmlContent } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        // Retrieve unique email addresses from the database
        const uniqueEmails = await EventModel.distinct('email');
        console.log('Unique Emails:', uniqueEmails);

        // Iterate over each unique email address and send an email
        for (const email of uniqueEmails) {
            // Customize the email content with Quill editor's HTML content
            const emailContent = `
                ${htmlContent}
                <br><br>
                Regards,
                Your Event Team
            `;

            // Create mailOptions for the current email recipient
            const mailOptions = {
                from: process.env.USER,
                to: email, // Set the recipient's email address
                subject: 'Quill Editor Content',
                html: emailContent
            };

            // Send email to the current recipient
            await transporter.sendMail(mailOptions);

            console.log(`Email sent successfully to ${email}`);
        }

        console.log('All emails sent successfully');
        res.json({ message: 'All emails sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});


app.post('/api/messages', async (req, res) => {
    try{
        const { id, name, email, message, responded } = req.body
        const dateSent = new Date()

        const newMessage = new ContactMessageModel({
            id,
            name,
            email,
            message,
            dateSent,
            responded,
        })

        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
        newMessageEmail(savedMessage)

    }catch(error) {
        console.error(error)
        res.status(500).json({ error: 'internal server error' })
    }
})

// Backend route to update the responded status of a message
app.put('/api/messages/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        const { responded } = req.body;

        // Update the message in the database
        await ContactMessageModel.findOneAndUpdate({ id: messageId }, { responded });

        res.status(200).json({ success: true, message: 'Message responded status updated' });
    } catch (error) {
        console.error('Error updating message responded status:', error);
        res.status(500).json({ success: false, message: 'Failed to update message responded status' });
    }
});


app.post('/api/submit-application', (req, res) => {
    // Handle file upload using multer middleware
    upload(req, res, async (err) => {
        try {
            // Check for multer errors
            if (err instanceof multer.MulterError) {
                console.error('Multer error:', err);
                return res.status(400).json({ error: 'File upload error' });
            } else if (err) {
                console.error('File upload error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Extract form data
            const { jobId, name, email, number, coverLetter, linkedin } = req.body;
            console.log('Request Body:', req.body);
            const dateApplied = new Date();
            const cvFile = req.file ? req.file.path : '';

            // Save job application to database
            const newJobApplication = new JobApplicationModel({
                jobId,
                name,
                email,
                number,
                coverLetter,
                dateApplied,
                cvFile,
                linkedin
            });

            const savedJobApplication = await newJobApplication.save();

            await JobListModel.findOneAndUpdate(
                { jobId: jobId },
                { $push: { applicants: savedJobApplication._id } },
                { new: true }
              );

            // Respond with the saved job application data
            res.status(200).json(savedJobApplication);
            console.log('New job application:', newJobApplication);
            newApplicantEmail(newJobApplication)
            sendAppliacntEmail(newJobApplication)
        } catch (error) {
            console.error('Error submitting application:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.post('/api/joblist', async (req, res) => {
    try {
        const { jobId, id, datePosted, jobTitle, jobType, salary, dayRate, higherSalary, higherRate, ir35Status, location, workSchedule, jobDescription, skills, benefits, deadline, status} = req.body

        const newJobListing = new JobListModel({
            jobId,
            id,
            datePosted,
            jobTitle,
            jobType,
            salary,
            dayRate,
            higherSalary,
            higherRate,
            ir35Status,
            location,
            workSchedule,
            jobDescription,
            skills,
            benefits,
            deadline,
            status
        })

        const savedJobListing = await newJobListing.save()
        res.status(200).json(savedJobListing)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'internal error'})
    }
})

app.put('/api/joblist/:id', async (req, res) => {
    const jobId = req.params.id;
    const updatedJobData = req.body
    try {       
        const updatedJob = await JobListModel.findOneAndUpdate(
            { jobId: jobId },
            { $set: updatedJobData },
            { new: true }
        )

        if(!updatedJob) {
            return res.status(404).json({ error: 'error editing product'})
        }

        res.status(200).json(updatedJob)
    }catch (error) {
        console.error(error)
        res.status(500).json({ error: 'error'})
    }
})

app.delete('/api/joblist/:id', async (req, res) => {
    const jobId = req.params.id;
    try {
        const result = await JobListModel.deleteOne({ jobId })
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'error finding job'})
        }
        return res.status(200).json({ message: 'job deleted successfully'})

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error deleting product'})
    }
})

app.delete('/api/messages/:id', async (req, res) => {
    const messageId = req.params.id;
    try{
        const result = await ContactMessageModel.deleteOne({ id: messageId })
        if(result.deletedCount === 0) {
            return res.status(404).json({ error: 'error' })
        }
        return res.status(200).json({ message: 'message deleted successfully' })

    }catch(error){
        console.error(error)
        return res.status(500).json({ error: 'internal message error'})
    }
})

app.delete('/api/referrals/:id', async (req, res) => {
    const referralId = req.params.id;
    try {
        const result = await ReferralModel.deleteOne({ id: referralId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'error deleting referral' });
        }
        return res.status(200).json({ message: 'referral deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error deleting referral' });
    }
});


cron.schedule('0 9 * * *', () => {
    dailyJobUpdate();
});

// Error handling middleware for Multer errors
app.use(function(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        res.status(400).json({ error: 'File upload error' });
    } else {
        next(err);
    }
});


app.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).send('File upload failed!');
        }
        console.log('File uploaded successfully:', req.file);
        res.status(200).send('File uploaded!');
    });
});


const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});

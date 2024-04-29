
const addJobBtn = document.getElementById('addJobBtn');
const jobModal = document.getElementById('jobModal');
const closeModalBtn = document.getElementById('close-btn')
const submitJobBtn = document.getElementById('submit-job-btn')

const contractChoice = document.getElementById('contract');
const permanentChoice = document.getElementById('permanent');
const ir35Container = document.querySelector('.ir35-container')
const permContainer = document.querySelector('.perm-container')

const editJobModal = document.getElementById('editModal')

const showAllButton = document.querySelector('.show-all')

addJobBtn.addEventListener("click", () => {
    jobModal.showModal();
});

closeModalBtn.addEventListener("click", () => {
    jobModal.close()
})


function checkJobType() {
    if (contractChoice.checked) {
        permContainer.style.display = "none"
        ir35Container.style.display = "block"
    } else if (permanentChoice.checked) {
        permContainer.style.display = "block"
        ir35Container.style.display = "none"
    } else {
        console.log('No job type selected');
    }
}

// Call checkJobType initially
checkJobType();

// Add event listeners to job type radio buttons
contractChoice.addEventListener('change', checkJobType);
permanentChoice.addEventListener('change', checkJobType);



function generateRandomId() {
    min = 1;
    max = 1000000

    const randomId = Math.floor(Math.random() * (max - min + 1) + min)

    return randomId.toString()
}


submitJobBtn.addEventListener("click", async () => {
    const jobTitle = document.getElementById('job-title').value
    const jobType = document.querySelector('input[name="jobType"]:checked').value;
    let salary = document.getElementById('salary').value
    const dayRate = document.getElementById('day-rate').value
    const ir35Status = document.querySelector('input[name="ir35Status"]:checked').value
    let location = document.getElementById('location').value
    const workSchedule = document.getElementById('work-schedule').value
    const jobDescription = document.getElementById('job-description').value
    const skills = document.getElementById('skills').value
    const benefits = document.getElementById('benefits').value
    const higherSalary = document.getElementById('max-salary').value
    const higherRate = document.getElementById('higher-day-rate').value
    const jobDeadline = document.getElementById('job-deadline').value
    const status = document.getElementById('status').value

    const jobListing = {
        id: generateRandomId(),
        jobId: generateRandomId(),
        datePosted: new Date(),
        jobTitle: jobTitle,
        jobType: jobType,
        salary: salary,
        higherSalary: higherSalary,
        dayRate: dayRate,
        higherRate: higherRate,
        ir35Status: ir35Status,
        location: location,
        workSchedule: workSchedule,
        jobDescription: jobDescription,
        skills: skills,
        benefits: benefits,
        deadline: jobDeadline,
        status: status
    }
    console.log(jobListing)

    try {
        const res = await axios.post('/api/joblist', jobListing)
        if (res.status === 200) {
            resetForm()
            fetchAndDisplayJobsTable()
            console.log('job saved success', jobListing)
        } else {
            console.error('failed to save job', res.status)
        }
    
    } catch (error) {
        console.error('error', error)
}})


function resetForm() {
    // Reset form fields
    document.getElementById('job-title').value = '';
    document.getElementById('salary').value = '';
    document.getElementById('day-rate').value = '';
    document.getElementById('location').value = '';
    document.getElementById('job-description').value = '';
    document.getElementById('skills').value = '';
    document.getElementById('benefits').value = '';
    document.getElementById('job-deadline').value = '';

    // Reset radio buttons to default state
    document.getElementById('permanent').checked = true;
    document.getElementById('n/a').checked = true;

    // Reset select dropdown to first option
    document.getElementById('work-schedule').selectedIndex = 0;

    // Reset containers' display properties
    permContainer.style.display = 'block';
    ir35Container.style.display = 'none';

    // Close modal
    jobModal.close();
}


// messages table
const messageTable = document.querySelector('#messageTable tbody')
let currentMessagePage = 1
const messagesPerPage = 3
let totalMessages = 0

const fetchAndDisplayMessageTable = async () => {
    try {
        const response = await axios.get('/api/messages');
        let messages = response.data;
        console.log(messages)

        const openMessages = messages.filter(message => message.responded === 'no')

        totalMessages = openMessages.length; // Corrected variable name


        // Calculate pagination values
        const startIndex = (currentMessagePage - 1) * messagesPerPage;
        const endIndex = Math.min(startIndex + messagesPerPage, totalMessages);
        const formattedMessages = messages.filter(message => message.responded === 'no')
        const paginatedMessages = formattedMessages.slice(startIndex, endIndex);


        // Clear the table before inserting new rows
        messageTable.innerHTML = '';

        paginatedMessages.forEach(message => {
            displayMessage(message);
        });

        updateMessagePaginationButtons()
        updateStatistics()

        const messageInfo = document.querySelector('.message-job-page-info')
        messageInfo.innerHTML = `Showing Messages <strong>${startIndex + 1}</strong> - <strong>${endIndex}</strong> | View all <a href="/messages">messages</a>`


    } catch (error) {
        console.error(error);
    }
};

const displayMessage = (message) => {
    const date = message.dateSent;
    const formattedDate = new Date(date).toLocaleDateString();
    const messageId = message.id;

    const row = messageTable.insertRow();

    const cell1 = row.insertCell(0);
    cell1.innerHTML = `${message.name} - ${message.email}`;

    const cell2 = row.insertCell(1);
    cell2.textContent = formattedDate;

    const cell3 = row.insertCell(2);
    cell3.textContent = message.message;

    const cell4 = row.insertCell(3);
    cell4.innerHTML = `<div class="action-row"><i class="fa-solid fa-trash"></i><i class="fa-solid fa-check"></i></div>`
    const trashButton = cell4.querySelector('.fa-trash')
    const checkButton = cell4.querySelector('.fa-check')

    // Add event listener for the check button
    checkButton.addEventListener("click", () => {
        respondedJob(row, messageId);
    });
    trashButton.addEventListener('click', () => {
        deleteMessage(row, messageId)
    })

    // Initialize Tippy tooltips for trash and check buttons
    tippy(trashButton, {
        content: "Click to <strong>delete</strong> message. This <strong>CANNOT</strong> be undone.",
        theme: 'delete', // Add your custom tooltip theme class
        allowHTML: true,
    });

    tippy(checkButton, {
        content: "Click to <strong>save</strong> message. This will remove the message from this table.",
        theme: 'save', // Add your custom tooltip theme class
        allowHTML: true,
    });
};

const deleteMessage = async (row, messageId) => {
    try{
        const response = await axios.delete(`/api/messages/${messageId}`)
        console.log('deleted', response.data)
        row.remove()

        updateMessagePaginationButtons()
        fetchAndDisplayMessageTable()
        updateStatistics()

    }catch(error){
        console.log(error)
    }
}



const updateMessagePaginationButtons = () => {
    const totalPages = Math.ceil(totalMessages / messagesPerPage);


    const prevButton = document.getElementById('message-prev-page-btn');
    const nextButton = document.getElementById('message-next-page-btn');

    prevButton.disabled = currentMessagePage === 1;
    nextButton.disabled = currentMessagePage === totalPages;

};


const respondedJob = async (row, messageId) => {
    try {
        const response = await axios.put(`/api/messages/${messageId}`, { responded: 'yes' });
        console.log('Message responded status updated:', response.data);

        row.remove()

        fetchAndDisplayMessageTable()
    } catch (error) {
        console.error('Error updating message responded status:', error);
    }

}


// end of message table code






/* referral table */

const referralTableBody = document.querySelector('#referral-table tbody');
// Pagination variables


let currentJobPage = 1;
const jobsPerPage = 5; // Adjust as needed
let totalJobs = 0; // Variable to store total number of jobs

// Pagination variables for referral table
let currentReferralsPage = 1;
const referralsPerPage = 3; // Adjust as needed
let totalReferrals = 0; // Variable to store total number of referrals



const fetchAndDisplayReferralTable = async () => {
    try {
        const response = await axios.get('/api/referrals');
        let referrals = response.data;
        console.log(referrals)

        totalReferrals = referrals.length; // Corrected variable name


        // Calculate pagination values
        const startIndex = (currentReferralsPage - 1) * referralsPerPage;
        const endIndex = Math.min(startIndex + referralsPerPage, totalReferrals);
        const paginatedReferrals = referrals.slice(startIndex, endIndex);


        // Clear the table before inserting new rows
        referralTableBody.innerHTML = '';

        paginatedReferrals.forEach(referral => {
            displayReferral(referral);
        });

        updateReferralPaginationButtons()
        updateStatistics()

        const referralInfo = document.querySelector('.referral-job-page-info')
        referralInfo.innerHTML = `Showing Referrals <strong>${startIndex + 1}</strong> - <strong>${endIndex}</strong>`


    } catch (error) {
        console.error(error);
    }
};

const displayReferral = (referral) => {
    const datePosted = new Date(referral.datePosted);
    const formattedDatePosted = datePosted.toLocaleDateString();
    const referralId = referral.id

    const oneYearLater = new Date(datePosted);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const formattedOneYearLater = oneYearLater.toLocaleDateString();

    const row = referralTableBody.insertRow();

    const cell1 = row.insertCell(0);
    cell1.innerHTML = `${referral.userName}<br>${referral.userEmail}`

    const cell2 = row.insertCell(1);
    cell2.innerHTML = `${referral.referralName}<br>${referral.referralEmail}<br>${referral.referralNumber}`

    const cell3 = row.insertCell(2);
    cell3.innerHTML = `${formattedOneYearLater}`;

    const cell4 = row.insertCell(3)
    cell4.innerHTML = `<div class="action-row"><i class="fa-solid fa-trash"></i></div>`
    const deleteBtn = cell4.querySelector('.fa-trash')
    deleteBtn.addEventListener("click", () => {
        deleteReferral(referralId, row)
    })

    tippy(deleteBtn, {
        content: "Click to <strong>delete</strong> message. This <strong>CANNOT</strong> be undone.",
        theme: 'delete', // Add your custom tooltip theme class
        allowHTML: true,
    });
}


const updateReferralPaginationButtons = () => {
    const totalPages = Math.ceil(totalReferrals / referralsPerPage);


    const prevButton = document.getElementById('referral-prev-page-btn');
    const nextButton = document.getElementById('referral-next-page-btn');

    prevButton.disabled = currentReferralsPage === 1;
    nextButton.disabled = currentReferralsPage === totalPages;

};

// Event listener for previous page butto


fetchAndDisplayReferralTable()
fetchAndDisplayMessageTable()


const deleteReferral = async (referralId, row) => {
    try {
        const response = await axios.delete(`/api/referrals/${referralId}`)
        console.log('deleetd referral', response.data)
        row.remove()
        updateStatistics();
        updateReferralPaginationButtons();
        fetchAndDisplayReferralTable();

    } catch(error) {
        console.log(error)
    }
}



// table

const tableBody = document.querySelector('tbody');
const jobTable = document.querySelector('#jobTable');


// Search feature variables
const searchInput = document.getElementById('search-input');

// Event listener for search input
searchInput.addEventListener('input', () => {
    currentJobPage = 1; // Reset to first page when search query changes
    fetchAndDisplayJobsTable();
});

// Function to calculate total number of jobs
const calculateTotalJobs = async () => {
    try {
        const response = await axios.get('/api/joblist');
        const jobs = response.data;

        // Apply search filter if search query exists
        const searchQuery = searchInput.value.trim().toLowerCase();
        if (searchQuery !== '') {
            const filteredJobs = jobs.filter(job =>
                job.jobTitle.toLowerCase().includes(searchQuery) ||
                job.location.toLowerCase().includes(searchQuery) ||
                job.jobDescription.toLowerCase().includes(searchQuery) ||
                job.skills.toLowerCase().includes(searchQuery) ||
                job.jobType.toLowerCase().includes(searchQuery) ||
                job.jobId.includes(searchQuery)
            );
            totalJobs = filteredJobs.length;
        } else {
            totalJobs = jobs.length;
        }
    } catch (error) {
        console.error(error);
    }
};

const fetchAndDisplayJobsTable = async () => {
    try {
        const response = await axios.get('/api/joblist');
        let jobs = response.data;
        console.log(jobs)

        // Apply search filter if search query exists
        const searchQuery = searchInput.value.trim().toLowerCase();
        if (searchQuery !== '') {
            jobs = jobs.filter(job =>
                job.jobTitle.toLowerCase().includes(searchQuery) ||
                job.location.toLowerCase().includes(searchQuery) ||
                job.jobDescription.toLowerCase().includes(searchQuery) ||
                job.skills.toLowerCase().includes(searchQuery) ||
                job.jobType.toLowerCase().includes(searchQuery) ||
                job.jobId.includes(searchQuery)

            );
        }

        // Update totalJobs based on the filtered jobs
        totalJobs = jobs.length;

        // Calculate pagination values
        const startIndex = (currentJobPage - 1) * jobsPerPage;
        const endIndex = Math.min(startIndex + jobsPerPage, totalJobs);
        const paginatedJobs = jobs.slice(startIndex, endIndex);

        // Clear the table before inserting new rows
        tableBody.innerHTML = '';

        paginatedJobs.forEach(job => {
            displayJob(job);
        });

        // Update pagination buttons
        updatePaginationButtons();
        updateStatistics()

        // Update job page info
        const jobPageInfo = document.querySelector('.job-page-info');
        jobPageInfo.innerHTML = `Showing Jobs <strong>${startIndex + 1}</strong> - <strong>${endIndex}</strong>`;

    } catch (error) {
        console.error(error);
    }
};

fetchAndDisplayJobsTable()

// Function to update pagination buttons based on current page and total jobs
const updatePaginationButtons = () => {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);


    const prevButton = document.getElementById('prev-page-btn');
    const nextButton = document.getElementById('next-page-btn');

    prevButton.disabled = currentJobPage === 1;
    nextButton.disabled = currentJobPage === totalPages;

};



// all pagination buttons and controls

// Event listener for previous page button in jobs table
document.getElementById('prev-page-btn').addEventListener('click', () => {
    if (currentJobPage > 1) {
        currentJobPage--;
        fetchAndDisplayJobsTable();
        updatePaginationButtons(); // Update pagination buttons for jobs table
    }
});

// Event listener for next page button in jobs table
document.getElementById('next-page-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    if (currentJobPage < totalPages) {
        currentJobPage++;
        fetchAndDisplayJobsTable();
        updatePaginationButtons(); // Update pagination buttons for jobs table
    }
});

// Event listener for previous page button in referral table
document.getElementById('referral-prev-page-btn').addEventListener('click', () => {
    if (currentReferralsPage > 1) {
        currentReferralsPage--;
        fetchAndDisplayReferralTable();
        updateReferralPaginationButtons(); // Update pagination buttons for referrals table
    }
});

// Event listener for next page button in referral table
document.getElementById('referral-next-page-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(totalReferrals / referralsPerPage);
    if (currentReferralsPage < totalPages) {
        currentReferralsPage++;
        fetchAndDisplayReferralTable();
        updateReferralPaginationButtons(); // Update pagination buttons for referrals table
    }
});
document.getElementById('message-prev-page-btn').addEventListener('click', () => {
    if (currentMessagePage > 1) {
        currentMessagePage--;
        fetchAndDisplayMessageTable();
        updateMessagePaginationButtons(); // Update pagination buttons for referrals table
    }
});

// Event listener for next page button in referral table
document.getElementById('message-next-page-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(totalMessages / messagesPerPage);
    if (currentMessagePage < totalPages) {
        currentMessagePage++;
        fetchAndDisplayMessageTable();
        updateMessagePaginationButtons(); // Update pagination buttons for referrals table
    }
});






const displayJob = (job) => {
    const numOfApps = job.applicants.length;
    const formattedDate = new Date(job.datePosted).toLocaleDateString();

    const row = tableBody.insertRow();
    row.classList.add('job-row'); // Add a class to identify job rows

    const cell1 = row.insertCell(0);
    cell1.textContent = job.jobId;

    const cell2 = row.insertCell(1);
    cell2.textContent = job.jobTitle;

    const cell3 = row.insertCell(2);
    cell3.textContent = job.jobType;

    const cell4 = row.insertCell(3);
    cell4.textContent = formattedDate;

    const cell5 = row.insertCell(4);
    const viewButton = document.createElement('div');
    viewButton.innerHTML = `View (<strong>${numOfApps}</strong>)`;
    viewButton.addEventListener('click', () => {
        toggleApplicantInfo(row, job.applicants);
    });
    cell5.appendChild(viewButton);

    const cell6 = row.insertCell(5);
    cell6.innerHTML = `<div class="action-row"><i class="fa-solid fa-trash"></i> <i class="fa-solid fa-pen-to-square"></i></div>`;
    const deleteButton = cell6.querySelector('.fa-trash');
    deleteButton.addEventListener("click", () => {
        deleteJob(row, job.jobId);
    });
    const editButton = cell6.querySelector('.fa-pen-to-square')
    editButton.addEventListener("click", () => {
        editJob(row, job.jobId)
    })
    tippy(deleteButton, {
        content: "Click to <strong>delete</strong> job. This <strong>CANNOT</strong> be undone.",
        theme: 'delete', // Add your custom tooltip theme class
        allowHTML: true,
    });

    tippy(editButton, {
        content: "Click to <strong>edit</strong> job.",
        theme: 'edit', // Add your custom tooltip theme class
        allowHTML: true,
    });
}

const editJob = async (row, jobId, formattedDate, numOfApps) => {
    try {
        const response = await axios.get(`/api/joblist/${jobId}`);
        const editDetails = response.data;

        populateEditJobModal(editDetails);

        editJobModal.showModal();

        document.getElementById('edit-submit-job-btn').addEventListener("click", async () => {
            const updatedJobData = {
                deadline: document.getElementById('edit-job-deadline').value,
                jobTitle: document.getElementById('edit-job-title').value,
                jobType: document.getElementById('edit-permanent').checked ? "Permanent" : "Contract",
                salary: document.getElementById('edit-salary').value,
                higherSalary: document.getElementById('edit-max-salary').value,
                dayRate: document.getElementById('edit-day-rate').value,
                higherRate: document.getElementById('edit-higher-day-rate').value,
                ir35Status: document.querySelector('input[name="edit-ir35Status"]:checked').value,
                location: document.getElementById('edit-location').value,
                workSchedule: document.getElementById('edit-work-schedule').value,
                jobDescription: document.getElementById('edit-job-description').value,
                skills: document.getElementById('edit-skills').value,
                benefits: document.getElementById('edit-benefits').value,
                status: document.getElementById('edit-status').value
            };

            try {
                const updateResponse = await axios.put(`/api/joblist/${jobId}`, updatedJobData);
                console.log(updateResponse.data);
                editJobModal.close();
                location.reload();

            } catch (error) {
                console.error(error);
            }
            
        });
    } catch (error) {
        console.error(error);
    }
};



const populateEditJobModal = (editDetails) => {
    document.getElementById('edit-job-id').value = editDetails.jobId;
    document.getElementById('edit-job-date').value = editDetails.datePosted;
    document.getElementById('edit-job-title').value = editDetails.jobTitle;
    document.getElementById('edit-job-deadline').value = new Date(editDetails.deadline)

    
    console.log("Job Type:", editDetails.jobType);

    // Log the container elements to ensure they are correctly selected

    const permContainer = document.querySelector('.edit-perm-container')
    const contractContainer = document.querySelector('.edit-ir35-container')

    // Toggle display based on the job type
    if (editDetails.jobType === "Permanent") {
        permContainer.style.display = "block"
        contractContainer.style.display = "none"
        document.getElementById('edit-permanent').checked = true;
    } else {
        permContainer.style.display = "none"
        contractContainer.style.display = "block"
        document.getElementById('edit-contract').checked = true;
    }
    
    
    document.getElementById('edit-salary').value = editDetails.salary;
    document.getElementById('edit-max-salary').value = editDetails.higherSalary;
    document.getElementById('edit-day-rate').value = editDetails.dayRate;
    document.getElementById('edit-higher-day-rate').value = editDetails.higherRate;
    
    if (editDetails.ir35Status === "Inside IR35") {
        document.getElementById('edit-insideIR35').checked = true;
    } else if (editDetails.ir35Status === "Outside IR35") {
        document.getElementById('edit-outsideIR35').checked = true;
    } else {
        document.getElementById('edit-n/a').checked = true;
    }
    
    document.getElementById('edit-location').value = editDetails.location;
    document.getElementById('edit-work-schedule').value = editDetails.workSchedule;
    document.getElementById('edit-job-description').value = editDetails.jobDescription;
    document.getElementById('edit-skills').value = editDetails.skills;
    document.getElementById('edit-benefits').value = editDetails.benefits;
    document.getElementById('edit-status').value = editDetails.status;
};

document.getElementById('edit-permanent').addEventListener('change', function() {
    document.querySelector('.edit-perm-container').style.display = "block";
    document.querySelector('.edit-ir35-container').style.display = "none";
});

document.getElementById('edit-contract').addEventListener('change', function() {
    document.querySelector('.edit-perm-container').style.display = "none";
    document.querySelector('.edit-ir35-container').style.display = "block";
});


document.getElementById('edit-close-btn').addEventListener("click", () => {
    editJobModal.close()
})


const deleteJob = async (row, jobId) => {
    try {
        const response = await axios.delete(`/api/joblist/${jobId}`);
        console.log('Job deleted successfully:', response.data);

        fetchAndDisplayJobsTable()
        updateStatistics()

        // Remove the row from the table after successful deletion
        row.remove();
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error('Error deleting job:', error);
    }
};


const toggleApplicantInfo = (row, applicants) => {
    // Check if screen width is greater than 550px (or any other threshold you prefer)
    if (window.innerWidth > 550) {
        const applicantRow = row.nextElementSibling;
        const visibleColumnCount = row.cells.length;
        console.log('Visible Column Count:', visibleColumnCount); // Log the visible column count

        if (applicantRow && applicantRow.classList.contains('applicant-row')) {
            // If the applicant row exists, toggle its visibility
            applicantRow.classList.toggle('hidden');
        } else {
            // Otherwise, create a new row and display applicant info
            const applicantInfo = document.createElement('tr');
            applicantInfo.classList.add('applicant-row'); // Add classes for identification and initial hiding
            const cell = applicantInfo.insertCell(0);
            cell.colSpan = 6; // Set the colSpan dynamically to match the number of visible columns

            // Create heading
            const heading = document.createElement('h4');
            heading.textContent = 'Applicants';
            cell.appendChild(heading);

            // Add applicant information
            applicants.forEach((applicant, index) => {
                const date = applicant.dateApplied
                const formattedDate = new Date(date).toLocaleDateString()
                const applicantInfoItem = document.createElement('div');
                applicantInfoItem.innerHTML = `
                    <strong>Applicant Number:</strong> ${index + 1}<br>
                    <strong>Name:</strong> ${applicant.name}<br>
                    <strong>Email:</strong> ${applicant.email}<br>
                    <strong>Number:</strong> ${applicant.number}<br>
                    <strong>Applied:</strong> ${formattedDate}<br>
                    <strong>Linkedin Profile</strong> <a href="${applicant.linkedin}" target="_blank">Linkedin</a><br>
                    <strong>Cover Letter:</strong> ${applicant.coverLetter}<br>
                    <strong>CV:</strong> <a href="${applicant.cvFile}" target="_blank">Download CV</a>
                `;
                applicantInfoItem.classList.add('applicant-info');
                cell.appendChild(applicantInfoItem);
            });

            row.parentNode.insertBefore(applicantInfo, row.nextElementSibling);
        }
    } else {
        console.log('This feature is only available on larger screens.');
    }
};


//statistics 

const updateStatistics = async () => {
    try {
        const response = await axios.get('/api/joblist');
        const referralResponse = await axios.get('/api/referrals')
        const messagesReponse = await axios.get('/api/messages')
        const jobs = response.data;
        const referrals = referralResponse.data
        const messages = messagesReponse.data

        const totalJobsElement = document.querySelector('.total-jobs');
        const totalOpenJobsElement = document.querySelector('.total-open-jobs');
        const totalContractJobsElement = document.querySelector('.total-contract-jobs');
        const totalPermanentJobsElement = document.querySelector('.total-permanent-jobs');
        const totalReferralsElement = document.querySelector('.total-referrals')
        const totalMessagesElement = document.querySelector('.total-messages')

        const totalJobs = jobs.length;
        const totalMessages = messages.length
        const totalReferrals = referrals.length
        const totalOpenJobs = jobs.filter(job => job.status === 'open').length;
        const totalContractJobs = jobs.filter(job => job.jobType === 'Contract').length;
        const totalPermanentJobs = jobs.filter(job => job.jobType === 'Permanent').length;
        

        totalJobsElement.textContent = totalJobs;
        totalOpenJobsElement.textContent = totalOpenJobs;
        totalContractJobsElement.textContent = totalContractJobs;
        totalPermanentJobsElement.textContent = totalPermanentJobs;
        totalReferralsElement.textContent = totalReferrals
        totalMessagesElement.textContent = totalMessages
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
};

// Call updateStatistics initially
updateStatistics();


const generateRepotrt = document.querySelectorAll('.generate-report-btn')
generateRepotrt.forEach(genBtn => {
    genBtn.addEventListener('click', () => {
        window.location = 'report.html'
    })
})



// menu navigation


function setUpMenuListeners() {
    const viewMenu = document.querySelectorAll('.view-flex');
    const subMenu = document.querySelectorAll('.menu-hidden');
    const arrowIcons = document.querySelectorAll('.fa-arrow-down')

    viewMenu.forEach((view, index) => {
        view.addEventListener("click", () => {
            subMenu[index].classList.toggle('active');
            arrowIcons[index].classList.toggle('rotate');
        })
    })
}


const menu = document.querySelector('.menu');
const menuContent = document.querySelector('.menu-bar');

menu.addEventListener("click", () => {
    menuContent.classList.toggle('active')
})

window.addEventListener('load', () => {
    const loader = document.querySelector('.loader')
    loader.classList.add('loader--hidden')
})


document.addEventListener('DOMContentLoaded', () => {
    const quill = new Quill('#editor', {
        theme: 'snow'
    });

    const confirmYesBtn = document.getElementById('confirm-yes');
    const myModalElement = document.getElementById('myModal');
    const myModal = new bootstrap.Modal(myModalElement); // Initialize Bootstrap modal

    const sendEmailBtn = document.getElementById('email-btn');

    // Handle confirmation button click
    confirmYesBtn.addEventListener('click', async () => {
        myModal.hide();
        sendEmailBtn.innerHTML = 'Sending...';

        try {
            // Retrieve the HTML content from the Quill editor
            const htmlContent = quill.root.innerHTML;

            // Send the HTML content to the server for processing
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ htmlContent })
            });

            // Parse the server response
            const data = await response.json();
            console.log('Server Response:', data);

            // Update the button appearance after sending (e.g., show success status)
            sendEmailBtn.innerHTML = 'Email Sent <i class="fa-solid fa-check"></i>';
            sendEmailBtn.style.background = 'green';
            sendEmailBtn.style.color = 'white';

            // Reset the Quill editor content after sending
            quill.root.innerHTML = ''; // Clear Quill editor content

            setTimeout(() => {
                sendEmailBtn.innerHTML = 'Send Email';
                sendEmailBtn.style.background = '#262F4C';
                sendEmailBtn.style.color = 'white';
            }, 3000);

        } catch (error) {
            console.error('Error sending email:', error);
            sendEmailBtn.innerHTML = 'Send Email'; // Reset button text on error
            sendEmailBtn.style.background = '#262F4C';
            sendEmailBtn.style.color = 'white';
        }
    });

    // Handle send email button click to show the confirmation modal
    sendEmailBtn.addEventListener('click', () => {
        // Show the confirmation modal
        myModal.show();
    });

    // Debugging: Log to check if event listeners are being triggered
    console.log('Event listeners attached.');
});



function resetEmailHTML() {
    const quill = new Quill('#editor');
    quill.root.innerHTML = '';
}


const mainPage = document.querySelector('.dashboard-lg-container');
const emailPage = document.querySelector('.compose-email-container');
const clickToEmail = document.getElementById('email-page')

clickToEmail.addEventListener('click', () => {
    emailPage.style.display = 'block'
    mainPage.style.display = 'none'
    })


const backToDash = document.getElementById('dashboard')
backToDash.addEventListener('click', () => {
    mainPage.style.display = 'block'
    emailPage.style.display = 'none'
})



setUpMenuListeners()



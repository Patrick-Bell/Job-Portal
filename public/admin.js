
const addJobBtn = document.getElementById('addJobBtn');
const jobModal = document.getElementById('jobModal');
const closeModalBtn = document.getElementById('close-btn')
const submitJobBtn = document.getElementById('submit-job-btn')

const contractChoice = document.getElementById('contract');
const permanentChoice = document.getElementById('permanent');
const ir35Container = document.querySelector('.ir35-container')
const permContainer = document.querySelector('.perm-container')

const editJobModal = document.getElementById('editModal')

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



// table

const tableBody = document.querySelector('tbody');
const jobTable = document.querySelector('#jobTable');

const fetchAndDisplayJobsTable = async () => {
    try {
        const response = await axios.get('/api/joblist');
        const jobs = response.data;
        console.log(jobs);

        // Clear the table before inserting new rows
        tableBody.innerHTML = '';

        jobs.forEach(job => {
            displayJob(job);
        });
    } catch (error) {
        console.error(error);
    }
};

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



fetchAndDisplayJobsTable();


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

setUpMenuListeners()



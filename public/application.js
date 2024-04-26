// Retrieve job ID from query parameter
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get('jobId');
document.getElementById('jobId').value = jobId;


const clickToApplyBtn = document.getElementById('click-to-apply-button')
const jobApplicationForm = document.querySelector('.job-app-form')

clickToApplyBtn.addEventListener("click", () => {
    jobApplicationForm.style.display = 'block';
    jobApplicationForm.scrollIntoView({ behavior: 'smooth'})
})

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); // Add .show class when element is intersecting
        } 
    });
});

const hiddenUp = document.querySelectorAll('.hidden-up')
const hiddenRight = document.querySelectorAll('.hidden-right')
const hiddenLeft = document.querySelectorAll('.hidden-left')
hiddenUp.forEach((el) => observer.observe(el))
hiddenRight.forEach((el) => observer.observe(el))
hiddenLeft.forEach((el) => observer.observe(el))



// Fetch job details based on job ID
async function fetchJobDetails(jobId) {
    try {
        const response = await axios.get(`/api/joblist/${jobId}`);
        const job = response.data;

        // Populate job details in the form

        const jobIdNum = document.getElementById('jobId')
        const jobDescriptionDiv = document.getElementById('job-description');
        const skillsDiv = document.getElementById('skills');
        const locationDiv = document.getElementById('job-location');
        const jobType = document.getElementById('job-type');
        const benefits = document.getElementById('benefits');
        const dayRate = document.getElementById('job-dayrate');
        const salary = document.getElementById('salary');
        const jobTitle = document.getElementById('job-title')
        const jobDate = document.getElementById('job-date')
        const jobDeadline = document.getElementById('job-deadline')
        const rawDeadlineDate = job.deadline
        const rawDate = job.datePosted; // Assuming job.datePosted is a string
        const formattedDate = new Date(rawDate).toLocaleDateString('en-US', { 
        weekday: 'long', // Add the day of the week
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        });
        const formattedDeadlineDate = new Date(rawDeadlineDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        })
        const rawSalary = job.salary;
        const formattedSalary = (rawSalary.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        const upperSalary = job.higherSalary
        const formattedHigherSalary = (upperSalary.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        const higherRate = job.higherRate
        console.log(upperSalary)

        console.log(rawDeadlineDate)


        jobIdNum.textContent = job.jobId
        jobDescriptionDiv.textContent = job.jobDescription;  
        skillsDiv.textContent = job.skills;
        locationDiv.textContent = job.location;
        jobType.textContent = job.jobType;
        benefits.textContent = job.benefits;
        dayRate.innerHTML = `£${job.dayRate} - £${higherRate} ${job.ir35Status}`;
        salary.innerHTML = `£${formattedSalary} - £${formattedHigherSalary} per anumn`
        jobTitle.textContent = job.jobTitle
        jobDate.innerHTML = `Job Posted: ${formattedDate}`
        jobDeadline.innerHTML = `Job Deadline: ${formattedDeadlineDate}`

        // Check job type to hide/show relevant fields
        if (job.jobType === 'Contract') {
            salary.parentElement.style.display = 'none'; // Hide salary field
        } else if (job.jobType === 'Permanent') {
            dayRate.parentElement.style.display = 'none'; // Hide day rate field
            salary.parentElement.style.display = 'block'; // Hide salary field
        }

    } catch (error) {
        console.error('Error fetching job details:', error);
        // Optionally, provide feedback to the user about the error
    }
}



const submitApplicationBtn = document.getElementById('application-submit-btn')


submitApplicationBtn.addEventListener("click", (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const jobId = document.getElementById('jobId').value; // Assuming you have an input field with id 'jobId' to capture the job ID

    console.log(jobId)

    // Save the data to localStorage
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('jobId', jobId);

    const email = document.getElementById('email').value;
    const number = document.getElementById('phone').value;
    const coverLetter = document.getElementById('coverLetter').value;
    const linkedin = document.getElementById('linkedin').value;
    const cvFile = document.getElementById('resume').files[0]; // Assuming your file input has an ID of 'resume'

    // Check if cvFile is not null or undefined
    if (cvFile) {
        // Create a FormData object and append the file data
        let formData = new FormData();
        formData.append('jobId', jobId);
        formData.append('name', fullName);
        formData.append('email', email);
        formData.append('number', number);
        formData.append('linkedin', linkedin);
        formData.append('coverLetter', coverLetter);
        formData.append('cvFile', cvFile);

        console.log(formData)

        // Send the form data using Axios POST request
        axios.post('/api/submit-application', formData)
            .then((response) => {
                console.log("Response Data:", response.data);

                // Redirect the user to the "thanks.html" page
                window.location.href = 'thanks.html';
            })
            .catch((error) => {
                console.error('Error submitting application:', error);
                // Optionally, provide feedback to the user about the error
            });
    } else {
        console.error("No file selected.");
        // Optionally, provide feedback to the user about selecting a file
    }
});


const backBtn = document.querySelector('.fa-arrow-left');
backBtn.addEventListener('click', () => {
    window.location = 'jobs.html'
})



window.addEventListener('DOMContentLoaded', () => {
    fetchJobDetails(jobId);
});

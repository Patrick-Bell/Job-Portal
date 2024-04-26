document.addEventListener("DOMContentLoaded", function() {
    // Retrieve fullName and jobId from localStorage
    const fullName = localStorage.getItem('fullName');
    const jobId = localStorage.getItem('jobId');

    // Check if fullName and jobId exist
    if (fullName && jobId) {
        // Display a customized message on the page
        const message = `<br>Hi <strong>${fullName}</strong>, thanks for applying to job <u><strong>${jobId}</strong></u>.
        As we are experiencing a high volume of applicants, we will do our best to get in touch as soon as possible. If you do not hear from
        us within 3-5 days, it means that unfortunately you have been unsuccessful in our selection process.<br><br>
        If you would like more information about the role, please send us an email at <u><strong>jobportal@gmail.com</strong></u> with your name and 
        the job number (<u><strong>${jobId}</strong></u>)`;
        document.getElementById('message').innerHTML = message;
    } else {
        // Display a generic message if fullName or jobId is not found in localStorage
        document.getElementById('message').innerHTML = 
        `<br>Hi, thanks for applying to one of our jobs.
        As we are experiencing a high volume of applicants, we will do our best to get in touch as soon as possible. If you do not hear from
        us within 3-5 days, it means that unfortunately you have been unsuccessful this time in our selection process.<br><br>
        If you would like more information, please contact us via email: <u><strong>jobportal@gmail.com</strong></u><br>`;
    }

    // Clear the localStorage after retrieving the values
    localStorage.removeItem('fullName');
    localStorage.removeItem('jobId');
});

const jobsBtn = document.getElementById('jobs')
const homeBtn = document.getElementById('home')

jobsBtn.addEventListener('click', () => {
    window.location = 'jobs.html'
})

homeBtn.addEventListener('click', () => {
    window.location = 'admin.html'
})

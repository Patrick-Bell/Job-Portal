const techSalaryData = [
    { jobTitle: 'Software Engineer', minSalary: 70000, medianSalary: 95000, maxSalary: 120000 },
    { jobTitle: 'Data Scientist', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
    { jobTitle: 'Web Developer', minSalary: 60000, medianSalary: 85000, maxSalary: 110000 },
    { jobTitle: 'Mobile App Developer', minSalary: 65000, medianSalary: 90000, maxSalary: 115000 },
    { jobTitle: 'Systems Analyst', minSalary: 70000, medianSalary: 95000, maxSalary: 120000 },
    { jobTitle: 'Network Administrator', minSalary: 60000, medianSalary: 85000, maxSalary: 110000 },
    { jobTitle: 'Database Administrator', minSalary: 70000, medianSalary: 95000, maxSalary: 120000 },
    { jobTitle: 'IT Manager', minSalary: 90000, medianSalary: 120000, maxSalary: 150000 },
    { jobTitle: 'Cybersecurity Analyst', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'Cloud Solutions Architect', minSalary: 95000, medianSalary: 125000, maxSalary: 150000 },
    { jobTitle: 'DevOps Engineer', minSalary: 80000, medianSalary: 110000, maxSalary: 140000 },
    { jobTitle: 'UI/UX Designer', minSalary: 70000, medianSalary: 95000, maxSalary: 120000 },
    { jobTitle: 'QA Engineer', minSalary: 65000, medianSalary: 90000, maxSalary: 115000 },
    { jobTitle: 'Machine Learning Engineer', minSalary: 85000, medianSalary: 115000, maxSalary: 140000 },
    { jobTitle: 'Full Stack Developer', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'Network Engineer', minSalary: 70000, medianSalary: 95000, maxSalary: 120000 },
    { jobTitle: 'Systems Administrator', minSalary: 65000, medianSalary: 90000, maxSalary: 115000 },
    { jobTitle: 'Business Intelligence Analyst', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
    { jobTitle: 'Technical Support Specialist', minSalary: 55000, medianSalary: 75000, maxSalary: 95000 },
    { jobTitle: 'Data Engineer', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'Junior Software Engineer', minSalary: 30000, medianSalary: 35000, maxSalary: 40000 },
    { jobTitle: 'Ruby Developer', minSalary: 70000, medianSalary: 95000, maxSalary: 120000 },
    { jobTitle: 'Node.js Developer', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
    { jobTitle: 'JavaScript Developer', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'Python Developer', minSalary: 85000, medianSalary: 110000, maxSalary: 135000 },
    { jobTitle: 'Java Developer', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
    { jobTitle: 'C# Developer', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'PHP Developer', minSalary: 70000, medianSalary: 95000, maxSalary: 120000 },
    { jobTitle: 'Swift Developer', minSalary: 85000, medianSalary: 110000, maxSalary: 135000 },
    { jobTitle: 'Go Developer', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
    { jobTitle: 'React Developer', minSalary: 90000, medianSalary: 120000, maxSalary: 145000 },
    { jobTitle: 'Angular Developer', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'Vue.js Developer', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'Django Developer', minSalary: 75000, medianSalary: 100000, maxSalary: 125000 },
    { jobTitle: 'Spring Developer', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
    { jobTitle: 'React Native Developer', minSalary: 85000, medianSalary: 110000, maxSalary: 135000 },
    { jobTitle: 'TensorFlow Developer', minSalary: 90000, medianSalary: 115000, maxSalary: 140000 },
    { jobTitle: 'Unity Developer', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
    { jobTitle: 'Scala Developer', minSalary: 85000, medianSalary: 110000, maxSalary: 135000 },
    { jobTitle: 'Rust Developer', minSalary: 85000, medianSalary: 110000, maxSalary: 135000 },
    { jobTitle: 'Kotlin Developer', minSalary: 80000, medianSalary: 105000, maxSalary: 130000 },
]


const jobTitleOptions = document.getElementById('job-titles');

techSalaryData.forEach((job) => {
    const option = document.createElement('option')
    option.value = job.jobTitle;
    option.text = job.jobTitle;
    jobTitleOptions.add(option)
})

const searchSalaryBtn = document.querySelector('.salary-btn')
let minSalary = document.querySelector('.min-salary')
let medianSalary = document.querySelector('.median-salary');
let maxSalary = document.querySelector('.max-salary')
const salaryBlock = document.querySelector('.salary-results')
const salaryInfo = document.querySelector('.salary-info')
const salaryInfoTitle = document.querySelector('.salary-info-title')

searchSalaryBtn.addEventListener('click', () => {
    const selectedJob = jobTitleOptions.value; // Get the selected job title
    console.log(selectedJob);

    salaryBlock.style.display = "block"

    // Find the job object in techSalaryData array based on the selected job title
    const selectedJobData = techSalaryData.find(job => job.jobTitle === selectedJob);

    if (selectedJobData) {
        // Update the text content of the salary elements with the corresponding formatted salary values
        minSalary.textContent = `£${selectedJobData.minSalary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        medianSalary.textContent = `£${selectedJobData.medianSalary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        maxSalary.textContent = `£${selectedJobData.maxSalary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        salaryInfoTitle.innerHTML =`${selectedJob} salary in the UK<br><br>`
        salaryInfo.innerHTML = `${selectedJob}'s usually earn a salary of <strong>${medianSalary.textContent}</strong>. Most of the ${selectedJob} salaries are between <strong>${minSalary.textContent} GPB</strong> and
        <strong>${maxSalary.textContent} GPB per year</strong>.<br><br>
        If you are earning less than <strong>${minSalary.textContent}</strong>, then it might be the time to speak with your boss to get a raise or to look at new ${selectedJob} jobs in the UK.<br><br>
        You can start by looking <a href="/jobs.html">here</a>.<br><br>`
        
    } else {
        console.error('Selected job title not found in techSalaryData array');
    }
});


tippy('#salary-i-info', {
    content: "Salary information may not be 100% accurate but is a solid foundation for tech salaries in the UK. All positions are based on <strong>Senior</strong> positions unless stated in the job title",
    allowHTML: true,
    theme: 'tomato',
});

tippy('#to-top', {
    content: "Back to top",
    allowHTML: true,
    placement: 'right-start',
});

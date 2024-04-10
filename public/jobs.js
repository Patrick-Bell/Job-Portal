const allJobsContainer = document.querySelector('.jobs-container');

async function renderAllJobs() {
    try {
        // Execute the query to find all job listings
        const response = await axios.get('/api/joblist');
        const jobs = response.data;

        const openJobs = jobs.filter(job => job.status === 'open')
        console.log('openjobs', openJobs)

        // Clear the container before rendering
        allJobsContainer.innerHTML = '';

        // Render job cards
        openJobs.forEach(job => {
            // Truncate job description to 100 characters
            const shortDesc = job.jobDescription.slice(0, 100) + '...';
            const formattedDate = new Date(job.datePosted).toLocaleDateString();
            const formattedSalary = job.jobType === 'Contract' ? `£${job.dayRate} (${job.ir35Status})` : `£${job.salary.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

            // Create job card HTML
            const jobCardHTML = `
                <div class="job-card">
                    <div class="flex-container">
                        <h2>${job.jobTitle}</h2>
                        <div class="job-type">${job.jobType}</div>
                    </div>
                    <div class="location"><i class="fa-solid fa-location-dot"></i> ${job.location}</div>
                    <div class="work-schedule"><i class="fa-solid fa-building"></i> ${job.workSchedule}</div>
                    <div class="pay-rate"><i class="fa-solid fa-hand-holding-dollar"></i> ${formattedSalary}</div>
                    <div class="short-desc">${shortDesc}</div>
                    <div class="date-container">
                        <div class="date-added">Added ${formattedDate}</div>
                        <div class="view" data-job='${JSON.stringify(job)}'>View</div>
                    </div>
                </div>
            `;

            // Append job card HTML to container
            allJobsContainer.insertAdjacentHTML('beforeend', jobCardHTML);
        });

        // Add event listeners to view buttons
        const viewBtns = document.querySelectorAll('.view');
        viewBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
        const job = JSON.parse(event.target.dataset.job);
        const queryParams = new URLSearchParams();
        for (const key in job) {
            queryParams.append(key, job[key]);
        }
        queryParams.append('jobId', job.id);
        const queryString = queryParams.toString();
        window.location.href = `/apply?${queryString}`;
    });
});


    } catch (error) {
        console.log(error);
    }
}

renderAllJobs();

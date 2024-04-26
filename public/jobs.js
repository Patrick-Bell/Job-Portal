const allJobsContainer = document.querySelector('.jobs-container');
const jobTypeFilter = document.getElementById('job-type-option');
const workScheduleFilter = document.getElementById('job-schedule-option');
let allJobs = []; // Define allJobs outside the function
let jobs = []
const paginationContainer = document.getElementById('pagination-container')



const accordianHeader = document.querySelectorAll('.accordian-header');
const accordianDesc = document.querySelectorAll('.accordian-desc');
const plusIcon = document.querySelectorAll('.fa-plus')

function accordionMenu() {
  accordianHeader.forEach((accordion, index) => {
      accordion.addEventListener("click", () => {
          // Toggle active class for accordion description
          accordianDesc[index].classList.toggle('active');
          
          plusIcon[index].classList.toggle('fa-minus');
          
          // Add back fa-plus class when accordion is collapsed
          if (accordianDesc[index].classList.contains('active')) {
              plusIcon[index].classList.remove('fa-plus')
              plusIcon[index].classList.add('fa-minus');
          } else {
              plusIcon[index].classList.add('fa-plus')
              plusIcon[index].classList.remove('fa-minus');
          }
      });
  });
}


accordionMenu()



const scrolls = document.querySelectorAll('.scroll-click');
const menuContent = document.querySelector('.menu-bar');
const viewMenu = document.querySelectorAll('.view-flex');
const subMenu = document.querySelectorAll('.menu-hidden');
const arrowIcons = document.querySelectorAll('.fa-arrow-down');
const menu = document.querySelector('.menu');
const closeMenu = document.querySelector('.fa-x')


 // Set up event listener for menu toggle
 menu.addEventListener("click", () => {
  menuContent.classList.toggle('active');
  console.log('clicking menu icon')
});


function setUpMenuListeners() {
  viewMenu.forEach((view, index) => {
      view.addEventListener("click", () => {
          subMenu[index].classList.toggle('active');
          arrowIcons[index].classList.toggle('rotate');
      })
  })
}

// Set up event listener for scroll clicks
scrolls.forEach(scroll => {
    scroll.addEventListener("click", () => {
        console.log('clicked');
        menuContent.classList.toggle('active');
    });
});


closeMenu.addEventListener("click", () => {
  menuContent.classList.toggle('active')
})


async function renderAllJobs(jobs) {
    try {
        // Clear the container before rendering
        allJobsContainer.innerHTML = '';

        // Render job cards
        jobs.map(job => {
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

        const jobCountInfo = document.getElementById('job-count-info');
        if (jobs.length === 0) {
            jobCountInfo.textContent = 'No Jobs Found'
        } else {
            jobCountInfo.innerHTML = `Showing <strong>${jobs.length}</strong> jobs`;
        }

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

async function fetchAndRenderAllJobs() {
    try {
        // Execute the query to find all job listings
        const response = await axios.get('/api/joblist');
        jobs = response.data; // Store all jobs fetched from the server
        allJobs = jobs.filter(job => job.status === 'open'); // Filter open jobs
        renderAllJobs(allJobs); // Render all open jobs
    } catch (error) {
        console.log(error);
    }
}

function filterJobsByCategories(jobType, workSchedule, searchQuery) {
    let filteredJobs = allJobs;

    // Apply job type filter
    if (jobType && jobType !== 'all') {
        console.log(jobType)
        filteredJobs = filteredJobs.filter(job => job.jobType.toLowerCase() === jobType);
    }

    // Apply work schedule filter
    if (workSchedule && workSchedule !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.workSchedule.toLowerCase().includes(workSchedule));
    }

    // Apply search query filter
    if (searchQuery) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        filteredJobs = filteredJobs.filter(job => job.jobTitle.toLowerCase().includes(lowercaseSearchQuery) || job.jobDescription.toLowerCase().includes(lowercaseSearchQuery));
    }

    renderAllJobs(filteredJobs);
}


jobTypeFilter.addEventListener("change", () => {
    const selectedJobType = jobTypeFilter.value; // Renamed to selectedJobType for clarity
    const selectedWorkSchedule = workScheduleFilter.value;
    const searchQuery = document.getElementById('search-bar').value;
    filterJobsByCategories(selectedJobType, selectedWorkSchedule, searchQuery);
});


workScheduleFilter.addEventListener("change", () => {
    const selectedJobType = jobTypeFilter.value; // Renamed to selectedJobType for clarity
    const selectedWorkSchedule = workScheduleFilter.value;
    const searchQuery = document.getElementById('search-bar').value;
    filterJobsByCategories(selectedJobType, selectedWorkSchedule, searchQuery);
});

document.getElementById('search-bar').addEventListener("input", () => {
    const selectedJobType = jobTypeFilter.value; // Renamed to selectedJobType for clarity
    const selectedWorkSchedule = workScheduleFilter.value;
    const searchQuery = document.getElementById('search-bar').value;
    filterJobsByCategories(selectedJobType, selectedWorkSchedule, searchQuery);
});


const resetFiltersBtn = document.getElementById('reset-btn')


resetFiltersBtn.addEventListener("click", () => {
    document.getElementById('search-bar').value = '';
    jobTypeFilter.value = '';
    workScheduleFilter.value = '';
    filterJobsByCategories('', '', ''); // Reset filters

    // Update the job count info
    renderAllJobs(allJobs);
});


window.addEventListener('load', () => {
    const loader = document.querySelector('.loader')
    loader.classList.add('loader--hidden')
})



fetchAndRenderAllJobs()
setUpMenuListeners()
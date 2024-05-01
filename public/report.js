// report.js

const fetchAndDisplayJobsReportTable = async () => {
    try {
        const response = await axios.get('/api/joblist');
        const jobs = response.data;

        // Update the HTML content with the fetched data
        updateHTMLWithDynamicData(jobs);

        // Generate the PDF from the updated HTML content
        generatePdfFromHtml(document.documentElement.outerHTML);

    } catch (error) {
        console.error(error);
    }
};

const updateHTMLWithDynamicData = (jobs) => {
    const permanentJobsBody = document.getElementById('permanent-jobs-body');
    const contractJobsBody = document.getElementById('contract-jobs-body');
    const summaryDate = document.getElementById('summary-date');

    // Clear existing content
    permanentJobsBody.innerHTML = '';
    contractJobsBody.innerHTML = '';

    // Iterate over jobs and update the HTML
    jobs.forEach(job => {
        const formattedDate = new Date(job.datePosted).toLocaleDateString();
        const formattedDeadline = new Date(job.deadline).toLocaleDateString();
        const rawSalary = job.salary;
        const formattedSalary = (rawSalary.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        const upperSalary = job.higherSalary;
        const formattedHigherSalary = (upperSalary.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

        const row = document.createElement('tr');
        row.classList.add('job-row');

        const cell1 = document.createElement('td');
        cell1.textContent = job.jobTitle;
        row.appendChild(cell1);

        const cell2 = document.createElement('td');
        if (job.jobType === "Permanent") {
            cell2.innerHTML = `£${formattedSalary} - £${formattedHigherSalary}`;
        } else if (job.jobType === "Contract") {
            const rawDayRate = job.dayRate;
            const formattedDayRate = (rawDayRate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
            const upperDayRate = job.higherRate;
            const formattedHigherDayRate = (upperDayRate.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
            cell2.innerHTML = `£${formattedDayRate} - £${formattedHigherDayRate} (${job.ir35Status})`;
        }
        row.appendChild(cell2);

        const cell3 = document.createElement('td');
        cell3.textContent = job.workSchedule;
        row.appendChild(cell3);

        const cell4 = document.createElement('td');
        cell4.textContent = (job.applicants).length;
        row.appendChild(cell4);

        const cell5 = document.createElement('td');
        cell5.innerHTML = `${formattedDate} - ${formattedDeadline}`;
        row.appendChild(cell5);

        if (job.jobType === "Permanent") {
            permanentJobsBody.appendChild(row);
        } else if (job.jobType === "Contract") {
            contractJobsBody.appendChild(row);
        }
    });

    // Set the summary date
    const currentDate = new Date();
    summaryDate.textContent = `Report Generated: ${currentDate.toLocaleDateString()}`;
};

const generatePdfFromElement = async (element) => {
    try {
        // Convert the specific element to PDF
        const pdf = await html2pdf().from(element).toPdf().save();

        // You can optionally return the PDF blob or URL
        return pdf;
    } catch (error) {
        throw new Error('Failed to generate PDF from element:', error);
    }
};

document.getElementById('gen-btn').addEventListener('click', async () => {
    try {
        // Fetch and display jobs report table
        await fetchAndDisplayJobsReportTable();

        // Generate PDF from the report-pdf-container
        const reportContainer = document.querySelector('.report-pdf');
        if (reportContainer) {
            await generatePdfFromElement(reportContainer);
            console.log('PDF generated successfully.');
        } else {
            throw new Error('Report container not found.');
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
});

const downloadContainer = document.querySelector('.download-container')

const printReport = () => {
    // Apply a class to the body to trigger print-specific styles
    downloadContainer.classList.add('print');
    // Print the page
    window.print();
    // Remove the print-specific class after printing
    downloadContainer.classList.remove('print');
};

document.getElementById('print-btn').addEventListener('click', () => {
    // Print the report
    printReport();
});

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




fetchAndDisplayJobsReportTable()
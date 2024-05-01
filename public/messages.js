// Fetch messages from the API and render them
async function fetchMessages() {
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        console.log(data);

        let length = data.length
        const totalMessages = document.getElementById('total-messages')

        totalMessages.innerHTML = `Total Messages: ${length}`
        
        // Render messages initially with no filters applied
        renderMessages(data);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Render messages grouped by month/year
function renderMessages(messages) {
    const messagesByMonthYear = groupMessagesByMonthYear(messages);
    renderMessagesByMonthYear(messagesByMonthYear);
}

// Apply filters to messages and render the filtered results
async function applyFilters() {
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();

        // Retrieve filter criteria from input fields and dropdown
        const filterName = document.getElementById('filterName').value.trim().toLowerCase();
        const filterEmail = document.getElementById('filterEmail').value.trim().toLowerCase();
        const filterId = document.getElementById('filterId').value.trim().toLowerCase()
        const filterResponded = document.getElementById('filterResponded').value;

        // Log filter criteria for debugging
        console.log('Filter Name:', filterName);
        console.log('Filter Email:', filterEmail);
        console.log('Filter Responded:', filterResponded);

        // Filter messages based on criteria
        const filteredMessages = data.filter(message => {
            const nameMatch = !filterName || message.name.toLowerCase().includes(filterName.toLowerCase());
            const emailMatch = !filterEmail || message.email.toLowerCase().includes(filterEmail.toLowerCase());
            const idMatch = !filterId || message.id.toLowerCase().includes(filterId.toLowerCase())
            const respondedMatch = (filterResponded === 'all') ||
                                   (filterResponded === 'yes' && message.responded === 'yes') ||
                                   (filterResponded === 'no' && message.responded === 'no');
          
            return nameMatch && emailMatch && respondedMatch && idMatch;
          })
          

        // Log filtered messages for debugging
        console.log('Filtered Messages:', filteredMessages);

        let length = filteredMessages.length
        const totalMessages = document.getElementById('total-messages')

        totalMessages.innerHTML = `Total Messages: ${length}`

        if (length === 0) {
            totalMessages.innerHTML = `No messages found. Please try again.`
        }

        // Render filtered messages
        renderMessages(filteredMessages);
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}


// Reset filters and render all messages
function resetFilters() {
    document.getElementById('filterName').value = '';
    document.getElementById('filterEmail').value = '';
    document.getElementById('filterId').value = '';
    document.getElementById('filterResponded').value = 'all';

    fetchMessages(); // Re-fetch and render all messages
}

// Helper function to group messages by month/year
function groupMessagesByMonthYear(messages) {
    const messagesByMonthYear = {};

    messages.forEach(message => {
        const dateStr = message.dateSent;
        const date = new Date(dateStr);
        const month = date.getMonth(); // Month (0-11)
        const year = date.getFullYear(); // Full year (e.g., 2024)

        const key = `${year}-${month}`; // Example key format: "2024-3" (year-month)
        if (!messagesByMonthYear[key]) {
            messagesByMonthYear[key] = {
                month: month,
                year: year,
                messages: []
            };
        }

        messagesByMonthYear[key].messages.push(message);
    });

    return messagesByMonthYear;
}

// Render messages grouped by month/year
function renderMessagesByMonthYear(messagesByMonthYear) {
    const messageListElement = document.getElementById('messageList');
    messageListElement.innerHTML = ''; // Clear existing messages

    const keys = Object.keys(messagesByMonthYear)

    keys.reverse().forEach(key => {
        const {month, year, messages } = messagesByMonthYear[key]
    
        messages.sort((a, b) => {
            const dateA = new Date(a.dateSent);
            const dateB = new Date(b.dateSent);
            return dateB - dateA; // Sort descending (latest first)
        });

        const monthYearHeader = document.createElement('h2');
        monthYearHeader.textContent = `${getMonthName(month)} ${year}`;
        messageListElement.appendChild(monthYearHeader);

        const monthYearContainer = document.createElement('div');

        messages.forEach(message => {
            const { id, name, email, dateSent, message: content, responded } = message;

            const messageItem = document.createElement('div');
            messageItem.classList.add('message-item');

            const iconClass = responded === 'yes' ? 'fas fa-check-circle' : 'fas fa-times-circle';
            const statusText = responded === 'yes' ? 'Responded: Yes' : 'Responded: No';
            const statusColor = responded === 'yes' ? 'green' : 'red';

            const messageDetails = `
                <div class="message-info">
                    <i class="fa-solid fa-hashtag"></i> <strong>${id}</strong><br>
                    <i class="fas fa-user"></i> <strong>${name}</strong><br>
                    <i class="fas fa-envelope"></i> <strong>${email}</strong><br>
                    <i class="fas fa-clock"></i> ${new Date(dateSent).toLocaleString()}<br>
                </div>
                <div class="message-content">
                    <i class="fas fa-comment-alt"></i> ${content}<br>
                </div>
                <div class="message-status">
                    <i class="${iconClass}" style="color: ${statusColor};"></i> ${statusText}<br>
                </div>
                <br>
            `;

            messageItem.innerHTML = messageDetails;
            monthYearContainer.appendChild(messageItem);
        });
        

        messageListElement.appendChild(monthYearContainer);
    });
}

// Helper function to get month name from month index
function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

// Initial fetch and rendering of messages
fetchMessages();

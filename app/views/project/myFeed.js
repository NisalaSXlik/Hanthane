// Calendar functionality
const calender = document.querySelector(".calender"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    calendarPopup = document.getElementById("calendarPopup");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Enhanced event data
const eventData = {
    "2025-07-26": ["Team Meeting @ 10am", "Project Deadline", "Birthday Party @ 7pm"],
    "2025-07-27": ["Doctor Appointment @ 3pm", "Dinner with friends @ 8pm"],
    "2025-07-28": ["Yoga class @ 7am", "Client call @ 2pm"],
    "2025-07-29": ["Dentist @ 11am", "Movie night @ 7pm"],
    "2025-07-30": ["Group Study Session", "Gym @ 6pm"],
    "2025-07-31": ["Pay rent", "Team lunch @ 1pm"],
    "2025-08-01": ["Weekend trip planning", "BBQ @ 6pm"],
    "2025-08-02": ["Beach day", "Concert @ 8pm"],
    "2025-08-03": ["Family brunch @ 11am", "Hiking trip"]
};

// Initialize calendar
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const nextDays = 7 - ((firstDayIndex + lastDate) % 7);

    date.innerHTML = `${months[month]} ${year}`;
    
    let days = "";

    // Previous month days
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    // Current month days
    for (let i = 1; i <= lastDate; i++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasEvent = eventData[dateKey] && eventData[dateKey].length > 0;
        const dot = hasEvent ? `<span class="event-dot"></span>` : "";
        
        // Check if it's today
        const isToday = 
            i === today.getDate() && 
            year === today.getFullYear() && 
            month === today.getMonth();
            
        const todayClass = isToday ? "today" : "";
        
        days += `<div class="day ${todayClass}" data-date="${dateKey}">${i}${dot}</div>`;
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;
    addDayClickListeners();
}

// Add click event listeners to days
function addDayClickListeners() {
    const days = document.querySelectorAll('.day:not(.prev-date):not(.next-date)');
    
    days.forEach(day => {
        day.addEventListener('click', () => {
            const dateKey = day.getAttribute('data-date');
            const dayNumber = day.textContent.trim();
            showEventsPopup(month, dayNumber, year, dateKey);
        });
    });
}

// Show events popup for a specific day
function showEventsPopup(month, day, year, dateKey) {
    const popupDate = document.getElementById('popup-date');
    const eventsContainer = document.getElementById('calendarEvents');
    
    popupDate.textContent = `${months[month]} ${day}, ${year}`;
    eventsContainer.innerHTML = '';
    
    // Clear previous classes
    eventsContainer.classList.remove('has-events', 'no-events');
    
    const events = eventData[dateKey];
    
    if (events && events.length > 0) {
        eventsContainer.classList.add('has-events');
        
        // Add close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-popup';
        closeBtn.innerHTML = '<i class="uil uil-times"></i>';
        closeBtn.addEventListener('click', () => {
            calendarPopup.style.display = 'none';
        });
        eventsContainer.appendChild(closeBtn);
        
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            
            // Improved time extraction - handles @, at, and proper am/pm
            let time = '';
            let title = event;
            const timeMatch = event.match(/(@|at)\s(\d{1,2}(:\d{2})?\s?(am|pm)?)/i);
            
            if (timeMatch) {
                // Clean up the time format
                time = timeMatch[2].trim();
                const ampm = timeMatch[4] || '';
                
                // Remove am/pm if already in the time string
                if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) {
                    time = time.replace(/am|pm/gi, '').trim();
                }
                
                // Combine time with am/pm if it exists
                time = time + (ampm ? ` ${ampm}` : '');
                title = event.replace(timeMatch[0], '').trim();
            }
            
            eventElement.innerHTML = `
                ${time ? `<div class="event-time">${time}</div>` : '<div class="event-time">All day</div>'}
                <div class="event-title">${title}</div>
            `;
            
            eventsContainer.appendChild(eventElement);
        });
    } else {
        eventsContainer.classList.add('no-events');
        eventsContainer.innerHTML = `
            <div class="no-events">
                <i class="uil uil-calendar-slash"></i>
                <p>No events scheduled</p>
            </div>
        `;
    }
    
    calendarPopup.style.display = 'block';
}
// Close popup when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.day') && !e.target.closest('#calendarPopup')) {
        calendarPopup.style.display = 'none';
    }
});

// Navigation functions
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

function gotoToday() {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
}

function gotoDate() {
    const dateArr = dateInput.value.split('/');
    
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    alert('Invalid date. Please use MM/YYYY format.');
}

// Event listeners
prev.addEventListener('click', prevMonth);
next.addEventListener('click', nextMonth);
todayBtn.addEventListener('click', gotoToday);
gotoBtn.addEventListener('click', gotoDate);

// Format date input
dateInput.addEventListener('input', (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, '');
    
    if (dateInput.value.length === 2 && !dateInput.value.includes('/')) {
        dateInput.value += '/';
    }
    
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);
    }
});

// Initialize the calendar
initCalendar();

// Notification popup toggle
const notificationIcon = document.querySelector('.notification');
const notificationPopup = document.querySelector('.notifications-popup');

notificationIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationPopup.style.display = notificationPopup.style.display === 'block' ? 'none' : 'block';
});

// Close notification popup when clicking outside
document.addEventListener('click', () => {
    notificationPopup.style.display = 'none';
});

// Prevent notification popup from closing when clicking inside it
notificationPopup.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Calendar popup toggle
const calendarIcon = document.querySelector('.calendar-icon');
const calendarPopupElement = document.querySelector('.calendar-popup');

calendarIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarPopupElement.style.display = calendarPopupElement.style.display === 'block' ? 'none' : 'block';
});

// Close calendar popup when clicking outside
document.addEventListener('click', () => {
    calendarPopupElement.style.display = 'none';
});

// Prevent calendar popup from closing when clicking inside it
calendarPopupElement.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Generate random posts on page load
document.addEventListener('DOMContentLoaded', function() {
    // Generate random likes and comments for existing posts
    document.querySelectorAll('.feed').forEach((feed, index) => {
        const likeCount = feed.querySelector('.liked-by p');
        const commentCount = feed.querySelector('.comments');
        
        if (likeCount) {
            const randomLikes = Math.floor(Math.random() * 100) + 50;
            likeCount.innerHTML = likeCount.innerHTML.replace(/\d+ others/, `${randomLikes} others`);
        }
        
        if (commentCount) {
            const randomComments = Math.floor(Math.random() * 30) + 10;
            commentCount.textContent = `View all ${randomComments} comments`;
        }
    });
    
    // Add interactive like buttons
    document.querySelectorAll('.uil-heart').forEach(heart => {
        heart.addEventListener('click', function() {
            this.classList.toggle('liked');
            if (this.classList.contains('liked')) {
                this.style.color = 'var(--color-danger)';
            } else {
                this.style.color = '';
            }
        });
    });
});

// Auto-update notification count every minute
setInterval(() => {
    const notificationCount = document.querySelector('.notification-count');
    const currentCount = parseInt(notificationCount.textContent);
    if (currentCount < 15) {
        const newCount = currentCount + Math.floor(Math.random() * 3);
        notificationCount.textContent = newCount > 9 ? '9+' : newCount;
    }
}, 60000);

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior

            const target = item.getAttribute('data-target');
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show the selected section
            document.getElementById(target).classList.add('active');

            // Update active menu item
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            item.classList.add('active');

            // (Optional) Load content dynamically (e.g., fetch posts for Discover)
            if (target === 'discover') {
                loadDiscoverContent();
            }
        });
    });
});

// Optional: Fetch Discover content dynamically
function loadDiscoverContent() {
    fetch('/api/discover')
        .then(res => res.json())
        .then(data => {
            document.getElementById('discover').innerHTML = `
                <div class="discover-grid">
                    ${data.posts.map(post => `
                        <div class="discover-item">
                            <img src="${post.image}">
                            <div class="item-overlay">
                                <span><i class="uil uil-heart"></i> ${post.likes}</span>
                                <span><i class="uil uil-comment"></i> ${post.comments}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        })
        .catch(err => console.error("Error loading discover content:", err));
}

// Enhanced JavaScript with better event handling
const profileDropdown = document.getElementById('profileDropdown');
const dropdownMenu = profileDropdown.querySelector('.profile-dropdown');

// Toggle dropdown
profileDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

// Close when clicking outside
document.addEventListener('click', function() {
    dropdownMenu.classList.remove('show');
});

// Close when pressing ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        dropdownMenu.classList.remove('show');
    }
});

// Add this to your myFeed.js
document.addEventListener('DOMContentLoaded', function() {
    // Friend request handling
    const acceptButtons = document.querySelectorAll('.accept-btn');
    const declineButtons = document.querySelectorAll('.decline-btn');
    const toastContainer = document.getElementById('toastContainer');
    const friendRequestsContainer = document.querySelector('.friend-requests');
    acceptButtons.forEach(button => {
        button.addEventListener('click', function() {
            const request = this.closest('.request');
            const userName = request.querySelector('h5').textContent;
            
            // Remove the request
            request.remove();
            
            // Update badge count
            updateRequestCount();
            
            // Show toast notification
            showToast(`You are now friends with ${userName}!`, 'success');
        });
    });
    
    declineButtons.forEach(button => {
        button.addEventListener('click', function() {
            const request = this.closest('.request');
            
            // Remove the request
            request.remove();
            
            // Update badge count
            updateRequestCount();
            
            // Optional: Show declined notification
            showToast('Request declined', 'info');
        });
    });
    
    function updateRequestCount() {
        const badge = document.querySelector('.badge');
        const remainingRequests = document.querySelectorAll('.request').length;
        badge.textContent = `(${remainingRequests})`;
        
        if (remainingRequests === 0) {
            badge.style.display = 'none';
        }
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="uil uil-check-circle"></i> ${message}`;
        toastContainer.appendChild(toast);
        
        // Remove toast after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});


// post sharing 

document.addEventListener('DOMContentLoaded', function() {
    // Post creation modal functionality
    const postModal = document.getElementById('postModal');
    const createBtn = document.querySelector('.btn-primary'); // Your create button
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const shareBtn = document.querySelector('.share-btn');
    const postTypeBtns = document.querySelectorAll('.post-type-btn');
    const eventDetails = document.getElementById('eventDetails');
    const imageUpload = document.querySelector('.image-upload');
    const postImageInput = document.getElementById('postImage');
    const postTagsInput = document.getElementById('postTags');
    const tagCount = document.querySelector('.tag-count');
    
    // Show modal when Create button is clicked
    createBtn.addEventListener('click', function() {
        postModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    function closeModal() {
        postModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Post type switching
    postTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            postTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.type === 'event') {
                eventDetails.style.display = 'block';
            } else {
                eventDetails.style.display = 'none';
            }
        });
    });
    
    // Image upload handling
    imageUpload.addEventListener('click', function() {
        postImageInput.click();
    });
    
    postImageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // Create image preview if it doesn't exist
                let preview = imageUpload.querySelector('.image-preview');
                if (!preview) {
                    preview = document.createElement('img');
                    preview.className = 'image-preview';
                    imageUpload.innerHTML = '';
                    imageUpload.appendChild(preview);
                }
                
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Tag validation
    postTagsInput.addEventListener('input', function() {
        const tags = this.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        tagCount.textContent = `${tags.length}/5 tags`;
        
        // Enable share button only if there are at least 5 tags and an image is selected
        const hasImage = postImageInput.files && postImageInput.files.length > 0;
        shareBtn.disabled = !(tags.length >= 5 && hasImage);
    });
    
    // Share button functionality
    shareBtn.addEventListener('click', function() {
        // Get all form values
        const postType = document.querySelector('.post-type-btn.active').dataset.type;
        const caption = document.getElementById('postCaption').value;
        const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        const imageFile = postImageInput.files[0];
        
        let eventData = null;
        if (postType === 'event') {
            eventData = {
                title: document.getElementById('eventTitle').value,
                date: document.getElementById('eventDate').value,
                location: document.getElementById('eventLocation').value
            };
        }
        
        // Here you would normally send this data to your backend
        // For this example, we'll just show a success message
        showToast('Post shared successfully!', 'success');
        
        // Close the modal and reset form
        closeModal();
        resetForm();
        
        // In a real app, you would add the new post to the feed here
    });
    
    function resetForm() {
        document.getElementById('postCaption').value = '';
        document.getElementById('postTags').value = '';
        tagCount.textContent = '0/5 tags';
        postImageInput.value = '';
        document.querySelector('.image-upload').innerHTML = `
            <i class="uil uil-image-upload"></i>
            <p>Drag photos and videos here or click to browse</p>
        `;
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventLocation').value = '';
        document.querySelector('.post-type-btn[data-type="general"]').click();
        shareBtn.disabled = true;
    }
// Unified Toast Notification System
function showToast(message, type = 'success') {
    // Create or find toast container
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add appropriate icon
    const icons = {
        success: 'uil-check-circle',
        error: 'uil-times-circle',
        info: 'uil-info-circle'
    };
    toast.innerHTML = `<i class="uil ${icons[type] || icons.success}"></i> ${message}`;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after delay
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
    // Drag and drop for image upload
    imageUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0f0f0';
    });
    
    imageUpload.addEventListener('dragleave', function() {
        this.style.backgroundColor = '#fafafa';
    });
    
    imageUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#fafafa';
        
        if (e.dataTransfer.files.length) {
            postImageInput.files = e.dataTransfer.files;
            const event = new Event('change');
            postImageInput.dispatchEvent(event);
        }
    });
});


// Handle login/signup button clicks
document.querySelector('.btn-login').addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.querySelector('.btn-primary').addEventListener('click', () => {
    window.location.href = 'register.html';
});

document.addEventListener('DOMContentLoaded', function() {
            const signupModal = document.getElementById('signupModal');
            const closeModal = document.getElementById('closeModal');
            const calendarIcon = document.getElementById('calendar-icon');
            const notificationIcon = document.getElementById('notification');
            
            function showModal() {
                signupModal.classList.add('active');
            }
            
            function hideModal() {
                signupModal.classList.remove('active');
            }
            
            // Event listeners
            if (calendarIcon) {
                calendarIcon.addEventListener('click', showModal);
            }
            
            if (notificationIcon) {
                notificationIcon.addEventListener('click', showModal);
            }
            
            if (closeModal) {
                closeModal.addEventListener('click', hideModal);
            }
            
            // Close modal when clicking outside
            if (signupModal) {
                signupModal.addEventListener('click', function(e) {
                    if (e.target === signupModal) {
                        hideModal();
                    }
                });
            }
        });

// Get references to DOM elements
const tripForm = document.getElementById('trip-form');
const itineraryForm = document.getElementById('itinerary-form');
const tripSelect = document.getElementById('trip-select');
const itineraryList = document.getElementById('itinerary-items');

// Handle trip creation
tripForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const tripName = document.getElementById('trip-name').value.trim();

    if (!tripName) {
        alert("Please enter a trip name.");
        return;
    }

    // Check if trip already exists
    if (!document.getElementById(`trip-${tripName}`)) {
        const tripContainer = document.createElement('div');
        tripContainer.classList.add('trip-item');
        tripContainer.id = `trip-${tripName}`;
        tripContainer.innerHTML = `
            <div class="trip-name">
                <span>${tripName}</span>
                <button class="delete-trip">Delete Trip</button>
            </div>
            <div class="trip-details" style="display: none;">
                <ul class="day-list"></ul>
            </div>
        `;
        itineraryList.appendChild(tripContainer);

        // Add trip to dropdown
        const option = document.createElement('option');
        option.value = tripName;
        option.textContent = tripName;
        tripSelect.appendChild(option);
    }

    // Clear input field
    document.getElementById('trip-name').value = '';
});

// Handle adding activities
itineraryForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const selectedTrip = tripSelect.value;
    const day = document.getElementById('day').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const activity = document.getElementById('activity').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value || 'N/A';

    if (!selectedTrip || !day || !destination || !activity || !date) {
        alert("Please fill in all required fields!");
        return;
    }

    // Find the correct trip container
    const tripContainer = document.getElementById(`trip-${selectedTrip}`);
    if (!tripContainer) {
        alert("Trip not found! Please create a trip first.");
        return;
    }

    // Ensure trip details are visible
    const tripDetails = tripContainer.querySelector('.trip-details');
    tripDetails.style.display = 'block';

    // Find or create the day container inside the trip
    let dayList = tripContainer.querySelector('.day-list');
    let dayContainer = dayList.querySelector(`[data-day="${day}"]`);

    if (!dayContainer) {
        dayContainer = document.createElement('li');
        dayContainer.setAttribute('data-day', day);
        dayContainer.innerHTML = `<strong>Day ${day}:</strong> <ul class="activity-list"></ul>`;
        dayList.appendChild(dayContainer);
    }

    // Add the activity under the correct day
    const activityItem = document.createElement('li');
    activityItem.classList.add('activity-item');
    activityItem.innerHTML = `
        <em>${destination} - ${activity}</em> <br>
        <small>${date} at ${time}</small> <br>

        <!-- Visited checkbox -->
        <div class="checkbox-label">
            <input type="checkbox" class="visited-checkbox">
            <label>Visited</label>
        </div>

        <!-- Notes (Hidden by Default) -->
        <div class="notes" style="display: none;">
            <label>Special Moments/Notes:</label>
            <textarea placeholder="Write your special moments here..."></textarea>
        </div>

        <!-- Delete button -->
        <button class="delete-btn">Delete</button>
    `;

    dayContainer.querySelector('.activity-list').appendChild(activityItem);

    console.log(`Activity added under: Trip: ${selectedTrip}, Day: ${day}`);
    console.log(tripContainer.innerHTML); // Debugging log

    // Reset form fields
    itineraryForm.reset();
});

// Handle trip expand/collapse
itineraryList.addEventListener('click', function (event) {
    if (event.target.closest('.trip-name')) {
        const tripContainer = event.target.closest('.trip-item');
        const details = tripContainer.querySelector('.trip-details');
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
});

// Handle visited checkbox and show notes
itineraryList.addEventListener('change', function (event) {
    if (event.target.classList.contains('visited-checkbox')) {
        const notesSection = event.target.closest('.activity-item').querySelector('.notes');
        notesSection.style.display = event.target.checked ? 'block' : 'none';
    }
});

// Handle delete activity functionality
itineraryList.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
        event.target.closest('.activity-item').remove();
    }

    // Delete entire trip if "Delete Trip" button is clicked
    if (event.target.classList.contains('delete-trip')) {
        const tripContainer = event.target.closest('.trip-item');
        const tripName = tripContainer.id.replace("trip-", "");

        tripContainer.remove();

        // Remove from dropdown list
        [...tripSelect.options].forEach(option => {
            if (option.value === tripName) {
                option.remove();
            }
        });

        // Reset dropdown if no trips remain
        if (tripSelect.options.length === 1) {
            tripSelect.selectedIndex = 0;
        }
    }
});

// Function to scroll to "Create Trip" section
function scrollToItinerary() {
    const createTripSection = document.getElementById("create-trip-section");
    if (createTripSection) {
        createTripSection.scrollIntoView({ behavior: "smooth" });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    let userInfo = document.getElementById("user-info");
    let username = localStorage.getItem("loggedInUser");

    if (username) {
        userInfo.innerHTML = `<span>Welcome, ${username}</span> | <a href="#" onclick="logout()">Logout</a>`;
    }
});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.reload(); // Refresh the page to update navbar
}

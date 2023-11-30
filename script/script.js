// Add event listener for using current location button
document.getElementById('geoLocationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            fetchData(position.coords.latitude, position.coords.longitude);
        }, function() {
            showError('Geolocation is not supported by your browser, or permission was denied.');
        });
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

// Add event listener for custom location search button
document.getElementById('searchButton').addEventListener('click', function() {
    const customLocation = document.getElementById('customLocation').value;
    const [latitude, longitude] = customLocation.split(',');
    if (latitude && longitude) {
        fetchData(latitude.trim(), longitude.trim());
    } else {
        showError('Please enter a valid latitude and longitude in the format: lat,lng');
    }
});

// Add event listener for predefined location selection
document.getElementById('predefinedLocations').addEventListener('change', function() {
    const [latitude, longitude] = this.value.split(',');
    if (latitude && longitude) {
        fetchData(latitude, longitude);
    }
});

// Function to fetch data from the API for today and tomorrow
function fetchData(latitude, longitude) {
    const urlToday = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;
    const urlTomorrow = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow`;

    // Using Promise.all to fetch both today's and tomorrow's data concurrently
    Promise.all([
        fetch(urlToday).then(response => response.json()),
        fetch(urlTomorrow).then(response => response.json())
    ])
    .then(([dataToday, dataTomorrow]) => {
        // Check for API response errors
        if (dataToday.status !== 'OK' || dataTomorrow.status !== 'OK') {
            showError('Error fetching data from the API.');
            return;
        }

        updateDisplay('today', dataToday.results);
        updateDisplay('tomorrow', dataTomorrow.results);
    })
    .catch(error => {
        // Handle network or other fetch errors
        showError('An error occurred while fetching data: ' + error.message);
    });
}

// Function to update display with fetched data
function updateDisplay(day, data) {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = document.getElementById(`${day}${capitalizeFirstLetter(key)}`);
            if (element) {
                element.querySelector('.data-content').textContent = data[key] || 'Not available';
            }
        }
    }
}

// Function to display error messages
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'block';
    errorElement.textContent = message;

    // Optionally, clear previous data fields
    clearDataFields();
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to clear data fields (optional)
function clearDataFields() {
    document.querySelectorAll('.data-content').forEach(element => {
        element.textContent = 'Loading...';
    });
}
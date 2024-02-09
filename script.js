document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM content loaded");
    const ratingForm = document.getElementById('ratingForm');
    const ratingsList = document.getElementById('ratingsList');
    const currentRatingDisplay = document.getElementById('currentRatingDisplay');

    // Function to update current rating display
    function updateCurrentRatingDisplay(rating) {
        console.log("Updating current rating display:", rating);
        currentRatingDisplay.textContent = `Current Rating: ${rating}`;
    }

    // Fetch and display ratings on page load
    fetch('https://75c730f8-53f8-499c-91d9-ca7645db6cc1-00-3fpu232fzrkr8.sisko.replit.dev/api/ratings')
    .then(response => {
        console.log("Fetching ratings...");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(ratings => {
        console.log("Ratings fetched:", ratings);
        // Display ratings on the website
        ratingsList.innerHTML = '<h2>Ratings:</h2>';
        ratings.forEach(rating => {
            ratingsList.innerHTML += `<p>Name: ${rating.name}, Rating: ${rating.value}</p>`;
        });
    })
    .catch(error => console.error('Error fetching ratings:', error));

    // Update current rating display when user selects a rating
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log("Rating selected:", this.value);
            updateCurrentRatingDisplay(this.value);
        });
    });

    // Submit rating
    ratingForm.addEventListener('submit', event => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const rating = document.querySelector('input[name="rating"]:checked');

        if (!rating) {
            console.error("No rating selected");
            return;
        }

        console.log("Submitting rating...");
        fetch('https://75c730f8-53f8-499c-91d9-ca7645db6cc1-00-3fpu232fzrkr8.sisko.replit.dev/api/rate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, value: rating.value }),
        })
        .then(response => {
            console.log("Response received:", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            ratingsList.innerHTML += `<p>Name: ${name}, Rating: ${rating.value}</p>`;
            ratingForm.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

const form = document.getElementById('applicationForm');

function checkAge(input) {
    const dob = new Date(input.value);
    if (isNaN(dob.getTime())) {
        alert("Please enter a valid date of birth.");
        input.value = "";
        return;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    if (age < 18) {
        alert("You must be 18 years or older.");
        input.value = "";
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('applicationForm');
    const messageElement = document.getElementById('message');

    // Check if there's a message to display
    if (messageElement && messageElement.innerText.trim() !== '') {
        messageElement.style.display = 'block'; // Show the message
        messageElement.classList.add('shake'); // Add shake animation

        // Hide the message after 3 seconds
        setTimeout(function () {
            messageElement.classList.add('hide'); // Hide with fade-out animation
        }, 3000);

        // Completely remove message after fade-out
        setTimeout(function () {
            messageElement.style.display = 'none';
            messageElement.innerText = '';
        }, 3500); // Ensure fade-out is complete
    }

    // Handle form submission
    form.addEventListener('submit', function () {
        if (sessionStorage) {
            sessionStorage.setItem('formSubmitted', 'true'); // Mark form as submitted
        }
    });

    // Clear message on page refresh
    if (sessionStorage && sessionStorage.getItem('formSubmitted') === 'true') {
        if (messageElement) {
            messageElement.style.display = 'none';
            messageElement.innerText = '';
        }
        sessionStorage.removeItem('formSubmitted'); // Reset the flag
    }
});

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


window.addEventListener('DOMContentLoaded', function() {
    const messageElement = document.getElementById('message');

    // If the message exists, trigger the shake animation
    if (messageElement && messageElement.innerText.trim() !== '') {
        messageElement.classList.add('shake'); // Start the shake animation

        // After 2 seconds (shake time), hide the message
        setTimeout(function() {
            messageElement.classList.add('hide'); // Hide the message after shaking
        }, 2000); // Adjust time if necessary
    }
});
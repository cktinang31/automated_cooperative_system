const form = document.getElementById('applicationForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    try {
        const response = await fetch('/mem_application', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            successMessage.style.display = 'block';
        } else {
            alert('Error submitting the application');
        }
    } catch (error) {
        console.error('Error submitting the application:', error);
        alert('Error submitting the application');
    }
});

function checkAge(input) {
    const dob = new Date(input.value); 
    const today = new Date(); 
    const age = today.getFullYear() - dob.getFullYear(); 
    const monthDiff = today.getMonth() - dob.getMonth(); 

   
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

   
    if (age < 18) {
        alert("You must be 18 years or older.");
        input.value = ""; 
    }
}
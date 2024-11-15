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
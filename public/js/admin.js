document.addEventListener('DOMContentLoaded', () => {
    const addUserBtn = document.querySelector('.add-user-btn');
    const modal = document.getElementById('addUserModal');
    const closeBtn = modal.querySelector('.close');

    addUserBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const userId = event.target.closest('.delete-btn').dataset.userId;
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`/delete_user/${userId}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        event.target.closest('.user-row').remove();
                    } else {
                        const errorMessage = await response.text();
                        alert(errorMessage);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user.');
                }
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const row = button.closest('.user-row');
            toggleVisibility(row.querySelectorAll('.fname-text, .lname-text, .email-text, .role-text, .edit-btn'), 'none');
            toggleVisibility(row.querySelectorAll('.fname-input, .lname-input, .email-input, .role-dropdown, .save-btn'), 'inline');
        });
    });

    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const row = button.closest('.user-row');
            const userId = row.dataset.userId;

            const formData = new FormData();
            formData.set('user_id', userId);
            formData.set('fname', row.querySelector('.fname-input').value);
            formData.set('lname', row.querySelector('.lname-input').value);
            formData.set('email', row.querySelector('.email-input').value);
            formData.set('role', row.querySelector('.role-dropdown').value);

            try {
                const response = await fetch(`/edit_user/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-HTTP-Method-Override': 'PUT'
                    },
                    body: JSON.stringify(Object.fromEntries(formData.entries()))
                });

                if (!response.ok) throw new Error(await response.text());

                const data = await response.json();
                row.querySelector('.fname-text').textContent = data.fname;
                row.querySelector('.lname-text').textContent = data.lname;
                row.querySelector('.email-text').textContent = data.email;
                row.querySelector('.role-text').textContent = data.role;

                toggleVisibility(row.querySelectorAll('.fname-input, .lname-input, .email-input, .role-dropdown, .save-btn'), 'none');
                toggleVisibility(row.querySelectorAll('.fname-text, .lname-text, .email-text, .role-text, .edit-btn'), 'inline');
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating user details: ' + error.message);
            }
        });
    });
});

function toggleVisibility(elements, displayStyle) {
    elements.forEach(element => {
        element.style.display = displayStyle;
    });
}
function openModal(id, type, fname, lname, mname, details,
    amount, loanType, interest, date, dob, pob, address, email, 
    contact, user_id, mode, loanterm, monthlypayments, numberofpayments,application_status) {
    console.log({
        id, type, fname, lname, details, amount, loanType, 
        interest, date, dob, pob, address, email, contact, user_id, 
        mode, loanterm, monthlypayments, numberofpayments, application_status,
    });


    if (type === 'Loan Application') {
        console.log("Opening modal for request ID:", id);
        document.getElementById('loan-modal-name').innerText = details;
        document.getElementById('loan-modal-userid').innerText = user_id;  
        document.getElementById('loan-modal-loanType').innerText = loanType; 
        document.getElementById('loan-modal-amount').innerText = amount + ' PHP'; 
        document.getElementById('loan-modal-interest').innerText = interest + '%'; 
        document.getElementById('loan-modal-term').innerText = loanterm; 
        document.getElementById('loan-modal-monthlyPayment').innerText = monthlypayments; 
        document.getElementById('loan-modal-numPayments').innerText = numberofpayments; 
        document.getElementById('application-id').value = id;

        document.getElementById('loanModal').style.display = 'block'; 
    } else if (type === 'Savings Transaction') {
        console.log("Opening modal for request ID:", id);
        document.getElementById('savings-modal-name').innerText = `${fname} ${lname}`;
        document.getElementById('savings-modal-requestType').innerText = 'Savings';
        document.getElementById('savings-modal-amount').innerText = amount + ' PHP';
        document.getElementById('savings-modal-modeOfPayment').innerText = details;
        document.getElementById('application-id').value = id;

        document.getElementById('savingsModal').style.display = 'block';
    } else if (type === 'CBU Transaction') {
            console.log("Opening modal for request ID:", id);
            document.getElementById('cbu-modal-name').innerText = `${fname} ${lname}`;
            document.getElementById('cbu-modal-requestType').innerText = 'CBU';
            document.getElementById('cbu-modal-amount').innerText = amount + ' PHP';
            document.getElementById('cbu-modal-modeOfPayment').innerText = details; 
            document.getElementById('application-id').value = id;
            document.getElementById('cbuModal').style.display = 'block';

    } else if (type === 'Application') {
        console.log("Opening modal for request ID:", id);
        document.getElementById('modal-fname').innerText = fname;
        document.getElementById('modal-lname').innerText = lname;
        document.getElementById('modal-mname').innerText = mname; 
        document.getElementById('modal-dob').innerText = dob || 'N/A';
        document.getElementById('modal-pob').innerText = pob || 'N/A';
        document.getElementById('modal-address').innerText = address || 'N/A';
        document.getElementById('modal-email').innerText = email || 'N/A';
        document.getElementById('modal-contact').innerText = contact || 'N/A';
        
        document.getElementById('modal-contact').innerText = application_status || 'N/A';
        document.getElementById('modal-contact').innerText = id || 'N/A';
        document.getElementById('myModal').style.display = 'block';
                
        var formAction = "/mem_application_update/" + id; 
        console.log('Form action:', formAction); 
        document.getElementById("updateForm").action = formAction;

        document.getElementById("id").value = id; 
        
        document.querySelector('.approve-button').addEventListener('click', () => updateApplicationStatus('approved'));
        document.querySelector('.decline-button').addEventListener('click', () => updateApplicationStatus('decline'));

async function updateApplicationStatus(status) {
    const applicationId = document.getElementById('id').value;
    console.log('Application ID:', applicationId); 
    
    const url = `/mem_application_update/${applicationId}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ application_status: status })
        });

        console.log('Response Status:', response.status); 
        const result = await response.text();
        console.log('Response Body:', result); 
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log(`Application ${status}:`, result);
        document.getElementById('myModal').style.display = 'none';
        window.location.reload();
    } catch (error) {
        console.error('Error updating application status:', error);
    }
}
    }
}

function handleApproval(status) {
    const applicationId = document.getElementById('application-id').value;
    const url = '/update_loan_request';

    if (!applicationId) {
        alert('Application ID is missing.');
        return;
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            application_id: applicationId,
            application_status: status
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        alert(`Loan application ${status}: ${data}`);
        closeLoanModal();
        window.location.reload();
    })
    .catch(error => {
        console.error('Error updating loan status:', error);
        alert('Error updating loan status. Please try again.');
    });
}
    

document.querySelector('#savingsModal').addEventListener('click', (e) => {

if (e.target.classList.contains('approve-button') || e.target.classList.contains('decline-button')) {

    const status = e.target.classList.contains('approve-button') ? 'approved' : 'declined';
    const savtransactionId = document.getElementById('application-id').value;

    console.log('Button clicked:', status); 
    console.log('Transaction ID:', savtransactionId); 

    e.preventDefault();

    fetch(`/update_savings_request/${savtransactionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            savtransaction_id: savtransactionId,
            status: status
        })
    })
    .then(response => {
        console.log('Response status:', response.status); 
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        alert(data.message);
        closeSavingsModal();
        location.reload(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the request.');
    });
}
});


const approveCBUTransaction = async () => {
        const cbuTransactionId = document.getElementById('application-id').value;
        try {
            const response = await fetch(`/update_cbu_request/${cbuTransactionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'approved',  
                }),
            });

            if (response.ok) {
                alert('CBU transaction approved successfully!');
                location.reload(); 
            } else {
                alert('Failed to approve CBU transaction');
            }
        } catch (error) {
            console.error('Error approving CBU transaction:', error);
            alert('Error approving CBU transaction');
        }
    };

const declineCBUTransaction = async () => {
    const cbuTransactionId = document.getElementById('application-id').value;
    if (!cbuTransactionId) {
        alert('Transaction ID is missing');
        return;
    }

    console.log('Declining CBU Transaction with ID:', cbuTransactionId);
    try {
        const response = await fetch(`/update_cbu_request/${cbuTransactionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'declined',
            }),
        });

        if (response.ok) {
            alert('CBU transaction declined successfully!');
            location.reload();
        } else {
            const errorText = await response.text();
            console.error('Server responded with error:', errorText);
            alert(`Failed to decline CBU transaction: ${errorText}`);
        }
    } catch (error) {
        console.error('Error declining CBU transaction:', error);
        alert('Error declining CBU transaction');
    }
};


    function closeModal() {
        document.getElementById('myModal').style.display = 'none';
    }

    function closeLoanModal() {
        document.getElementById('loanModal').style.display = 'none';
    }

    function closeSavingsModal() {
        document.getElementById('savingsModal').style.display = 'none';
    }

    function closeCBUModal() {
        document.getElementById('cbuModal').style.display = 'none';
    }

    // Close modals when clicking outside of them
    window.onclick = function(event) {
        const modals = ['myModal', 'loanModal', 'savingsModal', 'cbuModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };
const container = document.querySelector('.container');
const LoginLink = document.querySelector('.SignInLink');
const RegisterLink = document.querySelector('.SignUpLink');

RegisterLink.addEventListener('click', () => {
    container.classList.add('active');
});

LoginLink.addEventListener('click', () => {
    container.classList.remove('active');
});


function togglePasswordVisibility(inputId, iconElement) {
  const passwordInput = document.getElementById(inputId); 
  const icon = iconElement; 
  
  // Toggle the password visibility
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';  
      icon.classList.remove('bxs-lock-alt'); 
      icon.classList.add('bxs-lock');  
  } else {
      passwordInput.type = 'password'; 
      icon.classList.remove('bxs-lock');  
      icon.classList.add('bxs-lock-alt');  
  }
}

  document.getElementById('registrationForm').addEventListener('submit', function(event) {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const passwordError = document.getElementById('password-error');
  const confirmError = document.getElementById('confirm-error');

  // Regular expression to validate password
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Validate password
  if (!passwordPattern.test(password)) {
      passwordError.style.display = 'block';
      confirmError.style.display = 'none';
      event.preventDefault(); // Prevent form submission
  } else {
      passwordError.style.display = 'none';
      
      // Validate confirm password
      if (password !== confirmPassword) {
          confirmError.style.display = 'block';
          event.preventDefault(); // Prevent form submission
      } else {
          confirmError.style.display = 'none';
          alert("Passwords match and are valid!");
      }
  }
});

function showError() {
    var errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('show'); 
    errorMessage.classList.remove('fade-out'); 
  
    setTimeout(function() {
      errorMessage.classList.add('fade-out');
    }, 500); 
  
   
    document.getElementById('login-form').addEventListener('submit', function(event) {
      if (isValidCredentials()) {
        errorMessage.classList.remove('show');
      }
    });
  }
  showError();
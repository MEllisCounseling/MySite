// DOM Elements
const modal = document.getElementById('locationModal');
const closeBtn = document.querySelector('.close');

// Show location modal
function showLocation() {
    modal.style.display = 'block';
}

// Close modal when clicking the X
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Smooth scrolling for learn more button
document.querySelector('.hero-cta').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.booking-section').scrollIntoView({
        behavior: 'smooth'
    });
});

// Form submission handling (for future contact forms)
function handleFormSubmission(formData) {
    // This will be used for Airtable integration
    console.log('Form data:', formData);
    
    // Send to Airtable
    if (window.AIRTABLE_CONFIG) {
        submitToAirtable(formData);
    }
}

// Airtable integration function
async function submitToAirtable(data) {
    try {
        const response = await fetch('/.netlify/functions/airtable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showSuccessMessage('Thank you for your message! We will get back to you soon.');
        } else {
            showErrorMessage('There was an error sending your message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('There was an error sending your message. Please try again.');
    }
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1001;
        font-weight: 500;
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1001;
        font-weight: 500;
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add scroll effects
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scroll = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            if (scroll > (sectionTop - windowHeight + 100)) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Initialize sections with fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});
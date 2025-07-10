// DOM Elements
const modal = document.getElementById('locationModal');
const consultationModal = document.getElementById('consultationModal');
const closeBtn = document.querySelector('.close');

// Show location modal
function showLocation() {
    modal.style.display = 'block';
}

// Show consultation form modal
function showConsultationForm() {
    consultationModal.style.display = 'block';
}

// Hide consultation form modal
function hideConsultationForm() {
    consultationModal.style.display = 'none';
    // Reset form
    document.getElementById('consultationForm').reset();
    document.getElementById('formMessage').textContent = '';
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
    if (event.target === consultationModal) {
        hideConsultationForm();
    }
});

// Smooth scrolling for learn more button
document.querySelector('.hero-cta').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.booking-section').scrollIntoView({
        behavior: 'smooth'
    });
});

// Handle consultation form submission
async function submitConsultationForm(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const form = document.getElementById('consultationForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formMessage.textContent = '';
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        preferredTime: formData.get('preferredTime'),
        type: 'Consultation Request'
    };
    
    try {
        const response = await fetch('/.netlify/functions/airtable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Form submission successful:', result);
            formMessage.style.color = '#27ae60';
            formMessage.textContent = 'Thank you! I will contact you within 24 hours to schedule your consultation.';
            form.reset();
            
            // Hide modal after 3 seconds
            setTimeout(() => {
                hideConsultationForm();
            }, 3000);
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Form submission failed:');
            console.error('- Status:', response.status);
            console.error('- Response:', errorData);
            
            formMessage.style.color = '#e74c3c';
            formMessage.textContent = `Error ${response.status}: ${errorData.details || 'Submission failed'}`;
            throw new Error(`Submission failed with status ${response.status}`);
        }
    } catch (error) {
        console.error('=== CLIENT ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
        if (!formMessage.textContent.includes('Error')) {
            formMessage.style.color = '#e74c3c';
            formMessage.textContent = 'There was an error submitting your request. Check console for details.';
        }
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
    }
}

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
// DOM Elements - will be initialized after DOM loads
let modal, consultationModal, closeBtn;

// Show location modal
function showLocation() {
    modal.style.display = 'block';
}

// Show consultation form modal
function showConsultationForm() {
    const modal = consultationModal || document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Hide consultation form modal
function hideConsultationForm() {
    const modal = consultationModal || document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        const form = document.getElementById('consultationForm');
        const message = document.getElementById('formMessage');
        if (form) form.reset();
        if (message) message.textContent = '';
    }
}

// Event listeners will be set up in DOMContentLoaded

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

// Copy address to clipboard
function copyAddress() {
    const address = '1220 Amherst Street, Floor 2, Winchester, VA 22601';
    navigator.clipboard.writeText(address).then(() => {
        showSuccessMessage('Address copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccessMessage('Address copied to clipboard!');
    });
}

// Open navigation app
function openNavigation() {
    const address = '1220 Amherst Street, Floor 2, Winchester, VA 22601';
    const encodedAddress = encodeURIComponent(address);
    
    // Try to detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Try to open native maps app first
        window.open(`maps://maps.google.com/maps?daddr=${encodedAddress}`, '_system');
        // Fallback to Google Maps web
        setTimeout(() => {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
        }, 1000);
    } else {
        // Open Google Maps in new tab for desktop
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
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
    // Initialize DOM elements
    modal = document.getElementById('locationModal');
    consultationModal = document.getElementById('consultationModal');
    closeBtn = document.querySelector('.close');
    
    // Set up event listeners for all close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the parent modal and close it
            const parentModal = btn.closest('.modal');
            if (parentModal) {
                parentModal.style.display = 'none';
            }
        });
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
    const heroBtn = document.querySelector('.hero-cta');
    if (heroBtn) {
        heroBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.background-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
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
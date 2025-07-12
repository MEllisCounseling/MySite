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

// Toggle insurance fields visibility
function toggleInsuranceFields() {
    const hasInsurance = document.getElementById('hasInsurance').value;
    const insuranceFields = document.getElementById('insuranceFields');
    const insuranceInputs = insuranceFields.querySelectorAll('input, select');
    
    if (hasInsurance === 'yes') {
        insuranceFields.style.display = 'block';
        // Make insurance fields required
        insuranceInputs.forEach(input => {
            if (input.id === 'insuranceProvider' || input.id === 'memberId') {
                input.required = true;
            }
        });
    } else {
        insuranceFields.style.display = 'none';
        // Remove required attribute
        insuranceInputs.forEach(input => {
            input.required = false;
            input.value = '';
        });
    }
}

// Handle booking form submission
async function submitBookingForm(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const form = document.getElementById('consultationForm');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Scheduling...';
    formMessage.textContent = '';
    formMessage.className = 'form-message';
    
    // Get form data
    const formData = new FormData(form);
    
    // Validate required consent checkboxes
    const requiredConsents = ['hipaaConsent', 'treatmentConsent', 'communicationConsent'];
    for (const consent of requiredConsents) {
        if (!formData.get(consent)) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Please agree to all required consent forms.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Schedule Appointment';
            return;
        }
    }
    
    // Validate insurance fields if insurance is selected
    if (formData.get('hasInsurance') === 'yes') {
        if (!formData.get('insuranceProvider') || !formData.get('memberId')) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Please complete all required insurance information.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Schedule Appointment';
            return;
        }
    }
    
    // Prepare data for submission
    const data = {
        // Personal Information
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        fullName: `${formData.get('firstName')} ${formData.get('lastName')}`,
        dateOfBirth: formData.get('dateOfBirth'),
        gender: formData.get('gender'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        
        // Insurance Information
        hasInsurance: formData.get('hasInsurance'),
        insuranceProvider: formData.get('insuranceProvider') || 'N/A',
        memberId: formData.get('memberId') || 'N/A',
        groupNumber: formData.get('groupNumber') || 'N/A',
        subscriberName: formData.get('subscriberName') || 'Same as patient',
        
        // Appointment Information
        appointmentType: formData.get('appointmentType'),
        preferredDate: formData.get('preferredDate'),
        preferredTime: formData.get('preferredTime'),
        sessionFormat: formData.get('sessionFormat'),
        
        // Clinical Information
        reasonForVisit: formData.get('reasonForVisit'),
        previousTherapy: formData.get('previousTherapy') || 'Not specified',
        currentMedications: formData.get('currentMedications') || 'Not specified',
        additionalInfo: formData.get('additionalInfo') || 'None provided',
        
        // Emergency Contact
        emergencyContactName: formData.get('emergencyContactName'),
        emergencyContactRelation: formData.get('emergencyContactRelation'),
        emergencyContactPhone: formData.get('emergencyContactPhone'),
        
        // Consent Information
        hipaaConsent: formData.get('hipaaConsent') ? 'Yes' : 'No',
        treatmentConsent: formData.get('treatmentConsent') ? 'Yes' : 'No',
        communicationConsent: formData.get('communicationConsent') ? 'Yes' : 'No',
        insuranceConsent: formData.get('insuranceConsent') ? 'Yes' : 'No',
        
        // Metadata
        type: 'Direct Booking',
        submissionDate: new Date().toISOString(),
        status: 'Pending Confirmation'
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
            console.log('Booking submission successful:', result);
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Appointment request submitted successfully! I will contact you within 24 hours to confirm your appointment details and verify insurance coverage.';
            form.reset();
            
            // Hide modal after 5 seconds
            setTimeout(() => {
                hideConsultationForm();
            }, 5000);
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Booking submission failed:');
            console.error('- Status:', response.status);
            console.error('- Response:', errorData);
            
            formMessage.className = 'form-message error';
            formMessage.textContent = `Error ${response.status}: ${errorData.details || 'Booking submission failed. Please try again.'}`;
        }
    } catch (error) {
        console.error('=== BOOKING SUBMISSION ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
        formMessage.className = 'form-message error';
        formMessage.textContent = 'There was an error submitting your booking request. Please try again or call us directly.';
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Schedule Appointment';
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
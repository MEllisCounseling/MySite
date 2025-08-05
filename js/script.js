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
    submitBtn.textContent = 'Submitting...';
    formMessage.textContent = '';
    formMessage.className = 'form-message';
    
    // Get form data
    const formData = new FormData(form);
    
    // Validate required consent checkboxes with specific messaging - MINIMAL FORM VERSION
    const consentChecks = [
        { name: 'consultationConsent', label: 'consultation understanding' },
        { name: 'privacyConsent', label: 'privacy consent' },
        { name: 'communicationConsent', label: 'communication consent' }
    ];
    
    for (const consent of consentChecks) {
        if (!formData.get(consent.name)) {
            formMessage.className = 'form-message error';
            formMessage.textContent = `Please check the ${consent.label} checkbox to continue. All consent agreements are required.`;
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book Free Consultation';
            return;
        }
    }
    
    // Validate required fields with better messaging - ADDING FIELDS BACK SLOWLY
    const requiredFields = [
        { name: 'firstName', label: 'First Name' },
        { name: 'lastName', label: 'Last Name' },
        { name: 'email', label: 'Email Address' },
        { name: 'phone', label: 'Phone Number' },
        { name: 'city', label: 'City' },
        { name: 'state', label: 'State' }
    ];
    
    for (const field of requiredFields) {
        const value = formData.get(field.name);
        if (!value || value.trim() === '') {
            formMessage.className = 'form-message error';
            formMessage.textContent = `Please fill in the ${field.label} field.`;
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book Free Consultation';
            return;
        }
    }
    
    // Additional validation for optional fields with specific formats
    const zipCodeValue = formData.get('zipCode');
    if (zipCodeValue && (zipCodeValue.length !== 5 || !/^\d{5}$/.test(zipCodeValue))) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'ZIP Code must be exactly 5 digits (e.g., 12345).';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Free Consultation';
        return;
    }
    
    // Validate Reason For Visit selection
    const reasonForVisitValue = formData.get('reasonForVisit');
    if (!reasonForVisitValue || reasonForVisitValue.trim() === '') {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Please select a main area of interest from the dropdown.';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Free Consultation';
        return;
    }
    
    // Prepare data for submission - ONLY CURRENT FORM FIELDS
    const data = {
        // Personal Information - Required fields
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        city: formData.get('city'),
        state: formData.get('state'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        
        // Personal Information - Optional fields  
        dateOfBirth: formData.get('dateOfBirth') || '',
        address: formData.get('address') || '',
        zipCode: formData.get('zipCode') || '',
        
        // Consent Information
        consultationConsent: formData.get('consultationConsent') ? 'Yes' : 'No',
        communicationConsent: formData.get('communicationConsent') ? 'Yes' : 'No',
        privacyConsent: formData.get('privacyConsent') ? 'Yes' : 'No',
        
        // BATCH 4: Additional form fields
        gender: formData.get('gender') || '',
        appointmentType: formData.get('appointmentType') || '',
        reasonForVisit: formData.get('reasonForVisit') || '',
        
        // BATCH 5: Status and metadata fields (auto-filled, no form fields needed)
        status: 'Pending Confirmation',
        additionalInfo: formData.get('additionalInfo') || '',
        
        // BATCH 6: Scheduling and format preferences
        preferredDate: formData.get('preferredDate') || '',
        preferredTime: formData.get('preferredTime') || '',
        sessionFormat: formData.get('sessionFormat') || ''
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
            formMessage.textContent = '✅ Free consultation request submitted successfully! I will contact you within 24 hours to schedule your 15-minute consultation.';
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            form.reset();
            
            // Hide modal after 8 seconds to give user time to read message
            setTimeout(() => {
                hideConsultationForm();
            }, 8000);
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Booking submission failed:');
            console.error('- Status:', response.status);
            console.error('- Response:', errorData);
            console.error('- Full error details:', JSON.stringify(errorData, null, 2));
            
            formMessage.className = 'form-message error';
            let errorMessage = '❌ Unable to submit your consultation request. ';
            
            if (response.status === 500) {
                if (errorData.error && errorData.error.includes('configuration missing')) {
                    errorMessage += 'Configuration issue detected. Please contact us directly at (540) 431-7376.';
                } else {
                    errorMessage += 'There was a server error. Please try again in a few minutes or contact us directly at (540) 431-7376.';
                }
            } else if (response.status === 422) {
                errorMessage += 'There was an issue with the form data. Please check all fields and try again.';
            } else if (response.status === 429) {
                errorMessage += 'Too many requests. Please wait a moment and try again.';
            } else if (response.status === 401) {
                errorMessage += 'Authentication error. Please contact us directly at (540) 431-7376.';
            } else {
                errorMessage += `Please try again or contact us directly at (540) 431-7376. Error: ${response.status}`;
            }
            
            // Add debug info in development
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('netlify')) {
                console.log('Debug: Check Netlify function logs for detailed error information');
                console.log('Debug: Verify environment variables: AIRTABLE_API_KEY, THERAPY_BASE, AIRTABLE_TABLE_NAME');
                console.log('Debug: Check Airtable field names match exactly');
            }
            
            formMessage.textContent = errorMessage;
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } catch (error) {
        console.error('=== BOOKING SUBMISSION ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
        formMessage.className = 'form-message error';
        formMessage.textContent = '❌ Network error: Unable to submit your consultation request. Please check your internet connection and try again, or contact us directly at (540) 431-7376.';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Free Consultation';
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

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling with offset for fixed nav
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = window.innerWidth <= 768 ? 90 : 80; // More offset for mobile
                const offsetTop = targetSection.offsetTop - navHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section, header, footer');
        const scrollPos = window.scrollY + 100; // Offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link
    updateActiveNavLink();
}

// Initialize date validation
function initializeDateTimeValidation() {
    const dateInput = document.getElementById('preferredDate');
    
    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize date/time validation
    initializeDateTimeValidation();
    
    
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
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
        // Restore any saved form data
        restoreFormData();
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
    
    // Clear previous field highlights
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    
    // Comprehensive validation - collect ALL missing fields
    const missingFields = [];
    
    // Required form fields
    const requiredFields = [
        { name: 'firstName', label: 'First Name' },
        { name: 'lastName', label: 'Last Name' },
        { name: 'email', label: 'Email Address' },
        { name: 'phone', label: 'Phone Number' },
        { name: 'city', label: 'City' },
        { name: 'state', label: 'State' },
        { name: 'gender', label: 'Gender' },
        { name: 'reasonForVisit', label: 'Reason For Visit' },
        { name: 'preferredDate', label: 'Preferred Date' },
        { name: 'preferredTime', label: 'Preferred Time' }
    ];
    
    // Check regular form fields
    for (const field of requiredFields) {
        const value = formData.get(field.name);
        if (!value || value.trim() === '') {
            missingFields.push(field);
            // Highlight the missing field
            const fieldElement = document.getElementById(field.name);
            if (fieldElement) {
                const formGroup = fieldElement.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                }
            }
        }
    }
    
    // Check required consent checkboxes
    const consentChecks = [
        { name: 'consultationConsent', label: 'Consultation Understanding' },
        { name: 'privacyConsent', label: 'Privacy Consent' },
        { name: 'communicationConsent', label: 'Communication Consent' }
    ];
    
    for (const consent of consentChecks) {
        if (!formData.get(consent.name)) {
            missingFields.push(consent);
            // Highlight the missing checkbox's form group
            const fieldElement = document.getElementById(consent.name) || document.getElementById('privacyConsentWorking');
            if (fieldElement) {
                const formGroup = fieldElement.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                }
            }
        }
    }
    
    if (missingFields.length > 0) {
        formMessage.className = 'form-message error';
        if (missingFields.length === 1) {
            formMessage.textContent = `Please fill in the ${missingFields[0].label} field.`;
        } else {
            formMessage.textContent = `Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}.`;
        }
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Free Consultation';
        return;
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
    
    // Validate preferred date/time combination (must be at least 1 hour in the future)
    const preferredDate = formData.get('preferredDate');
    const preferredTime = formData.get('preferredTime');
    
    if (preferredDate && preferredTime) {
        const selectedDateTime = new Date(`${preferredDate} ${preferredTime}`);
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));
        
        if (selectedDateTime <= oneHourFromNow) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Please select a date and time that is at least one hour from now. This allows sufficient time for scheduling confirmation.';
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight both date and time fields
            const dateField = document.getElementById('preferredDate');
            const timeField = document.getElementById('preferredTime');
            if (dateField) {
                const dateGroup = dateField.closest('.form-group');
                if (dateGroup) dateGroup.classList.add('error');
            }
            if (timeField) {
                const timeGroup = timeField.closest('.form-group');
                if (timeGroup) timeGroup.classList.add('error');
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book Free Consultation';
            return;
        }
    }
    
    
    // Validate Date of Birth using dropdowns (optional field, but if provided must be valid)
    const birthMonth = formData.get('birthMonth');
    const birthYear = formData.get('birthYear');
    
    if ((birthMonth && birthMonth.trim() !== '') || (birthYear && birthYear.trim() !== '')) {
        // If one is filled, both must be filled
        if (!birthMonth || !birthYear || birthMonth.trim() === '' || birthYear.trim() === '') {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Please select both birth month and birth year, or leave both blank.';
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book Free Consultation';
            return;
        }
        
        // Age validation is built into the year dropdown (only goes up to 18 years ago)
        // so no additional age validation needed
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
        dateOfBirth: getDateOfBirthFromDropdowns(),
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
            
            // Clear saved form data since submission was successful
            clearSavedFormData();
            
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

// Initialize date validation and populate birth year dropdown
function initializeDateTimeValidation() {
    const today = new Date().toISOString().split('T')[0];
    
    // Set minimum date for preferred date to today
    const preferredDateInput = document.getElementById('preferredDate');
    if (preferredDateInput) {
        preferredDateInput.setAttribute('min', today);
    }
    
    // Populate birth year dropdown
    const birthYearSelect = document.getElementById('birthYear');
    if (birthYearSelect) {
        const currentYear = new Date().getFullYear();
        const eighteenYearDefault = currentYear - 18;
        
        // Add years from 100 years ago to 18 years ago
        for (let year = currentYear - 100; year <= currentYear - 18; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === eighteenYearDefault) {
                option.selected = true; // Default to 18 years ago
            }
            birthYearSelect.appendChild(option);
        }
    }
    
    // Set default birth month to January
    const birthMonthSelect = document.getElementById('birthMonth');
    if (birthMonthSelect) {
        birthMonthSelect.value = '01'; // Default to January
    }
}

// Helper function to get date of birth from dropdowns
function getDateOfBirthFromDropdowns() {
    const month = document.getElementById('birthMonth').value;
    const year = document.getElementById('birthYear').value;
    
    if (month && year) {
        return `${year}-${month}-01`; // Use first day of month
    }
    return '';
}

// Auto-save form data to localStorage
function saveFormData() {
    const form = document.getElementById('consultationForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const savedData = {};
    
    // Save all form field values
    for (const [key, value] of formData.entries()) {
        savedData[key] = value;
    }
    
    // Also save checkbox states (FormData only includes checked boxes)
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        savedData[checkbox.name] = checkbox.checked;
    });
    
    // Save dropdown selections that might be empty
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        if (!savedData[select.name]) {
            savedData[select.name] = select.value;
        }
    });
    
    localStorage.setItem('consultationFormData', JSON.stringify(savedData));
    console.log('Form data auto-saved:', Object.keys(savedData).length, 'fields');
    
    // Show save indicator briefly
    showAutoSaveIndicator();
}

// Restore form data from localStorage
function restoreFormData() {
    const savedData = localStorage.getItem('consultationFormData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        console.log('Restoring form data:', Object.keys(data).length, 'fields');
        
        // Restore regular input fields and selects
        Object.keys(data).forEach(fieldName => {
            const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
            if (field && data[fieldName] !== undefined && data[fieldName] !== null) {
                if (field.type === 'checkbox') {
                    field.checked = data[fieldName];
                } else {
                    field.value = data[fieldName];
                }
            }
        });
        
        // Update time options based on restored date
        if (data.preferredDate) {
            updateTimeOptions();
        }
        
        // Show notification if data was restored
        if (Object.keys(data).some(key => data[key] && data[key] !== '')) {
            showDataRestoredNotification();
        }
        
    } catch (error) {
        console.error('Error restoring form data:', error);
        // Clear corrupted data
        localStorage.removeItem('consultationFormData');
    }
}

// Clear saved form data
function clearSavedFormData() {
    localStorage.removeItem('consultationFormData');
    console.log('Saved form data cleared');
}

// Show auto-save indicator
function showAutoSaveIndicator() {
    const indicator = document.getElementById('autoSaveIndicator');
    if (indicator) {
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 1500); // Hide after 1.5 seconds
    }
}

// Show data restored notification
function showDataRestoredNotification() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'data-restored-notification';
    messageDiv.innerHTML = '🔄 Your previous form data has been restored';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #17a2b8;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1002;
        font-weight: 500;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Fade in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

// Debounced save function to prevent excessive localStorage writes
let saveTimeout;
function debouncedSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveFormData, 500); // Save after 500ms of no activity
}

// Set up auto-save event listeners
function setupAutoSave() {
    const form = document.getElementById('consultationForm');
    if (!form) return;
    
    // Auto-save on input changes (text fields, textareas)
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], textarea');
    inputs.forEach(input => {
        input.addEventListener('input', debouncedSave);
        input.addEventListener('blur', saveFormData); // Save immediately when field loses focus
    });
    
    // Auto-save on selection changes (dropdowns, checkboxes)
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', saveFormData); // Save immediately for selections
    });
    
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveFormData); // Save immediately for checkboxes
    });
    
    console.log('Auto-save enabled for', inputs.length + selects.length + checkboxes.length, 'form fields');
}

// Update time options based on selected date
function updateTimeOptions() {
    const preferredDateInput = document.getElementById('preferredDate');
    const preferredTimeSelect = document.getElementById('preferredTime');
    
    if (!preferredDateInput || !preferredTimeSelect) return;
    
    const selectedDate = preferredDateInput.value;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // All available time options
    const allTimeOptions = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
        '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
    ];
    
    // Clear current options except the first placeholder
    const currentValue = preferredTimeSelect.value;
    preferredTimeSelect.innerHTML = '<option value="">Select preferred time</option>';
    
    // If today is selected, filter out past times (need at least 1 hour from now)
    if (selectedDate === today) {
        const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));
        
        allTimeOptions.forEach(timeStr => {
            const testDateTime = new Date(`${selectedDate} ${timeStr}`);
            
            // Only add time if it's at least 1 hour from now
            if (testDateTime > oneHourFromNow) {
                const option = document.createElement('option');
                option.value = timeStr;
                option.textContent = timeStr;
                if (timeStr === currentValue) {
                    option.selected = true;
                }
                preferredTimeSelect.appendChild(option);
            }
        });
    } else {
        // For future dates, show all times
        allTimeOptions.forEach(timeStr => {
            const option = document.createElement('option');
            option.value = timeStr;
            option.textContent = timeStr;
            if (timeStr === currentValue) {
                option.selected = true;
            }
            preferredTimeSelect.appendChild(option);
        });
    }
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize date/time validation
    initializeDateTimeValidation();
    
    // Add event listener for date changes to update time options
    const preferredDateInput = document.getElementById('preferredDate');
    if (preferredDateInput) {
        preferredDateInput.addEventListener('change', updateTimeOptions);
        // Initial call to set up time options for today
        updateTimeOptions();
    }
    
    // Set up auto-save event listeners for form data persistence
    setupAutoSave();
    
    
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
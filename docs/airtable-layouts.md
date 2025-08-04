# Airtable Form Layouts Documentation

## Overview
Winchester Therapy Services uses Airtable as the backend database for collecting and managing form submissions from the website. This document outlines the current form field structures and data mappings.

## Environment Configuration
The Airtable integration requires these environment variables:
- `AIRTABLE_API_KEY`: Your Airtable API key
- `THERAPY_BASE`: Your Airtable base ID (also referenced as `AIRTABLE_BASE_ID`)
- `AIRTABLE_TABLE_NAME`: Your Airtable table name

## Form Type

### Free Consultation Booking Form  
**Files**: `index.html` (lines 93-261), `js/script.js` (lines 86-119)

#### Personal Information Section
| Airtable Field Name | HTML Field | Data Type | Required | Validation | Notes |
|---------------------|------------|-----------|----------|------------|-------|
| First Name | `firstName` | Text | Yes | Required | Client's first name |
| Last Name | `lastName` | Text | Yes | Required | Client's last name |
| Date Of Birth | `dateOfBirth` | Text | No | MM/DD/YYYY format | Date of birth (optional) |
| Gender | `gender` | Select | No | Options: male, female, other, "" | Gender identity |
| Address | `address` | Text | No | Optional text | Street address (optional) |
| City | `city` | Text | Yes | Required | City |
| State | `state` | Select | Yes | VA, MD, WV, DC | State selection |
| Zip Code | `zipCode` | Text | No | 5-digit pattern | ZIP code (optional) |
| Phone | `phone` | Tel | Yes | Required | Phone number |
| Email | `email` | Email | Yes | Email validation | Email address |

#### Consultation Preferences Section
| Airtable Field Name | HTML Field | Data Type | Required | Options | Notes |
|---------------------|------------|-----------|----------|---------|-------|
| Appointment Type | Static | Text | Auto | 'Free 15-Minute Consultation' | Fixed appointment type |
| Preferred Date | `preferredDate` | Date | Yes | Future dates only | Preferred consultation date |
| Preferred Time | `preferredTime` | Select | Yes | 9:00 AM - 6:00 PM slots | Time slot selection |
| Session Format | `sessionFormat` | Select | Yes | in-person, telehealth | Session delivery method |

#### Interest Information Section
| Airtable Field Name | HTML Field | Data Type | Required | Options | Notes |
|---------------------|------------|-----------|----------|---------|-------|
| Reason For Visit | `reasonForVisit` | Select | No | See options below | Main area of interest |
| Additional Information | `additionalInfo` | Long Text | No | Free text | Additional questions/info |

**Reason for Visit Options:**
- anxiety
- depression  
- relationship
- trauma
- grief
- stress
- life-transition
- family
- work
- self-esteem
- exploring
- other

#### Consent Information Section
| Airtable Field Name | HTML Field | Data Type | Required | Values | Notes |
|---------------------|------------|-----------|----------|--------|-------|
| Consultation Consent | `consultationConsent` | Checkbox | Yes | 'Yes'/'No' | 15-minute consultation understanding |
| Communication Consent | `communicationConsent` | Checkbox | Yes | 'Yes'/'No' | Contact permission |
| Privacy Consent | `privacyConsent` | Checkbox | Yes | 'Yes'/'No' | Privacy/confidentiality agreement |

#### Metadata Section
| Airtable Field Name | Data Source | Data Type | Required | Default Value | Notes |
|---------------------|-------------|-----------|----------|---------------|-------|
| Type | Static | Text | Auto | 'Free Consultation' | Form type identifier |
| Submitted | `new Date().toISOString()` | DateTime | Auto | Current timestamp | When form was submitted |
| Status | Static | Single Select | Auto | 'Pending Confirmation' | Consultation processing status |

**Status Field Options (Single Select):**
- **Pending Confirmation** - Initial status when form is submitted
- **Confirmed** - Appointment confirmed and scheduled
- **Completed** - Consultation finished
- **Cancelled** - Appointment cancelled
- **No Show** - Client didn't attend scheduled consultation

## Data Flow

### Form Submission Process
1. **Frontend**: HTML form in `index.html` collects user data
2. **JavaScript**: `js/script.js` handles form validation and submission
3. **Function**: `netlify/functions/airtable.js` processes data and sends to Airtable
4. **Backend**: Airtable stores the record and returns confirmation

### Consultation Management Workflow
1. **New Submission**: Record created with Status = "Pending Confirmation"
2. **Review**: You review the consultation request details
3. **Confirm**: Change Status to "Confirmed" 
4. **Automation**: Airtable automation triggers when Status changes to "Confirmed"
5. **Email**: Automatic confirmation email sent to client with appointment details
6. **Calendar**: Optional calendar integration via Airtable automations

### Field Mapping Logic
```javascript
// Consultation form mapping (script.js)
const data = {
    // Personal Information
    'First Name': formData.get('firstName'),
    'Last Name': formData.get('lastName'),
    'Date Of Birth': formData.get('dateOfBirth'),
    'Gender': formData.get('gender') || 'Not specified',
    'Address': formData.get('address'),
    'City': formData.get('city'),
    'State': formData.get('state'),
    'Zip Code': formData.get('zipCode'),
    'Phone': formData.get('phone'),
    'Email': formData.get('email'),
    
    // Consultation Preferences
    'Appointment Type': 'Free 15-Minute Consultation',
    'Preferred Date': formData.get('preferredDate'),
    'Preferred Time': formData.get('preferredTime'),
    'Session Format': formData.get('sessionFormat'),
    
    // Interest Information
    'Reason For Visit': formData.get('reasonForVisit') || 'Not specified',
    'Additional Information': formData.get('additionalInfo') || 'None provided',
    
    // Consent Information
    'Consultation Consent': formData.get('consultationConsent') ? 'Yes' : 'No',
    'Communication Consent': formData.get('communicationConsent') ? 'Yes' : 'No',
    'Privacy Consent': formData.get('privacyConsent') ? 'Yes' : 'No',
    
    // Metadata
    'Type': 'Free Consultation',
    'Submitted': new Date().toISOString(),
    'Status': 'Pending Confirmation'
};

// Airtable function processing (airtable.js)
const record = {
    fields: data  // Direct mapping of consultation form data
};
```

## Validation Rules

### Client-Side Validation
- **Required fields**: Enforced via HTML5 `required` attribute
- **Email format**: HTML5 email input validation
- **Date validation**: Minimum date set to today, past times disabled for same-day selections
- **ZIP code**: 5-digit pattern validation
- **Consent checkboxes**: All three consent checkboxes must be checked

### Server-Side Validation
- **Environment variables**: Validates presence of Airtable config
- **Request method**: Only accepts POST requests
- **JSON parsing**: Validates request body format
- **Airtable response**: Handles and logs API errors

## Error Handling

### Frontend Error Display
- Form validation errors shown inline
- Submission errors displayed in `formMessage` div
- Network errors trigger fallback messaging

### Backend Error Logging
- Comprehensive console logging for debugging
- Error details returned to frontend for user feedback
- Airtable API errors parsed and logged

## Security Considerations
- CORS headers configured for cross-origin requests
- HIPAA notice displayed on consultation form
- SSL/TLS encryption for data transmission
- Environment variables protect sensitive API keys

## Airtable Setup Recommendations

### Status Field Configuration
1. **Field Type**: Single Select
2. **Options**: Pending Confirmation, Confirmed, Completed, Cancelled, No Show
3. **Default**: Pending Confirmation
4. **Color Coding**: Use different colors for easy visual status tracking

### Automation Setup (Recommended)
**Trigger**: When Status field changes to "Confirmed"
**Actions**:
1. **Send Email**: 
   - To: Email field from the record
   - Subject: "Your consultation with Winchester Therapy Services is confirmed"
   - Include: Date, time, session format, office location/video link
2. **Optional Calendar Integration**:
   - Create Google Calendar event
   - Send calendar invitation to client
   - Add to your practice calendar

### View Recommendations
- **Pending View**: Filter by Status = "Pending Confirmation"
- **This Week**: Filter by Preferred Date = This week
- **Calendar View**: Group by Preferred Date and Preferred Time

## Future Considerations
- Form could be extended to support additional therapy types
- Consider implementing form analytics for conversion tracking
- Integration with practice management software
- SMS reminders via automation

---
*Last Updated: 2025-01-XX*
*Related Files: `netlify/functions/airtable.js`, `js/script.js`, `index.html`*
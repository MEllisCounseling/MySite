// Field Validation Script
// Run with: node validate-fields.js

const expectedFields = [
    // Personal Information
    'First Name',
    'Last Name', 
    'Date Of Birth',
    'Gender',
    'Address',
    'City',
    'State',
    'Zip Code',
    'Phone',
    'Email',
    
    // Consultation Preferences  
    'Appointment Type',
    'Preferred Date',
    'Preferred Time',
    'Session Format',
    
    // Interest Information
    'Reason For Visit',
    'Additional Information',
    
    // Consent Information
    'Consultation Consent',
    'Communication Consent',
    'Privacy Consent',
    
    // Metadata
    'Type',
    'Submitted',
    'Status'
];

const testData = {
    'First Name': 'Test',
    'Last Name': 'User', 
    'Date Of Birth': '01/15/1990',
    'Gender': 'female',
    'Address': '456 Test Avenue',
    'City': 'Winchester',
    'State': 'VA',
    'Zip Code': '22601',
    'Phone': '540-555-0199',
    'Email': 'test.user@example.com',
    'Appointment Type': 'Free 15-Minute Consultation',
    'Preferred Date': '2025-01-15',
    'Preferred Time': '10:30',
    'Session Format': 'in-person',
    'Reason For Visit': 'depression',
    'Additional Information': 'Test submission to verify field mappings',
    'Consultation Consent': 'Yes',
    'Communication Consent': 'Yes', 
    'Privacy Consent': 'Yes',
    'Type': 'Free Consultation',
    'Submitted': new Date().toISOString(),
    'Status': 'Pending Confirmation'
};

console.log('=== FIELD VALIDATION ===\n');

console.log('Expected Fields (' + expectedFields.length + '):');
expectedFields.forEach((field, index) => {
    console.log(`${index + 1}. ${field}`);
});

console.log('\n=== FIELD MAPPING CHECK ===\n');

let allFieldsPresent = true;
expectedFields.forEach(field => {
    if (testData.hasOwnProperty(field)) {
        console.log(`✅ ${field}: "${testData[field]}"`);
    } else {
        console.log(`❌ MISSING: ${field}`);
        allFieldsPresent = false;
    }
});

console.log('\n=== EXTRA FIELDS CHECK ===\n');
Object.keys(testData).forEach(field => {
    if (!expectedFields.includes(field)) {
        console.log(`⚠️  EXTRA FIELD: ${field}`);
    }
});

console.log('\n=== VALIDATION RESULT ===\n');
if (allFieldsPresent) {
    console.log('✅ All expected fields are present!');
    console.log('📄 Test data structure is valid for Airtable submission.');
} else {
    console.log('❌ Some fields are missing. Check the field mappings.');
}

console.log('\n=== AIRTABLE RECORD STRUCTURE ===\n');
const airtableRecord = {
    fields: testData
};

console.log('Record that will be sent to Airtable:');
console.log(JSON.stringify(airtableRecord, null, 2));

console.log('\n=== USAGE INSTRUCTIONS ===\n');
console.log('1. Make sure your Airtable base has columns with these EXACT names (case-sensitive)');
console.log('2. Set Status field as Single Select with options: Pending Confirmation, Confirmed, Completed, Cancelled, No Show');
console.log('3. Use the test-form-submission.sh script with your actual site URL to test');
console.log('4. Check Netlify function logs if submission fails');
// Minimal field test - only send basic fields that likely exist
// Replace the field mapping in netlify/functions/airtable.js temporarily with this:

const record = {
    fields: {
        'First Name': data.firstName || '',
        'Last Name': data.lastName || '',
        'Email': data.email || '',
        'Phone': data.phone || '',
        'City': data.city || '',
        'State': data.state || ''
        // Removed all potentially problematic fields
    }
};

// If this works, we know the basic setup is correct
// Then we can add fields one by one to find which ones are missing
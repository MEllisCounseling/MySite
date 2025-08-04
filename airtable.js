// Using built-in fetch (Node.js 18+) - Updated for production deployment

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('=== AIRTABLE FUNCTION START ===');
        console.log('Event body received:', event.body);
        
        // Parse the request body
        const data = JSON.parse(event.body);
        console.log('Parsed form data:', data);
        
        // Airtable configuration from environment variables
        const airtableApiKey = process.env.AIRTABLE_API_KEY;
        const airtableBaseId = process.env.THERAPY_BASE;
        const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

        console.log('Environment variables check:');
        console.log('- API Key exists:', !!airtableApiKey);
        console.log('- Base ID:', airtableBaseId);
        console.log('- Table Name:', airtableTableName);

        if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
            console.error('Missing environment variables:', {
                hasApiKey: !!airtableApiKey,
                hasBaseId: !!airtableBaseId,
                hasTableName: !!airtableTableName
            });
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Airtable configuration missing',
                    details: {
                        hasApiKey: !!airtableApiKey,
                        hasBaseId: !!airtableBaseId,
                        hasTableName: !!airtableTableName
                    }
                })
            };
        }

        // Prepare the record for Airtable - Map form fields to Airtable columns - ADDING FIELDS SLOWLY
        const record = {
            fields: {
                'First Name': data.firstName || '',
                'Last Name': data.lastName || '',
                'City': data.city || '',
                'State': data.state || '',
                'Phone': data.phone || '',
                'Email': data.email || '',
                // BATCH 2: Optional fields  
                'Date Of Birth': data.dateOfBirth || '',
                'Address': data.address || ''
            }
        };
        
        // Only add ZIP code if it exists and is valid
        if (data.zipCode && data.zipCode.toString().length === 5) {
            record.fields['Zip Code'] = data.zipCode;
        }
        
        // Still commented out - will add more fields gradually:
        // 'Gender': data.gender || 'Not specified',
        // 'Appointment Type': data.appointmentType || 'Free 15-Minute Consultation',
        // 'Preferred Date': data.preferredDate || '',
        // 'Preferred Time': data.preferredTime || '',
        // 'Session Format': data.sessionFormat || '',
        // 'Reason For Visit': data.reasonForVisit || 'Not specified',
        // 'Additional Information': data.additionalInfo || 'None provided',
        // 'Consultation Consent': data.consultationConsent || 'No',
        // 'Communication Consent': data.communicationConsent || 'No',
        // 'Privacy Consent': data.privacyConsent || 'No',
        // 'Type': data.type || 'Free Consultation',
        // NOTE: 'Submitted' should be Created Time type in Airtable (auto-filled)
        // 'Status': data.status || 'Pending Confirmation'

        console.log('Record to be sent to Airtable:', JSON.stringify(record, null, 2));
        console.log('Number of fields being sent:', Object.keys(record.fields).length);
        console.log('ZIP Code debug:', {
            raw: data.zipCode,
            type: typeof data.zipCode,
            length: data.zipCode ? data.zipCode.length : 'empty'
        });

        // Make request to Airtable
        const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;
        console.log('Airtable URL:', airtableUrl);
        
        console.log('Making request to Airtable...');
        const response = await fetch(airtableUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${airtableApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });

        console.log('Airtable response status:', response.status);
        console.log('Airtable response ok:', response.ok);

        if (response.ok) {
            const result = await response.json();
            console.log('Airtable success response:', result);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, id: result.id })
            };
        } else {
            const errorText = await response.text();
            console.error('=== AIRTABLE API ERROR ===');
            console.error('- Status:', response.status);
            console.error('- Status Text:', response.statusText);
            console.error('- Response Body:', errorText);
            console.error('- Request URL:', airtableUrl);
            console.error('- Request Headers:', JSON.stringify({
                'Authorization': `Bearer ${airtableApiKey.substring(0, 10)}...`,
                'Content-Type': 'application/json'
            }));
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
                console.error('- Parsed Error:', JSON.stringify(errorData, null, 2));
                
                // Log specific field errors if they exist
                if (errorData.error && errorData.error.details) {
                    console.error('- Field-specific errors:', JSON.stringify(errorData.error.details, null, 2));
                }
            } catch (e) {
                console.error('- Could not parse error as JSON');
            }
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to save to Airtable',
                    details: errorData || errorText,
                    status: response.status,
                    airtableError: errorData
                })
            };
        }

    } catch (error) {
        console.error('=== FUNCTION CAUGHT ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message,
                type: error.constructor.name
            })
        };
    }
};
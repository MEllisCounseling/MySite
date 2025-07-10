// Using built-in fetch (Node.js 18+) - remove node-fetch import

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
                body: JSON.stringify({ error: 'Airtable configuration missing' })
            };
        }

        // Prepare the record for Airtable
        const record = {
            fields: {
                'Name': data.name || '',
                'Email': data.email || '',
                'Phone': data.phone || '',
                'Message': data.message || '',
                'Preferred Time': data.preferredTime || '',
                'Submitted': new Date().toISOString(),
                'Type': data.type || 'Contact Form'
            }
        };

        console.log('Record to be sent to Airtable:', JSON.stringify(record, null, 2));

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
            console.error('Airtable API Error Details:');
            console.error('- Status:', response.status);
            console.error('- Status Text:', response.statusText);
            console.error('- Response Body:', errorText);
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
                console.error('- Parsed Error:', errorData);
            } catch (e) {
                console.error('- Could not parse error as JSON');
            }
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to save to Airtable',
                    details: errorData || errorText,
                    status: response.status
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
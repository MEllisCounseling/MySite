const fetch = require('node-fetch');

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
        // Parse the request body
        const data = JSON.parse(event.body);
        
        // Airtable configuration from environment variables
        const airtableApiKey = process.env.AIRTABLE_API_KEY;
        const airtableBaseId = process.env.AIRTABLE_BASE_ID;
        const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

        if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
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
                'Submitted': new Date().toISOString(),
                'Type': data.type || 'Contact Form'
            }
        };

        // Make request to Airtable
        const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;
        
        const response = await fetch(airtableUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${airtableApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });

        if (response.ok) {
            const result = await response.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, id: result.id })
            };
        } else {
            const error = await response.text();
            console.error('Airtable error:', error);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: 'Failed to save to Airtable' })
            };
        }

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
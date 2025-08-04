#!/bin/bash

# Test Form Submission Script
# Replace YOUR_SITE_URL with your actual Netlify site URL
# Example: https://your-site-name.netlify.app

SITE_URL="YOUR_SITE_URL"

echo "Testing consultation form submission..."
echo "Site URL: $SITE_URL"
echo

curl -X POST "$SITE_URL/.netlify/functions/airtable" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -v \
  -d '{
    "First Name": "Test",
    "Last Name": "User", 
    "Date Of Birth": "01/15/1990",
    "Gender": "female",
    "Address": "456 Test Avenue",
    "City": "Winchester",
    "State": "VA",
    "Zip Code": "22601",
    "Phone": "540-555-0199",
    "Email": "test.user@example.com",
    "Appointment Type": "Free 15-Minute Consultation",
    "Preferred Date": "2025-01-15",
    "Preferred Time": "10:30",
    "Session Format": "in-person",
    "Reason For Visit": "depression",
    "Additional Information": "Test submission to verify field mappings",
    "Consultation Consent": "Yes",
    "Communication Consent": "Yes", 
    "Privacy Consent": "Yes",
    "Type": "Free Consultation",
    "Submitted": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "Status": "Pending Confirmation"
  }'

echo
echo
echo "Expected response: JSON with success: true and an Airtable record ID"
echo "If you get an error, check:"
echo "1. Site URL is correct"  
echo "2. Environment variables are set in Netlify"
echo "3. Airtable field names match exactly (case-sensitive)"
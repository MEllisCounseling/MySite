# Debugging 500 Error - Step by Step Guide

## Most Likely Causes (in order):

### 1. Environment Variables Missing in Netlify
**Check in Netlify Dashboard:**
- Go to Site settings > Environment variables  
- Verify these 3 variables exist:
  - `AIRTABLE_API_KEY` = your_airtable_api_key
  - `THERAPY_BASE` = your_airtable_base_id  
  - `AIRTABLE_TABLE_NAME` = your_table_name

**If missing:**
1. Get your API key: https://airtable.com/account
2. Get your Base ID: Open your base → Help → API Documentation (shows at top)
3. Table name must be EXACT (case-sensitive)

### 2. Airtable Field Names Don't Match
**Your Airtable table needs these EXACT column names:**

**Personal Information:**
- First Name
- Last Name  
- Date Of Birth
- Gender
- Address
- City
- State
- Zip Code
- Phone
- Email

**Consultation Preferences:**
- Appointment Type
- Preferred Date
- Preferred Time
- Session Format

**Interest Information:**
- Reason For Visit
- Additional Information

**Consent Information:**
- Consultation Consent
- Communication Consent  
- Privacy Consent

**Metadata:**
- Type
- Submitted
- Status

### 3. Status Field Setup
**IMPORTANT:** Status field must be:
- Field Type: **Single Select** (not text)
- Options: Pending Confirmation, Confirmed, Completed, Cancelled, No Show
- Default: Pending Confirmation

## Quick Diagnostic Steps:

### Step 1: Check Netlify Function Logs
1. Go to Netlify Dashboard
2. Click on your site
3. Go to **Functions** tab
4. Click on **airtable** function
5. Check recent invocations for error details

### Step 2: Test Environment Variables
Create a test form submission to see the exact error in function logs.

### Step 3: Check Airtable Base
1. Open your Airtable base
2. Verify column names match EXACTLY (including spaces and capitalization)
3. Ensure Status is Single Select field type

## Common Fixes:

**Fix 1: Missing Environment Variables**
```
Add to Netlify:
AIRTABLE_API_KEY = key1234567890abcdef (from airtable.com/account)
THERAPY_BASE = appXXXXXXXXXXXXX (from your base API docs)  
AIRTABLE_TABLE_NAME = Consultations (exact table name)
```

**Fix 2: Wrong Field Names**
- Check for typos: "First Name" not "FirstName"
- Check spacing: "Date Of Birth" not "Date of Birth"
- Check capitalization: "Zip Code" not "zip code"

**Fix 3: Status Field Issue**
- Change Status field from Text to Single Select
- Add options: Pending Confirmation, Confirmed, Completed, Cancelled, No Show

## Error Code Meanings:

**500 Internal Server Error:**
- Environment variables missing
- Airtable API key invalid
- Base ID or table name wrong

**422 Unprocessable Entity:**
- Field names don't match
- Status field wrong type
- Required fields missing in Airtable

**401 Unauthorized:**
- Invalid API key
- Base permissions issue

## Next Steps:
1. Check Netlify function logs for specific error
2. Verify environment variables are set
3. Double-check Airtable field names
4. Test with corrected setup
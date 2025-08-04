# Troubleshooting Guide - Winchester Therapy Services

## Overview
This guide provides solutions to common issues with the Winchester Therapy Services website. Issues are organized by symptom and provide step-by-step solutions.

## Form Submission Issues

### Problem: "Consultation form not submitting"

#### Symptoms
- Form appears to submit but shows error message
- User receives "Error submitting consultation request" message
- Form hangs on "Submitting..." button

#### Solutions

**Step 1: Check Environment Variables**
1. Log into Netlify dashboard
2. Go to Site settings > Environment variables
3. Verify these variables exist and have values:
   - `AIRTABLE_API_KEY`
   - `THERAPY_BASE` 
   - `AIRTABLE_TABLE_NAME`

**Step 2: Check Function Logs**
1. Netlify dashboard > Functions tab
2. Click on `airtable` function
3. Check recent invocations for error messages
4. Common errors and fixes:
   - `Missing environment variables`: Add missing variables
   - `Airtable API Error 422`: Check table/field names match
   - `Network timeout`: Check Airtable service status

**Step 3: Test Airtable Connection**
1. Go to your Airtable base
2. Verify table name matches `AIRTABLE_TABLE_NAME` exactly (case-sensitive)
3. Check that all form fields exist as columns in Airtable
4. Test API key at https://airtable.com/api

### Problem: "Form submits but data not appearing in Airtable"

#### Check Field Mapping
Compare these form fields with your Airtable columns:

**Consultation Form Fields:**
- firstName → First Name
- lastName → Last Name  
- email → Email
- phone → Phone
- preferredDate → Preferred Date
- preferredTime → Preferred Time
- sessionFormat → Session Format
- reasonForVisit → Reason for Visit
- additionalInfo → Additional Info

**Solution:**
1. Ensure Airtable column names match exactly
2. Check for extra spaces or special characters
3. Verify field types are compatible (Text, Email, Date, etc.)

## Navigation Issues

### Problem: "Mobile menu not working"

#### Symptoms
- Hamburger menu doesn't open on mobile
- Menu opens but links don't work
- Menu doesn't close after clicking

#### Solutions

**Step 1: Check JavaScript Loading**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for JavaScript errors
4. If `script.js` won't load, check file path and version number

**Step 2: Clear Cache**
1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. Or use incognito/private browsing mode
3. Check if issue persists

**Step 3: Update CSS/JS Cache**
In `index.html`, increment version numbers:
```html
<link rel="stylesheet" href="css/styles.css?v=6">
<script src="js/script.js?v=6"></script>
```

### Problem: "Smooth scrolling not working"

#### Solutions
1. Check that section IDs match navigation links:
   - `#home` → `id="home"`
   - `#booking` → `id="booking"`
   - `#approach` → `id="approach"`
   - `#about` → `id="about"`
   - `#contact` → `id="contact"`

2. Verify JavaScript is loading (see above)

## Display Issues

### Problem: "Images not loading"

#### Symptoms
- Broken image icons
- Alt text showing instead of images
- Slow loading or missing images

#### Solutions

**Step 1: Check File Paths**
Verify these images exist in `assets/images/`:
- `Profile_Aug2018.jpg`
- `Boat_on_lake.jpg`

**Step 2: Check File Names**
- Ensure exact spelling and capitalization
- No spaces in filenames (use underscores or hyphens)
- Supported formats: JPG, PNG, WebP

**Step 3: Optimize Images**
- Large images (>500KB) may load slowly
- Recommended max width: 1200px for hero images
- Compress images before uploading

### Problem: "Site looks broken on mobile"

#### Solutions

**Step 1: Check Meta Viewport**
Ensure this exists in `<head>` section:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Step 2: Test Responsive Design**
1. Browser developer tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes
4. Check for horizontal scrolling issues

**Step 3: CSS Cache Issues**
- Hard refresh on mobile browser
- Update CSS version number
- Test in different mobile browsers

## Performance Issues

### Problem: "Site loading slowly"

#### Diagnostic Steps
1. **Test Speed**: Use PageSpeed Insights or GTmetrix
2. **Check Image Sizes**: Large images are common culprits
3. **Review Third-Party**: External services (Headway, Google Maps)

#### Solutions

**Optimize Images:**
- Compress images before upload
- Use appropriate formats (WebP when supported)
- Set max-width in CSS to prevent oversized loading

**Enable Caching:**
Netlify automatically handles caching via `netlify.toml`

**Check External Services:**
- Google Maps loading slowly: Consider lazy loading
- Headway link timing out: Contact Headway support

### Problem: "Site not updating after changes"

#### Solutions

**Step 1: Clear Browser Cache**
- Hard refresh: Ctrl+F5
- Clear browsing data for the site
- Try incognito/private mode

**Step 2: Check Deployment Status**
1. Netlify dashboard > Deploys tab
2. Verify latest deploy succeeded
3. Check deploy logs for errors

**Step 3: Force Cache Refresh**
Update version numbers in HTML:
```html
<link rel="stylesheet" href="css/styles.css?v=7">
<script src="js/script.js?v=7"></script>
```

## Booking System Issues

### Problem: "Headway booking link not working"

#### Symptoms
- Link doesn't open
- Opens to error page
- Shows outdated booking system

#### Solutions

**Step 1: Test Link**
Current link (line 74 in index.html):
```
https://care.headway.co/providers/michael-ellis-2?utm_source=pem&utm_medium=direct_link&utm_campaign=46377
```

**Step 2: Contact Headway**
If link fails:
1. Log into Headway provider portal
2. Generate new booking link
3. Update in `index.html`
4. Test new link before deployment

### Problem: "Time slots showing as unavailable"

#### Check JavaScript Logic
**File:** `js/script.js` lines 366-412

**Common Issues:**
- Date validation preventing future bookings
- Time slot logic disabling all options
- Browser timezone causing date conflicts

**Solution:**
Test with different dates and times to isolate the issue.

## Contact Information Issues

### Problem: "Phone/email links not working"

#### Check Link Format
**Phone links:**
```html
<a href="tel:5404317376">(540) 431-7376</a>
```
- `tel:` must have no spaces or dashes in number
- Display text can be formatted

**Email links:**
```html
<a href="mailto:Michaelfellislcsw@gmail.com">Michaelfellislcsw@gmail.com</a>
```
- `mailto:` must be exact email address
- No extra spaces or characters

### Problem: "Google Maps not loading"

#### Solutions
1. Check iframe code (lines 338-345)
2. Verify embed URL is current
3. Test alternative: link directly to Google Maps instead of embed

## Browser-Specific Issues

### Internet Explorer Issues
**Note:** Site not optimized for IE. Recommend upgrading to modern browser.

**Basic Support:**
- CSS Grid may not work (fallback layouts)
- JavaScript ES6 features may fail
- Recommend Edge, Chrome, Firefox, or Safari

### Safari Issues
- Test form submissions specifically
- Check date picker functionality
- Verify smooth scrolling works

### Mobile Browser Issues
- iOS Safari: Check viewport settings
- Android Chrome: Test form functionality
- Mobile Firefox: Verify responsive design

## Security and SSL Issues

### Problem: "Not secure" warning in browser

#### Solutions
1. **Check Netlify SSL Status:**
   - Site settings > Domain management
   - SSL certificate should show "Active"

2. **Mixed Content Issues:**
   - Ensure all resources use HTTPS
   - Check external links (images, scripts)

3. **Force HTTPS:**
   - Netlify automatically redirects HTTP to HTTPS
   - If not working, check domain configuration

### Problem: "CORS errors in browser console"

#### Check Function Configuration
**File:** `netlify/functions/airtable.js` lines 4-9

Ensure CORS headers are set:
```javascript
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};
```

## Emergency Procedures

### Site Completely Down
1. **Check Netlify Status:** https://www.netlifystatus.com/
2. **Check Domain DNS:** Use DNS checker tools
3. **Rollback:** Use Netlify's deploy rollback feature
4. **Alternative:** Upload backup files via Netlify drag-and-drop

### Form System Failure
1. **Add temporary message** to site about booking issues
2. **Update contact section** with alternative booking methods
3. **Check Airtable status** and API limits
4. **Consider backup form** (Google Forms, Typeform)

### Data Loss
1. **Airtable Backup:** Export current data immediately
2. **Git History:** Use version control to restore files
3. **Netlify Rollback:** Restore previous working version

## Getting Additional Help

### Documentation Resources
- **Netlify Docs:** https://docs.netlify.com/
- **Airtable API:** https://airtable.com/api
- **HTML/CSS/JS:** MDN Web Docs

### Support Contacts
- **Netlify Support:** Direct from dashboard
- **Airtable Support:** help.airtable.com
- **Domain Issues:** Contact domain registrar
- **Development Issues:** Contact development team

### Diagnostic Tools
- **Browser DevTools:** F12 for debugging
- **PageSpeed Insights:** Google speed testing
- **GTmetrix:** Performance analysis
- **DNS Checker:** DNS propagation testing

## Preventive Maintenance

### Weekly Checks
- [ ] Test form submission
- [ ] Verify all links work
- [ ] Check mobile responsiveness

### Monthly Checks
- [ ] Review Netlify function logs
- [ ] Test booking system integration
- [ ] Verify SSL certificate status
- [ ] Check site speed performance

### Quarterly Reviews
- [ ] Update contact information
- [ ] Review and test all functionality
- [ ] Check for broken external links
- [ ] Assess any new browser compatibility issues

---
*Last Updated: 2025-01-XX*
*Emergency Contact: Development Team*
*Review Schedule: Monthly*
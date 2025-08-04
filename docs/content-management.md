# Content Management Guide - Winchester Therapy Services

## Overview
This guide explains how to update content on the Winchester Therapy Services website without technical expertise. Most updates involve editing the `index.html` file.

## Quick Reference

### Most Common Updates
| Content Type | File Location | Section |
|--------------|---------------|---------|
| Contact Information | `index.html` | Lines 329-330, 365-367 |
| Business Hours | `index.html` | Add to contact section |
| Services Description | `index.html` | Lines 48-52, 274-278 |
| Bio Information | `index.html` | Lines 294-315 |
| Consultation Times | `index.html` | Line 179 (HTML5 time input) |
| Form Field Requirements | `index.html` | Lines 100-160 (Personal Info section) |

## Contact Information Updates

### Phone Number
**Locations to Update:**
```html
<!-- Footer contact (line ~367) -->
<a href="tel:5404317376">(540) 431-7376</a>

<!-- Location modal (line ~330) -->
Phone: <a href="tel:5404317376">(540) 431-7376</a>
```

**How to Update:**
1. Replace `5404317376` with new number (no spaces, no dashes)
2. Replace `(540) 431-7376` with formatted display number

### Email Address
**Locations to Update:**
```html
<!-- Footer contact (line ~366) -->
<a href="mailto:Michaelfellislcsw@gmail.com">Michaelfellislcsw@gmail.com</a>

<!-- Location modal (line ~329) -->
Email: <a href="mailto:Michaelfellislcsw@gmail.com">Michaelfellislcsw@gmail.com</a>
```

### Office Address
**Location to Update:**
```html
<!-- Multiple locations around lines 326-328, 357-360 -->
1220 Amherst Street, Floor 2<br>
Winchester, VA 22601
```

**Google Maps Update:**
If address changes, update the embedded map iframe (line ~338-345)

## Service Information Updates

### Hero Section Description
**Location:** Lines 48-52
```html
<p class="hero-description">
    Welcome to a therapy experience designed just for you. I'm Michael Ellis, LCSW, 
    committed to helping you broaden your perspective and discover peace and purpose 
    as you move forward in your life.
</p>
```

### Counseling Approach
**Location:** Lines 274-278
```html
<p class="approach-description">
    My counseling approach combines elements of Cognitive Behavioral Therapy (CBT) 
    and Solution-Focused Brief Therapy (SFBT), with additional influence from 
    Motivational Interviewing techniques.
</p>
```

## Biographical Information

### Background Section
**Location:** Lines 294-315
This section contains Michael's professional background and can be updated to reflect:
- New certifications or credentials
- Updated work history
- Current employment information
- Personal information updates

### Professional Title Updates
**Locations to Update:**
- Page title (line 6): `<title>Winchester Therapy Services LLC - Michael Ellis, LCSW</title>`
- Footer (line 374): `<p>Michael Ellis, LCSW | Licensed Clinical Social Worker</p>`

## Appointment Scheduling

### Consultation Duration
The site currently shows "15-minute consultation" in multiple places:
- Line 78: Button text and description
- Line 90: Modal title
- Line 101: JavaScript (appointmentType)

### Consultation Time Input
**Location:** `index.html` line 179
The consultation form now uses an HTML5 time input for better user experience:
```html
<input type="time" id="preferredTime" name="preferredTime" required>
```

**Benefits:**
- No time slots to maintain in code
- Users get native time picker interface  
- Automatic time formatting (HH:MM)
- Works great on mobile devices
- No JavaScript validation needed

### Headway Booking Link
**Location:** Line 74
```html
<a href="https://care.headway.co/providers/michael-ellis-2?utm_source=pem&utm_medium=direct_link&utm_campaign=46377" target="_blank" class="cta-button booking-cta">Book via Headway</a>
```

## Form Field Management

### Form Field Requirements
**Location:** `index.html` lines 100-160

**Current Required Fields:**
- First Name, Last Name
- City, State  
- Phone, Email
- All consent checkboxes

**Current Optional Fields:**
- Date of Birth
- Gender
- Address
- ZIP Code

**To Make a Field Required:**
Add `required` attribute to the input:
```html
<input type="text" id="fieldName" name="fieldName" required>
```

**To Make a Field Optional:**
Remove `required` attribute and asterisk from label:
```html
<label for="fieldName">Field Name</label>
<input type="text" id="fieldName" name="fieldName">
```

### Reason for Visit Options
**Location:** `index.html` lines 208-221
```html
<option value="anxiety">Anxiety</option>
<option value="depression">Depression</option>
<!-- Add, remove, or modify options as needed -->
```

### State Options (for client location)
**Location:** Lines 138-143
Currently limited to: Virginia, Maryland, West Virginia, Washington DC
Add additional states if practice expands geographically.

## Image Updates

### Profile Photo
**Current:** `assets/images/Profile_Aug2018.jpg` (line 270)
**To Update:**
1. Add new image to `assets/images/` folder
2. Update filename in HTML
3. Ensure image is professional quality and appropriately sized

### Hero Image
**Current:** `assets/images/Boat_on_lake.jpg` (line 56)
**Requirements:** 
- High resolution for responsive design
- Professional/therapeutic theme
- Good contrast for text overlay

## Adding New Content Sections

### New Service Areas
To add new therapy specializations:

1. **Update reason for visit** dropdown (lines 208-221)
2. **Add description** in approach section
3. **Consider separate** service pages if expanding significantly

### Testimonials Section (Future)
Recommended location: After the approach section (line 284)
**Note:** Ensure HIPAA compliance for any client testimonials

### Resources/Blog Section (Future)
Would require new HTML structure and potential backend additions

## Copyright and Legal Information

### Copyright Year
**Location:** Line 373
```html
<p>&copy; 2024 Winchester Therapy Services LLC. All rights reserved.</p>
```
Update annually or implement dynamic year with JavaScript.

### Website Credit
**Location:** Line 375
```html
<p class="website-credit">Website created by Power of the Purse LLC with Claude.AI</p>
```

## SEO and Meta Information

### Page Title
**Location:** Line 6
Update for SEO optimization or service changes

### Meta Description (Recommended Addition)
Add after line 6:
```html
<meta name="description" content="Professional therapy services in Winchester, VA. Michael Ellis, LCSW offers CBT, SFBT, and counseling for anxiety, depression, and life transitions.">
```

## Cache Management

### CSS and JavaScript Versioning
**Current versions:** `?v=5`
**Update when making changes to:**
- `css/styles.css`
- `js/script.js`

Increment version number to force cache refresh:
```html
<link rel="stylesheet" href="css/styles.css?v=6">
<script src="js/script.js?v=6"></script>
```

## Content Best Practices

### Professional Tone
- Maintain therapeutic, welcoming language
- Avoid medical claims or guarantees
- Use person-first language
- Keep content accessible (8th-grade reading level)

### Compliance Considerations
- **HIPAA**: No specific client information
- **State Licensing**: Ensure credentials are current
- **Insurance**: Update Headway integration as needed
- **Accessibility**: Use alt text for images, proper heading structure

### Regular Content Review

#### Monthly
- [ ] Verify contact information accuracy
- [ ] Check for outdated information
- [ ] Review professional credentials

#### Quarterly  
- [ ] Update biographical information
- [ ] Review service offerings
- [ ] Check external links (Headway, maps)

#### Annually
- [ ] Copyright year update
- [ ] Professional photo refresh consideration
- [ ] Comprehensive content audit

## Common Content Updates Workflow

### 1. Plan Your Changes
- List specific content to update
- Prepare new text, images, or information
- Consider impact on other sections

### 2. Make Updates
- Edit `index.html` for most content changes
- Update version numbers for CSS/JS if needed
- Test changes locally if possible

### 3. Deploy
- Follow deployment guide procedures
- Test on live site after deployment
- Verify all changes appear correctly

### 4. Document Changes
- Update `changelog.md` with changes made
- Note any new maintenance requirements
- Share updates with relevant team members

## Getting Help

### For Content Questions
- Review this guide for location references
- Check existing content for consistent tone and style
- Consider user experience impact of changes

### For Technical Issues
- Refer to `deployment-guide.md`
- Refer to `troubleshooting.md`
- Contact development support

---
*Last Updated: 2025-01-XX*
*Maintained by: Content Management Team*
*Next Review: Monthly*
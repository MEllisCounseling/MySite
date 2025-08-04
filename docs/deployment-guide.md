# Deployment Guide - Winchester Therapy Services

## Overview
This guide covers how to deploy, update, and maintain the Winchester Therapy Services website on Netlify.

## Prerequisites

### Required Accounts
- **GitHub Account**: For source code management
- **Netlify Account**: For hosting and deployment
- **Airtable Account**: For form data management
- **Domain Registrar**: For custom domain (if applicable)

### Required Tools
- **Git**: For version control
- **Text Editor**: VS Code, Sublime Text, or similar
- **Web Browser**: For testing and verification

## Initial Setup

### 1. Environment Variables
Configure these environment variables in Netlify:

```
AIRTABLE_API_KEY=your_airtable_api_key_here
THERAPY_BASE=your_airtable_base_id_here  
AIRTABLE_TABLE_NAME=your_table_name_here
```

#### Getting Airtable Credentials
1. **API Key**: 
   - Go to https://airtable.com/account
   - Generate an API key
   - Keep this secret and secure

2. **Base ID**:
   - Open your Airtable base
   - Go to Help > API Documentation
   - Base ID is shown at the top

3. **Table Name**:
   - Use the exact name of your table (case-sensitive)
   - Common names: "Consultations", "Contacts", "Leads"

### 2. Netlify Configuration
The `netlify.toml` file handles most configuration automatically:

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[build.environment]  
  NODE_VERSION = "18"
```

### 3. Domain Setup (Optional)
If using a custom domain:
1. **In Netlify**: Go to Site settings > Domain management
2. **Add custom domain**: Enter your domain name
3. **DNS Configuration**: Update your DNS records as instructed
4. **SSL Certificate**: Netlify provides automatic HTTPS

## Deployment Process

### Method 1: Git-Based Deployment (Recommended)

#### Initial Deployment
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial site deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Log into Netlify dashboard
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Configure build settings (usually auto-detected)

3. **Set Environment Variables**:
   - Go to Site settings > Environment variables
   - Add the three Airtable variables listed above

4. **Deploy**:
   - Netlify automatically builds and deploys
   - Site will be available at your Netlify URL

#### Ongoing Deployments
Every push to the main branch triggers automatic deployment:

```bash
# Make your changes
git add .
git commit -m "Describe your changes"
git push origin main
# Netlify automatically deploys
```

### Method 2: Manual Deployment

#### Drag and Drop (For Quick Updates)
1. **Prepare Files**: Ensure all files are in project root
2. **Netlify Dashboard**: Go to your site dashboard
3. **Deploy Section**: Drag your project folder to the deploy area
4. **Note**: Environment variables must be set separately

## File Management

### Key Files to Update
- **index.html**: Main content, contact info, services
- **css/styles.css**: Styling and visual changes  
- **js/script.js**: Form behavior and interactions
- **assets/images/**: Photos and visual content

### Cache Busting
When updating CSS or JavaScript:

```html
<!-- Update version number in index.html -->
<link rel="stylesheet" href="css/styles.css?v=6">
<script src="js/script.js?v=6"></script>
```

## Testing Before Deployment

### Local Testing
1. **Open Files**: Use a local web server or open `index.html` directly
2. **Form Testing**: Test form submissions (requires live environment)
3. **Responsive Testing**: Check mobile, tablet, desktop views
4. **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge

### Staging Environment
Netlify provides branch previews:
1. **Create Feature Branch**: `git checkout -b feature-update`
2. **Push Changes**: `git push origin feature-update`
3. **Preview Deploy**: Netlify creates a preview URL
4. **Test**: Verify everything works on preview
5. **Merge**: Merge to main when ready

## Post-Deployment Verification

### Checklist
- [ ] **Site Loads**: Main page displays correctly
- [ ] **Navigation**: All menu items work
- [ ] **Forms**: Test consultation form submission
- [ ] **External Links**: Headway booking link works
- [ ] **Mobile View**: Responsive design functions
- [ ] **Contact Info**: Phone, email, address are correct
- [ ] **Images**: All images load properly
- [ ] **SSL**: Site loads with HTTPS

### Form Testing
1. **Submit Test Form**: Use test data
2. **Check Airtable**: Verify data appears in your base
3. **Email Confirmation**: Confirm you receive notifications
4. **Error Handling**: Test with invalid data

## Maintenance Tasks

### Weekly
- [ ] **Test Forms**: Submit a test consultation request
- [ ] **Check Links**: Verify external links still work
- [ ] **Review Submissions**: Check Airtable for new consultations

### Monthly  
- [ ] **Content Review**: Update any outdated information
- [ ] **Performance Check**: Test site loading speed
- [ ] **Security Review**: Check for any alerts or issues
- [ ] **Backup Check**: Ensure Airtable data is backed up

### Quarterly
- [ ] **Full Site Review**: Comprehensive testing
- [ ] **Content Updates**: Refresh bio, services, contact info
- [ ] **Dependencies**: Update any outdated packages
- [ ] **Analytics Review**: Check performance metrics

## Rollback Procedures

### Quick Rollback (Netlify)
1. **Netlify Dashboard**: Go to Deploys tab
2. **Previous Deploy**: Find the last working version
3. **Restore**: Click "Publish deploy" on the working version
4. **Verify**: Check that site is functioning

### Git Rollback
```bash
# View recent commits
git log --oneline

# Rollback to specific commit
git revert <commit-hash>
git push origin main
```

## Troubleshooting

### Common Issues

#### Forms Not Working
1. **Check Environment Variables**: Verify Airtable credentials
2. **Check Function Logs**: Netlify Functions tab shows errors
3. **Test API Connection**: Verify Airtable API is accessible

#### Site Not Updating
1. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
2. **Check Deploy Status**: Netlify deploy logs
3. **Verify Git Push**: Ensure changes pushed to main branch

#### SSL/Domain Issues
1. **Check DNS Settings**: Verify domain configuration
2. **SSL Status**: Netlify should auto-provision certificates
3. **Contact Support**: Netlify support for domain issues

### Getting Help
- **Netlify Support**: help.netlify.com
- **Airtable Support**: support.airtable.com  
- **Git Documentation**: git-scm.com/doc
- **Developer Community**: Stack Overflow, GitHub Discussions

## Security Best Practices

### Environment Variables
- **Never commit API keys** to Git repository
- **Use Netlify's environment variable** system
- **Regularly rotate API keys** for security

### Access Control
- **Limit repository access** to authorized users only
- **Use strong passwords** for all accounts
- **Enable two-factor authentication** where available

### Monitoring
- **Regular security updates** for any dependencies
- **Monitor deploy logs** for unusual activity
- **Keep backup contacts** for critical account recovery

---
*Last Updated: 2025-01-XX*
*Review Schedule: Monthly*
*Contact: Development Team*
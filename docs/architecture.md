# Winchester Therapy Services - System Architecture

## Overview
Winchester Therapy Services is a static website with serverless backend functionality, designed for a therapy practice. The architecture prioritizes simplicity, security, and reliable form handling for patient consultations.

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Custom responsive design with mobile-first approach
- **Vanilla JavaScript**: Client-side form handling and interactive elements
- **No Framework**: Lightweight approach for fast loading and minimal dependencies

### Backend & Infrastructure
- **Netlify**: Static site hosting and serverless functions
- **Node.js 18**: Runtime environment for serverless functions
- **Airtable**: Database and CRM for form submissions
- **DNS/SSL**: Managed through Netlify

### Third-Party Integrations
- **Headway.co**: Insurance billing and appointment scheduling
- **Google Maps**: Embedded location services
- **Airtable API**: Data storage and management

## System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Site   │    │  Netlify Edge   │    │    Airtable     │
│                 │    │                 │    │                 │
│  • HTML/CSS/JS  │◄──►│ • CDN           │◄──►│ • Form Data     │
│  • Assets       │    │ • Functions     │    │ • CRM           │
│  • Forms        │    │ • Build/Deploy  │    │ • API           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   Environment   │    │   Headway.co    │
│                 │    │                 │    │                 │
│  • Form Input   │    │ • Secrets       │    │ • Scheduling    │
│  • Validation   │    │ • Config        │    │ • Billing       │
│  • UX/UI        │    │ • Variables     │    │ • Insurance     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Directory Structure

```
winchester-therapy-services/
├── docs/                    # Documentation (this folder)
│   ├── airtable-layouts.md  # Form field documentation  
│   ├── architecture.md      # System architecture (this file)
│   └── changelog.md         # Version history
├── netlify/
│   └── functions/
│       └── airtable.js      # Serverless form handler
├── assets/
│   └── images/              # Site images and media
├── css/
│   └── styles.css           # Main stylesheet
├── js/
│   └── script.js            # Client-side JavaScript
├── index.html               # Main site file
├── netlify.toml             # Netlify configuration
└── README.md                # Project overview
```

## Data Flow

### 1. Page Load Process
```
User Request → Netlify CDN → Static Assets Served → JavaScript Initialized
```

### 2. Form Submission Process
```
Form Input → Client Validation → AJAX Request → Netlify Function → 
Airtable API → Database Storage → User Confirmation
```

### 3. Third-Party Booking Flow
```
User Click → External Redirect → Headway.co → Appointment Scheduled → 
Email Confirmation → Practice Management
```

## Core Components

### Frontend Components (`index.html`, `js/script.js`)

#### Navigation System
- **Mobile-responsive hamburger menu**
- **Smooth scrolling navigation**
- **Active section highlighting**
- **Accessibility features**

#### Modal System
- **Location modal**: Office address and directions
- **Consultation modal**: Free consultation booking form
- **Event-driven show/hide functionality**

#### Form System  
- **Real-time validation**
- **Date/time constraints** 
- **Multi-section organization**
- **Error handling and user feedback**

### Backend Components (`netlify/functions/airtable.js`)

#### API Handler
- **CORS configuration** for cross-origin requests
- **Request method validation** (POST only)
- **Environment variable validation**
- **Comprehensive error logging**

#### Data Processing
- **JSON request parsing**
- **Field mapping and transformation** 
- **Timestamp generation**
- **Data sanitization**

### Configuration (`netlify.toml`)

#### Build Settings
- **Node.js 18 runtime**
- **Static file publishing**
- **Function directory specification**

#### Security Headers
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff  
- **X-XSS-Protection**: enabled
- **Referrer-Policy**: strict-origin-when-cross-origin

#### Caching Strategy
- **Static assets**: 1 year cache
- **CSS/JS files**: Immutable caching
- **Images**: Long-term caching

## Security Architecture

### Data Protection
- **HTTPS/SSL** encryption for all traffic
- **Environment variables** for sensitive API keys
- **CORS policies** to prevent unauthorized access
- **Input validation** on both client and server

### Privacy Compliance
- **HIPAA considerations** with secure data handling
- **Consent checkboxes** for user permissions
- **Minimal data collection** approach
- **Secure third-party integrations**

### Error Handling
- **Graceful degradation** for network issues
- **User-friendly error messages**
- **Comprehensive server-side logging**
- **Fallback contact methods**

## Performance Architecture

### Frontend Optimization
- **Minimal JavaScript dependencies**
- **Optimized image loading**
- **CSS cache busting** via versioning
- **Mobile-first responsive design**

### Backend Optimization  
- **Serverless functions** for automatic scaling
- **CDN delivery** via Netlify Edge
- **Efficient API calls** to Airtable
- **Minimal cold start times**

## Deployment Pipeline

### Build Process
1. **Static assets** copied to build directory
2. **Functions** deployed to Netlify serverless
3. **Environment variables** configured
4. **DNS/SSL** automatically managed

### Release Strategy
- **Git-based deployments** from main branch
- **Instant rollback** capability
- **Preview deployments** for testing
- **Zero-downtime deployments**

## Monitoring & Analytics

### Current Monitoring
- **Netlify function logs** for serverless functions
- **Client-side error handling** with user feedback
- **Form submission tracking** via Airtable

### Recommended Additions
- **Google Analytics** for user behavior
- **Uptime monitoring** for availability
- **Performance monitoring** for load times
- **Form conversion tracking**

## Scalability Considerations

### Current Capacity
- **Netlify CDN** handles traffic spikes automatically
- **Serverless functions** scale on demand
- **Airtable** suitable for small to medium practice volume

### Growth Planning
- **Database migration** path to more robust solutions
- **Advanced booking system** integration options
- **Multi-location** support architecture
- **Staff portal** expansion possibilities

## Maintenance & Updates

### Regular Maintenance
- **Dependency updates** for Node.js functions
- **SSL certificate** renewal (automatic)
- **Content updates** via direct file editing
- **Form field modifications** as needed

### Version Control
- **Git repository** for source control
- **Branching strategy** for feature development
- **Documentation updates** with code changes
- **Change log maintenance**

## Business Continuity

### Backup Strategy
- **Airtable data** export capabilities
- **Git repository** as source backup  
- **Netlify deployment** history preservation
- **Contact information** redundancy

### Disaster Recovery
- **Multiple contact methods** available
- **External booking system** (Headway) as backup
- **Static site** resilience to server issues
- **Quick deployment** to alternative hosting

---
*Last Updated: 2025-01-XX*
*System Version: 1.0*
*Architecture Review Due: Quarterly*
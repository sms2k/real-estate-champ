# Real Estate Champ - WordPress Plugin

AI-powered property marketing platform WordPress plugin with Progressive Web App (PWA) support.

## Overview

This WordPress plugin provides the backend infrastructure for the Real Estate Champ platform. It works in conjunction with the Next.js PWA app to allow realtors to:

- Upload property images via mobile app
- Chat with AI to gather property information
- Generate blog posts and social media content
- Publish directly to WordPress and social platforms
- Access everything from their phone via PWA

## Features

- ✅ **REST API Endpoints** for PWA integration
- ✅ **Custom Database Tables** for properties, images, and content
- ✅ **Google Gemini AI Integration** for content generation
- ✅ **Social Media Management** (Facebook, Instagram, LinkedIn, Google Business)
- ✅ **WordPress Admin Interface** for settings and management
- ✅ **Multi-User Support** with WordPress authentication
- ✅ **Offline Sync** capability for mobile app

## Installation

### Step 1: Install the Plugin

1. **Upload Plugin Files**
   ```bash
   # From the real-estate-champ directory
   cp -r wordpress-plugin/real-estate-champ /path/to/wordpress/wp-content/plugins/
   ```

   Or use WordPress admin:
   - Zip the `wordpress-plugin/real-estate-champ` folder
   - Go to WordPress Admin > Plugins > Add New > Upload Plugin
   - Upload the zip file and click "Install Now"

2. **Activate the Plugin**
   - Go to Plugins page in WordPress admin
   - Find "Real Estate Champ" and click "Activate"

3. **Check Activation**
   - Upon activation, the plugin will create necessary database tables
   - You should see a new "Real Estate Champ" menu item in the WordPress admin sidebar

### Step 2: Configure API Keys

1. **Go to Settings**
   - Navigate to Real Estate Champ > Settings in WordPress admin

2. **Configure Google AI**
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Paste it in the "Google AI API Key" field

3. **Configure Social Media Apps** (if using direct posting)
   - **Facebook/Instagram**: Get App ID and Secret from [Facebook Developers](https://developers.facebook.com/)
   - **LinkedIn**: Get Client ID and Secret from [LinkedIn Developers](https://www.linkedin.com/developers/)
   - **Google Business**: Follow the setup guide in the settings page

4. **Save Settings**

### Step 3: Deploy the PWA App

1. **Configure PWA**
   ```bash
   cd /path/to/real-estate-champ
   cp .env.example .env
   ```

2. **Edit .env file**
   ```env
   NEXT_PUBLIC_WORDPRESS_URL="https://your-wordpress-site.com"
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   npm start
   ```

   Or deploy to Vercel/Netlify:
   - Push code to GitHub
   - Connect to Vercel/Netlify
   - Add `NEXT_PUBLIC_WORDPRESS_URL` environment variable
   - Deploy

4. **Update WordPress Settings**
   - Go to Real Estate Champ > Settings
   - Enable PWA
   - Enter PWA App URL (e.g., `https://app.yoursite.com`)
   - Save settings

## Usage

### For WordPress Administrators

1. **Dashboard**
   - View statistics (properties, content generated, connected accounts)
   - Quick actions for creating properties
   - Recent properties list

2. **Properties**
   - View all user properties
   - Properties are created via the mobile app

3. **Settings**
   - Configure API keys
   - Enable/disable PWA
   - Set PWA app URL

4. **Connected Accounts**
   - View users' connected social media accounts
   - Accounts are connected via the mobile app

### For Realtors (Users)

1. **Access the Mobile App**
   - Visit the PWA URL (provided by admin)
   - On mobile: Tap "Add to Home Screen" to install
   - Login with WordPress credentials

2. **Create Property Listing**
   - Open the mobile app
   - Tap "New Property"
   - Upload images (drag & drop or camera)
   - Chat with AI to provide property details
   - AI extracts structured data

3. **Generate Content**
   - Select property
   - Choose platforms (Blog, Facebook, Instagram, LinkedIn, Google Business)
   - Tap "Generate Content"
   - Review AI-generated content

4. **Publish**
   - Preview generated content
   - Edit if needed
   - Publish to selected platforms
   - Blog posts automatically create WordPress posts
   - Social media posts go to connected accounts

## API Endpoints

The plugin exposes the following REST API endpoints at `/wp-json/real-estate-champ/v1/`:

### Properties
- `GET /properties` - List user's properties
- `POST /properties` - Create new property
- `GET /properties/{id}` - Get single property
- `PUT /properties/{id}` - Update property
- `DELETE /properties/{id}` - Delete property
- `POST /properties/{id}/images` - Upload images

### Content
- `POST /properties/{id}/generate-content` - Generate content
- `POST /content/{id}/publish` - Publish content

### Chat
- `POST /chat` - Chat with AI

### Social Accounts
- `GET /social-accounts` - List connected accounts
- `POST /social-accounts` - Connect new account

### Sync
- `POST /sync` - Sync offline data

### Settings
- `GET /settings` - Get plugin settings

## Database Tables

The plugin creates the following custom tables:

- `wp_rec_properties` - Property listings
- `wp_rec_property_images` - Property images
- `wp_rec_generated_content` - AI-generated content
- `wp_rec_social_accounts` - Connected social media accounts
- `wp_rec_settings` - Plugin settings and API keys

## Authentication

The plugin uses WordPress's built-in authentication:

- PWA app authenticates via WordPress cookies
- Users must be logged into WordPress
- Standard WordPress roles and capabilities apply
- Only authenticated users can access API endpoints

## Security

- All API endpoints require authentication
- API keys are stored encrypted in the database
- File uploads are validated and sanitized
- SQL queries use prepared statements
- Nonces for AJAX requests
- XSS protection on all outputs

## Requirements

- **WordPress**: 5.6 or higher
- **PHP**: 7.4 or higher
- **MySQL**: 5.7 or higher
- **WordPress User Roles**: Editor or higher for content creation

## Troubleshooting

### Plugin Won't Activate
- Check PHP version (must be 7.4+)
- Check WordPress version (must be 5.6+)
- Check error logs in `wp-content/debug.log`

### API Endpoints Return 404
- Go to Settings > Permalinks and click "Save Changes" to flush rewrite rules
- Verify plugin is activated

### PWA Can't Connect to WordPress
- Verify `NEXT_PUBLIC_WORDPRESS_URL` is correct in PWA `.env`
- Check WordPress site allows CORS from PWA domain
- Ensure user is logged into WordPress

### AI Content Generation Fails
- Verify Google AI API key is valid
- Check API key has sufficient quota
- Review error messages in WordPress debug log

## Support

For issues or questions:
1. Check the main README.md for general setup
2. Review WordPress debug logs
3. Open an issue on GitHub

## License

ISC

## Changelog

### 1.0.0
- Initial release
- Property management
- AI content generation with Google Gemini
- Social media integration
- PWA support
- WordPress admin interface

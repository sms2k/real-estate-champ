# WordPress Integration Guide

## Overview

Real Estate Champ can be used in two modes:

1. **SaaS Mode** (Recommended) - Standalone platform with optional WordPress sync
2. **WordPress Plugin Mode** - Runs entirely within WordPress

## Option 1: SaaS Mode with WordPress Sync (Recommended)

### Why This is Better:
- ✅ Mobile PWA app for easy photo uploads
- ✅ Faster performance
- ✅ Automatic backups
- ✅ Multi-platform posting (not just WordPress)
- ✅ Advanced AI features
- ✅ Usage tracking and analytics

### Setup Instructions:

1. **Deploy Real Estate Champ SaaS**
   ```bash
   # Set environment variables
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_AI_API_KEY="your-gemini-api-key"
   STRIPE_SECRET_KEY="your-stripe-key"
   ```

2. **Connect Your WordPress Site**
   - In Real Estate Champ dashboard, go to Settings
   - Click "Connect WordPress Site"
   - Enter your WordPress URL: `https://yoursite.com`
   - Enter WordPress Application Password
   - Click "Connect"

3. **Auto-Post to WordPress**
   - When generating content, check "Post to WordPress"
   - AI-generated blog posts auto-publish to your WordPress blog
   - Property listings can sync to custom post types
   - Photos uploaded to WordPress media library

### Creating WordPress Application Password:

1. Log into your WordPress admin
2. Go to Users → Profile
3. Scroll to "Application Passwords"
4. Enter name: "Real Estate Champ"
5. Click "Add New Application Password"
6. Copy the generated password
7. Paste into Real Estate Champ settings

## Option 2: WordPress Plugin Mode

### Installation:

1. **Upload Plugin**
   ```bash
   # Copy plugin folder to WordPress
   cp -r wordpress-plugin/real-estate-champ /path/to/wordpress/wp-content/plugins/
   ```

2. **Activate Plugin**
   - Go to WordPress admin → Plugins
   - Find "Real Estate Champ"
   - Click "Activate"

3. **Configure Plugin**
   - Go to Settings → Real Estate Champ
   - Enter your Google AI API key
   - Configure social media connections
   - Set default options

### Plugin Features:

- Custom post type for properties
- Property management dashboard in WordPress admin
- AI content generation for posts
- Social media scheduling
- Property widgets for frontend
- Shortcodes for embedding properties

### Using the Plugin:

**Add New Property:**
1. Go to Real Estate Champ → Add New
2. Upload property photos
3. Fill in details (price, beds, baths, etc.)
4. Click "Publish"

**Generate Content:**
1. Open any property
2. Click "Generate Content" button
3. Select platforms (Facebook, Instagram, Blog, etc.)
4. Wait for AI to generate posts
5. Review and edit if needed
6. Click "Publish to Social Media"

### Plugin Shortcodes:

**Display single property:**
```php
[rec_property id="123"]
```

**Display property grid:**
```php
[rec_properties limit="6" orderby="date"]
```

**Property search form:**
```php
[rec_search]
```

**Featured properties:**
```php
[rec_featured max="3"]
```

## Mobile App + WordPress

### Best of Both Worlds:

1. **Install PWA on Phone**
   - Realtors use mobile app for photos
   - Easy on-site property capture
   - Fast uploads over cellular

2. **Auto-Sync to WordPress**
   - Properties appear in WordPress automatically
   - Blog posts published to your website
   - SEO-optimized content

3. **Social Media Posting**
   - One-click posting to all platforms
   - Scheduled posts
   - Performance tracking

### Workflow:

```
Realtor's Phone (PWA) → Real Estate Champ SaaS → WordPress Website
                     → Facebook
                     → Instagram
                     → LinkedIn
                     → Google Business Profile
```

## Database Setup

### For WordPress Plugin Mode:

The plugin creates these database tables:
- `wp_rec_properties` - Property listings
- `wp_rec_property_images` - Property photos
- `wp_rec_generated_content` - AI-generated content
- `wp_rec_social_accounts` - Connected social media accounts

### For SaaS Mode:

Uses PostgreSQL database with full schema in `prisma/schema.prisma`

## API Integration

### WordPress REST API Endpoints:

```
GET /wp-json/real-estate-champ/v1/properties
POST /wp-json/real-estate-champ/v1/properties
GET /wp-json/real-estate-champ/v1/properties/{id}
PUT /wp-json/real-estate-champ/v1/properties/{id}
DELETE /wp-json/real-estate-champ/v1/properties/{id}
POST /wp-json/real-estate-champ/v1/properties/{id}/generate-content
```

### Authentication:

Uses WordPress Application Passwords for secure API access.

## Comparison: SaaS vs Plugin

| Feature | SaaS Mode | WordPress Plugin |
|---------|-----------|------------------|
| Mobile PWA | ✅ Yes | ❌ No (browser only) |
| Speed | ⚡ Very Fast | 🐌 Medium |
| AI Features | ✅ Full access | ⚠️ Limited |
| Multi-site | ✅ Yes | ❌ No |
| Updates | 🔄 Automatic | 📦 Manual |
| Backups | ✅ Included | ❌ DIY |
| Cost | 💰 Monthly | 🆓 Free (self-host) |
| Support | 🎯 Priority | 📧 Email only |

## Recommended Setup

For most realtors, we recommend:

### **SaaS Mode with WordPress Sync**

**Advantages:**
1. Use mobile app for property photos (fastest workflow)
2. AI generates content automatically
3. Content auto-posts to WordPress blog
4. Also posts to social media
5. Get usage analytics
6. Automatic backups
7. Regular updates
8. Priority support

**Setup Time:** 30 minutes
**Monthly Cost:** $49-$299 depending on plan
**Best For:** Active realtors who want the best tools

### WordPress Plugin Mode (Free)

**Best For:**
- Developers who want to customize
- Agencies running multiple client sites
- Budget-conscious single users
- Those who prefer self-hosting

**Setup Time:** 2-3 hours
**Monthly Cost:** $0 (hosting costs only)
**Limitations:** No mobile PWA, manual updates

## Migration

### From Plugin to SaaS:

```bash
# Export data from WordPress
wp rec export --file=properties.json

# Import to SaaS
curl -X POST https://your-saas-url.com/api/import \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@properties.json"
```

### From SaaS to Plugin:

```bash
# Export from SaaS
curl https://your-saas-url.com/api/export > export.json

# Import to WordPress
wp rec import export.json
```

## Support

- **SaaS Support:** support@realestatechamp.com (24/7)
- **Plugin Support:** GitHub Issues
- **Documentation:** https://docs.realestatechamp.com
- **Video Tutorials:** https://youtube.com/realestatechamp

## Next Steps

1. ✅ Choose your deployment mode (SaaS recommended)
2. ✅ Follow setup instructions above
3. ✅ Install mobile PWA on your phone
4. ✅ Add your first property
5. ✅ Generate AI content
6. ✅ Post to WordPress + social media
7. ✅ Watch the leads come in!

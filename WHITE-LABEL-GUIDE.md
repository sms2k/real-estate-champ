# White-Label Customization Guide

This guide explains how to customize Real Estate Champ with your own branding.

## Table of Contents
- [Quick Start](#quick-start)
- [Branding Options](#branding-options)
- [Advanced Customization](#advanced-customization)
- [Best Practices](#best-practices)

---

## Quick Start

### Method 1: During Setup Wizard (Recommended)

When you first set up Real Estate Champ, the setup wizard (Step 4) will ask for:
- Company Name
- Company Logo URL

These settings will be applied immediately.

### Method 2: Settings Page (After Setup)

1. Log in as SUPER_ADMIN
2. Click "Settings" in the top navigation
3. Update your branding settings
4. Click "Save Settings"

---

## Branding Options

### Company Information

#### Company Name
- **Where it appears**: Header, page titles, email footers
- **Format**: Plain text
- **Example**: "Acme Real Estate"
- **Default**: "Real Estate Champ"

#### Tagline
- **Where it appears**: Login page, marketing pages
- **Format**: Short phrase (recommended: under 50 characters)
- **Example**: "Your Trusted Real Estate Partner"
- **Default**: "AI-Powered Property Marketing"

#### Support Email
- **Where it appears**: Contact forms, error pages
- **Format**: Valid email address
- **Example**: support@acmerealestate.com

#### Website URL
- **Where it appears**: Footer, email signatures
- **Format**: Full URL including https://
- **Example**: https://www.acmerealestate.com

### Visual Branding

#### Company Logo
- **Where it appears**: Header (all pages), login page
- **Format**: Image URL (PNG, JPG, or SVG)
- **Recommended size**: 200x50 pixels
- **Recommended format**: PNG with transparent background
- **Example**: https://yourdomain.com/images/logo.png

**Image Requirements:**
- Must be publicly accessible via HTTPS
- Transparent background works best
- Keep file size under 100KB for fast loading
- High-resolution for retina displays (2x size recommended)

#### Favicon
- **Where it appears**: Browser tab, bookmarks
- **Format**: ICO or PNG
- **Recommended size**: 32x32 pixels (or 16x16, 48x48)
- **Example**: https://yourdomain.com/favicon.ico

#### Primary Color
- **Where it appears**: Buttons, links, active states
- **Format**: Hexadecimal color code
- **Example**: #2563eb (blue)
- **Default**: #2563eb

**Color Guidelines:**
- Choose a color that represents your brand
- Ensure good contrast with white text
- Test accessibility (WCAG AA minimum)

#### Secondary Color
- **Where it appears**: Hover states, accents
- **Format**: Hexadecimal color code
- **Example**: #1e40af (darker blue)
- **Default**: #1e40af

**Recommended**: Use a darker shade of your primary color

---

## Advanced Customization

### Hosting Your Logo

#### Option 1: Host on Your Server
Upload your logo to your Real Estate Champ installation:

```bash
# Upload logo to public directory
cp your-logo.png /var/www/real-estate-champ/public/images/

# Use in settings
Logo URL: https://yourdomain.com/images/your-logo.png
```

#### Option 2: Use External CDN
Upload to a CDN like Cloudflare, AWS S3, or Imgix:

```
Logo URL: https://cdn.yourdomain.com/logo.png
```

#### Option 3: Use Image Hosting Service
Upload to Imgur, ImageKit, or similar:

```
Logo URL: https://i.imgur.com/yourimage.png
```

### Creating Color Schemes

Use these tools to create harmonious color schemes:
- **Adobe Color**: https://color.adobe.com
- **Coolors**: https://coolors.co
- **Material Palette**: https://materialpalette.com

**Example Color Schemes:**

**Professional Blue**
- Primary: #2563eb
- Secondary: #1e40af

**Luxury Gold**
- Primary: #d97706
- Secondary: #b45309

**Modern Green**
- Primary: #059669
- Secondary: #047857

**Classic Red**
- Primary: #dc2626
- Secondary: #b91c1c

### Custom CSS (Advanced)

For advanced users who want to customize beyond the settings page:

1. Create a custom CSS file:
```bash
nano /var/www/real-estate-champ/public/custom.css
```

2. Add your custom styles:
```css
/* Custom button styles */
.custom-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Custom header background */
.custom-header {
  background: #1a202c;
}
```

3. Import in your layout (requires code modification)

**Note**: Custom CSS changes may be overwritten during updates. Document your changes.

---

## Best Practices

### Logo Design

✅ **Do:**
- Use vector format (SVG) when possible
- Provide transparent background (PNG)
- Use high resolution (2x or 3x for retina)
- Keep it simple and readable
- Test on dark and light backgrounds
- Optimize file size (use TinyPNG or similar)

❌ **Don't:**
- Use low-resolution images
- Include too much detail
- Use busy backgrounds
- Make it too wide (max 300px recommended)

### Color Selection

✅ **Do:**
- Test colors for accessibility (use WebAIM Color Contrast Checker)
- Use consistent colors across your brand
- Consider colorblind users
- Test in both light and dark mode (if supported)

❌ **Don't:**
- Use colors that are too similar to each other
- Choose colors with poor contrast
- Use more than 3-4 brand colors
- Forget to test on mobile devices

### Image Hosting

✅ **Do:**
- Use HTTPS URLs (required)
- Use reliable hosting (99.9% uptime)
- Enable CDN for faster loading
- Set proper cache headers
- Backup your images

❌ **Don't:**
- Use HTTP (insecure)
- Host on unreliable free services
- Use temporary image hosting
- Forget to renew domain/hosting

---

## Testing Your Branding

### Checklist

- [ ] Logo appears in header on all pages
- [ ] Logo loads quickly (under 1 second)
- [ ] Logo is clear and readable
- [ ] Company name appears correctly
- [ ] Colors match your brand guidelines
- [ ] Favicon appears in browser tab
- [ ] Test on mobile devices
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test with slow internet connection
- [ ] Verify all links work (website URL, support email)

### Browser Testing

Test your branding in:
- Chrome (desktop and mobile)
- Firefox (desktop and mobile)
- Safari (Mac, iPhone, iPad)
- Edge (desktop)

### Mobile Testing

On mobile devices, verify:
- Logo scales properly
- Text is readable
- Colors are visible
- Touch targets are large enough
- Layout doesn't break

---

## Troubleshooting

### Logo Not Appearing

**Problem**: Logo doesn't show in header

**Solutions**:
1. Verify URL is accessible (open in browser)
2. Check URL uses HTTPS (not HTTP)
3. Verify image file exists and isn't corrupted
4. Check browser console for errors (F12)
5. Clear browser cache (Ctrl+Shift+R)
6. Verify settings were saved (check Settings page)

### Logo Looks Blurry

**Problem**: Logo appears pixelated or blurry

**Solutions**:
1. Use higher resolution image (2x or 3x size)
2. Use SVG format instead of PNG/JPG
3. Ensure original image is high quality
4. Don't upscale small images

### Colors Not Changing

**Problem**: Colors remain default blue

**Solutions**:
1. Verify hex code format (#2563eb)
2. Save settings after changing
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors
5. Clear application cache

### Favicon Not Updating

**Problem**: Old favicon still appears

**Solutions**:
1. Clear browser cache completely
2. Close all browser tabs
3. Restart browser
4. Wait 5-10 minutes for CDN propagation
5. Try incognito/private browsing mode

---

## Examples

### Example 1: Small Real Estate Agency

```
Company Name: Hometown Realty
Tagline: Serving Our Community Since 1985
Logo: https://hometownrealty.com/logo.png
Primary Color: #dc2626 (red)
Secondary Color: #b91c1c (dark red)
Support Email: hello@hometownrealty.com
Website: https://hometownrealty.com
```

### Example 2: Luxury Real Estate

```
Company Name: Prestige Properties
Tagline: Exclusive Luxury Homes
Logo: https://cdn.prestigeproperties.com/logo.svg
Primary Color: #d97706 (gold)
Secondary Color: #b45309 (dark gold)
Favicon: https://prestigeproperties.com/favicon.ico
Support Email: concierge@prestigeproperties.com
Website: https://prestigeproperties.com
```

### Example 3: Modern Startup

```
Company Name: HomeAI
Tagline: Smart Real Estate Technology
Logo: https://homeai.io/images/logo-white-bg.png
Primary Color: #8b5cf6 (purple)
Secondary Color: #7c3aed (dark purple)
Support Email: support@homeai.io
Website: https://homeai.io
```

---

## FAQ

### Can I change branding after setup?
Yes! Log in as SUPER_ADMIN and go to Settings → White-Label Settings.

### Do I need to restart the application after changing branding?
No, changes take effect immediately. You may need to refresh your browser.

### Can I use my own domain?
Yes, configure your domain to point to your server. Update NEXTAUTH_URL in .env file.

### Can I remove "Real Estate Champ" completely?
Yes, set your Company Name in settings and it will replace all mentions of "Real Estate Champ".

### Can regular users (realtors) change branding?
No, only SUPER_ADMIN users can modify branding settings.

### Can I customize colors beyond primary/secondary?
Advanced users can add custom CSS. Contact support for assistance.

### What happens if my logo URL breaks?
The platform will show your company name as text instead of the logo.

### Can I use an animated GIF as a logo?
Yes, but it's not recommended. Static images provide better performance.

### How do I test changes before making them live?
Use the preview feature in Settings, or test in a staging environment first.

### Can I white-label the mobile PWA icon?
Currently, the PWA icon is set during deployment. Contact support for custom PWA branding.

---

## Getting Help

Need assistance with white-labeling?

**Before contacting support:**
1. Check this guide thoroughly
2. Verify your image URLs are accessible
3. Clear your browser cache
4. Test in incognito mode

**When contacting support, include:**
- Screenshots of the issue
- Your branding settings (Settings page screenshot)
- Browser and device information
- Console errors (if any)

---

## Updates and Changes

This white-label system is designed to be update-safe. Your branding settings are stored in the database and will persist through software updates.

**After updating Real Estate Champ:**
- Verify branding still appears correctly
- Test all pages
- Clear browser cache if needed

---

## Summary

White-labeling Real Estate Champ is simple:

1. Log in as SUPER_ADMIN
2. Go to Settings
3. Update your branding information
4. Save changes
5. Refresh browser to see changes

Your platform will now display your brand identity to all users!

For advanced customization beyond these options, please contact support.

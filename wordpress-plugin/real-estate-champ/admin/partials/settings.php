<?php
/**
 * Settings page template.
 */

// Check user capabilities
if (!current_user_can('manage_options')) {
    return;
}

// Save settings message
if (isset($_GET['settings-updated'])) {
    add_settings_error('rec_messages', 'rec_message', __('Settings Saved', 'real-estate-champ'), 'updated');
}

settings_errors('rec_messages');
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <div class="rec-settings-container">
        <form action="options.php" method="post">
            <?php
            settings_fields('rec_general_settings');
            do_settings_sections('rec_general_settings');
            submit_button('Save Settings');
            ?>
        </form>

        <div class="rec-info-box">
            <h2><?php _e('Setup Instructions', 'real-estate-champ'); ?></h2>

            <h3><?php _e('1. Google AI API Key', 'real-estate-champ'); ?></h3>
            <ol>
                <li><?php _e('Go to', 'real-estate-champ'); ?> <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
                <li><?php _e('Click "Create API Key"', 'real-estate-champ'); ?></li>
                <li><?php _e('Copy the key and paste it above', 'real-estate-champ'); ?></li>
            </ol>

            <h3><?php _e('2. Facebook/Instagram', 'real-estate-champ'); ?></h3>
            <ol>
                <li><?php _e('Go to', 'real-estate-champ'); ?> <a href="https://developers.facebook.com/" target="_blank">Facebook Developers</a></li>
                <li><?php _e('Create a new app or use existing', 'real-estate-champ'); ?></li>
                <li><?php _e('Add "Facebook Login" and "Instagram Basic Display" products', 'real-estate-champ'); ?></li>
                <li><?php _e('Copy App ID and App Secret', 'real-estate-champ'); ?></li>
                <li><?php _e('Add OAuth redirect: ', 'real-estate-champ'); ?><code><?php echo rest_url('real-estate-champ/v1/oauth/facebook'); ?></code></li>
            </ol>

            <h3><?php _e('3. LinkedIn', 'real-estate-champ'); ?></h3>
            <ol>
                <li><?php _e('Go to', 'real-estate-champ'); ?> <a href="https://www.linkedin.com/developers/" target="_blank">LinkedIn Developers</a></li>
                <li><?php _e('Create a new app', 'real-estate-champ'); ?></li>
                <li><?php _e('Request "Sign In with LinkedIn" and "Share on LinkedIn" permissions', 'real-estate-champ'); ?></li>
                <li><?php _e('Copy Client ID and Client Secret', 'real-estate-champ'); ?></li>
                <li><?php _e('Add OAuth redirect: ', 'real-estate-champ'); ?><code><?php echo rest_url('real-estate-champ/v1/oauth/linkedin'); ?></code></li>
            </ol>

            <h3><?php _e('4. Google Business Profile', 'real-estate-champ'); ?></h3>
            <ol>
                <li><?php _e('Go to', 'real-estate-champ'); ?> <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
                <li><?php _e('Enable "Google My Business API"', 'real-estate-champ'); ?></li>
                <li><?php _e('Create OAuth 2.0 credentials', 'real-estate-champ'); ?></li>
                <li><?php _e('Add scope: https://www.googleapis.com/auth/business.manage', 'real-estate-champ'); ?></li>
                <li><?php _e('Copy Client ID and Client Secret', 'real-estate-champ'); ?></li>
            </ol>

            <h3><?php _e('5. Progressive Web App (PWA)', 'real-estate-champ'); ?></h3>
            <ol>
                <li><?php _e('Deploy the Next.js PWA app to your server or hosting service', 'real-estate-champ'); ?></li>
                <li><?php _e('Enter the deployed URL in the PWA App URL field above', 'real-estate-champ'); ?></li>
                <li><?php _e('Users can then access the mobile app and it will connect to this WordPress site', 'real-estate-champ'); ?></li>
            </ol>
        </div>
    </div>
</div>

<style>
.rec-settings-container {
    max-width: 1200px;
}

.rec-info-box {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 20px;
    margin-top: 30px;
}

.rec-info-box h2 {
    margin-top: 0;
}

.rec-info-box h3 {
    margin-top: 20px;
    margin-bottom: 10px;
}

.rec-info-box ol {
    margin-left: 20px;
}

.rec-info-box code {
    background: #fff;
    padding: 2px 6px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 12px;
}
</style>
